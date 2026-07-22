import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  deleteDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function createGuessNumberGame(roomCode: string) {
  const answer = Math.floor(Math.random() * 50000) + 1;

  await setDoc(doc(db, "rooms", roomCode, "game", "current"), {
    type: "guess-number",
    answer,
    min: 1,
    max: 50000,
    winner: "",
  });

  console.log("🎲 遊戲建立完成，答案：", answer);
}

export async function restartGuessNumberGame(roomCode: string) {
  const guessesRef = collection(db, "rooms", roomCode, "guesses");
  const guessesSnap = await getDocs(guessesRef);

  await Promise.all(
    guessesSnap.docs.map((d) => deleteDoc(d.ref))
  );

  const answer = Math.floor(Math.random() * 50000) + 1;

  await updateDoc(
    doc(db, "rooms", roomCode, "game", "current"),
    {
      answer,
      min: 1,
      max: 50000,
      winner: "",
    }
  );
}

export async function guessNumber(
  roomCode: string,
  playerName: string,
  guess: number
) {
  const gameRef = doc(db, "rooms", roomCode, "game", "current");

  const snap = await getDoc(gameRef);

  if (!snap.exists()) {
    throw new Error("找不到遊戲");
  }

  const game = snap.data();

  let min = game.min;
  let max = game.max;

  await addDoc(
    collection(db, "rooms", roomCode, "guesses"),
    {
      player: playerName,
      guess,
      createdAt: serverTimestamp(),
    }
  );

  // ⭐ 每猜一次統計一次
  const scoreRef = doc(
    db,
    "rooms",
    roomCode,
    "scores",
    playerName
  );

  await setDoc(
    scoreRef,
    {
      name: playerName,
      wins: 0,
      guesses: 0,
    },
    {
      merge: true,
    }
  );

  await updateDoc(scoreRef, {
    guesses: increment(1),
  });

  if (guess === game.answer) {
    await updateDoc(gameRef, {
      winner: playerName,
    });

    await updateDoc(scoreRef, {
      wins: increment(1),
    });

    return;
  }

  if (guess < game.answer && guess >= min) {
    min = guess + 1;
  }

  if (guess > game.answer && guess <= max) {
    max = guess - 1;
  }

  await updateDoc(gameRef, {
    min,
    max,
  });
}