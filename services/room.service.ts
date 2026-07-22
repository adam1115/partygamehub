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
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { generateRoomCode } from "@/lib/room";
import { createGuessNumberGame } from "./game.service";

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

export async function leaveRoom(
  roomCode: string,
  playerId: string
) {
  await deleteDoc(
    doc(db, "rooms", roomCode, "players", playerId)
  );
}

export async function deleteRoom(
  roomCode: string
) {
  const playersSnap = await getDocs(
    collection(db, "rooms", roomCode, "players")
  );

  await Promise.all(
    playersSnap.docs.map((player) =>
      deleteDoc(player.ref)
    )
  );

  await deleteDoc(
    doc(db, "rooms", roomCode)
  );
}