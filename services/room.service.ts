import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  orderBy,
  QueryConstraint,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { generateRoomCode } from "@/lib/room";
import { createGuessNumberGame } from "./game.service";
import { sendSystemMessage, playerLeft } from "./chat.service";

export interface PlayerInfo {
  uid: string;
  name: string;
  avatar: string;
}

export async function createRoom(
  roomName: string,
  host: PlayerInfo
): Promise<string> {
  const roomCode = generateRoomCode();

  await setDoc(doc(db, "rooms", roomCode), {
    roomCode,
    roomName,
    hostUid: host.uid,
    status: "waiting",
    selectedGame: "guess-number",
    createdAt: serverTimestamp(),
  });

  await addDoc(
    collection(db, "rooms", roomCode, "players"),
    {
      uid: host.uid,
      name: host.name,
      avatar: host.avatar,
      isHost: true,
      ready: false,
      score: 0,
      joinedAt: serverTimestamp(),
    }
  );

  return roomCode;
}

export async function joinRoom(
  roomCode: string,
  player: PlayerInfo
): Promise<string> {
  roomCode = roomCode.trim();

  const roomRef = doc(db, "rooms", roomCode);
  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) {
    throw new Error("房間不存在");
  }

  const playersSnap = await getDocs(
    collection(db, "rooms", roomCode, "players")
  );

  const exists = playersSnap.docs.find(
    (doc) => doc.data().uid === player.uid
  );

  if (!exists) {
    await addDoc(
      collection(db, "rooms", roomCode, "players"),
      {
        uid: player.uid,
        name: player.name,
        avatar: player.avatar,
        isHost: false,
        ready: false,
        score: 0,
        joinedAt: serverTimestamp(),
      }
    );
  }

  return roomCode;
}

export async function updatePlayerReady(
  roomCode: string,
  playerId: string,
  ready: boolean
) {
  await updateDoc(
    doc(db, "rooms", roomCode, "players", playerId),
    {
      ready,
    }
  );
}

export async function resetAllReady(
  roomCode: string
) {
  const playersSnap = await getDocs(
    collection(db, "rooms", roomCode, "players")
  );

  await Promise.all(
    playersSnap.docs.map((player) =>
      updateDoc(player.ref, {
        ready: false,
      })
    )
  );
}

export async function updateSelectedGame(
  roomCode: string,
  game: string
) {
  await updateDoc(
    doc(db, "rooms", roomCode),
    {
      selectedGame: game,
    }
  );

  await resetAllReady(roomCode);
}

export async function startGame(
  roomCode: string
) {
  const roomRef = doc(db, "rooms", roomCode);

  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) {
    throw new Error("房間不存在");
  }

  const room = roomSnap.data();

  switch (room.selectedGame) {
    case "guess-number":
      await createGuessNumberGame(roomCode);
      break;

    default:
      await createGuessNumberGame(roomCode);
      break;
  }

  await updateDoc(roomRef, {
    status: "playing",
  });
}

export async function kickPlayer(
  roomCode: string,
  playerId: string
) {
  await deleteDoc(
    doc(db, "rooms", roomCode, "players", playerId)
  );
}

/**
 * 玩家離開房間
 * 1. 如果離開的是普通玩家，直接移除
 * 2. 如果離開的是房主，轉移房主權給 joinedAt 最早的玩家
 * 3. 如果房間沒有玩家了，刪除房間
 */
export async function leaveRoom(
  roomCode: string,
  playerId: string
) {
  try {
    // 1. 取得離開的玩家資訊
    const playerRef = doc(db, "rooms", roomCode, "players", playerId);
    const playerSnap = await getDoc(playerRef);

    if (!playerSnap.exists()) {
      throw new Error("玩家不存在");
    }

    const leavingPlayer = playerSnap.data();
    const isHostLeaving = leavingPlayer.isHost;

    // 2. 取得所有玩家
    const playersSnap = await getDocs(
      collection(db, "rooms", roomCode, "players")
    );

    const allPlayers = playersSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 3. 建立 Batch 操作
    const batch = writeBatch(db);

    // 3.1 移除離開的玩家
    batch.delete(playerRef);

    // 3.2 如果房主離開，轉移房主
    if (isHostLeaving) {
      // 找出 joinedAt 最早的其他玩家
      const otherPlayers = allPlayers.filter((p) => p.id !== playerId);

      if (otherPlayers.length > 0) {
        // 按 joinedAt 排序，找最早加入的玩家
        const nextHost = otherPlayers.sort((a, b) => {
          const timeA = a.joinedAt?.toMillis?.() ?? 0;
          const timeB = b.joinedAt?.toMillis?.() ?? 0;
          return timeA - timeB;
        })[0];

        // 更新新房主
        const newHostPlayerRef = doc(
          db,
          "rooms",
          roomCode,
          "players",
          nextHost.id
        );
        batch.update(newHostPlayerRef, {
          isHost: true,
        });

        // 更新房間的 hostUid
        const roomRef = doc(db, "rooms", roomCode);
        batch.update(roomRef, {
          hostUid: nextHost.uid,
        });

        // 發送聊天系統消息：新房主通知
        await sendSystemMessage(
          roomCode,
          `👑 ${nextHost.name} 已成為新房主`
        );
      }
    }

    // 3.3 執行 batch
    await batch.commit();

    // 4. 檢查房間是否還有玩家
    const remainingPlayersSnap = await getDocs(
      collection(db, "rooms", roomCode, "players")
    );

    if (remainingPlayersSnap.size === 0) {
      // 房間沒有玩家了，刪除房間
      await deleteRoom(roomCode);
    } else {
      // 發送玩家離開的聊天消息
      await sendSystemMessage(
        roomCode,
        `👋 ${leavingPlayer.name} 離開了房間`
      );
    }
  } catch (error) {
    console.error("leaveRoom 錯誤:", error);
    throw error;
  }
}

export async function deleteRoom(
  roomCode: string
) {
  try {
    const batch = writeBatch(db);

    // 1. 刪除所有玩家
    const playersSnap = await getDocs(
      collection(db, "rooms", roomCode, "players")
    );

    playersSnap.docs.forEach((playerDoc) => {
      batch.delete(playerDoc.ref);
    });

    // 2. 刪除所有 guesses
    const guessesSnap = await getDocs(
      collection(db, "rooms", roomCode, "guesses")
    );

    guessesSnap.docs.forEach((guessDoc) => {
      batch.delete(guessDoc.ref);
    });

    // 3. 刪除所有 scores
    const scoresSnap = await getDocs(
      collection(db, "rooms", roomCode, "scores")
    );

    scoresSnap.docs.forEach((scoreDoc) => {
      batch.delete(scoreDoc.ref);
    });

    // 4. 刪除 game/current
    const gameRef = doc(db, "rooms", roomCode, "game", "current");
    batch.delete(gameRef);

    // 5. 刪除房間文件
    const roomRef = doc(db, "rooms", roomCode);
    batch.delete(roomRef);

    // 6. 執行 batch
    await batch.commit();

    // 7. 發送聊天系統消息
    await sendSystemMessage(roomCode, `🗑 房間已解散`);
  } catch (error) {
    console.error("deleteRoom 錯誤:", error);
    throw error;
  }
}
