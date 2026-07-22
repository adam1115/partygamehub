"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  guessNumber,
  restartGuessNumberGame,
} from "@/services/game.service";

interface Player {
  id: string;
  uid: string;
  name: string;
  avatar: string;
  isHost: boolean;
  ready: boolean;
  score: number;
}

interface Props {
  min: number;
  max: number;
  winner: string;
  isHost: boolean;
  roomCode: string;
  currentPlayer: Player | null;
}

interface Guess {
  id: string;
  player: string;
  guess: number;
}

export default function GuessNumberGame({
  min,
  max,
  winner,
  isHost,
  roomCode,
  currentPlayer,
}: Props) {
  const params = useParams();
  const actualRoomCode = (params.roomCode as string) || roomCode;

  const [guess, setGuess] = useState("");
  const [loading, setLoading] = useState(false);
  const [guesses, setGuesses] = useState<Guess[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "rooms", actualRoomCode, "guesses"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGuesses(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Guess, "id">),
        }))
      );
    });

    return () => unsubscribe();
  }, [actualRoomCode]);

  async function handleGuess() {
    if (!guess.trim()) {
      alert("請輸入數字");
      return;
    }

    const number = Number(guess);

    if (Number.isNaN(number)) {
      alert("請輸入正確數字");
      return;
    }

    if (number < min || number > max) {
      alert(`請輸入 ${min} ~ ${max} 之間`);
      return;
    }

    try {
      setLoading(true);

      // 使用 Firebase 中的玩家名稱，而不是 localStorage
      const playerName = currentPlayer?.name || "玩家";

      await guessNumber(actualRoomCode, playerName, number);

      setGuess("");
    } catch (error) {
      console.error(error);
      alert("猜測失敗");
    } finally {
      setLoading(false);
    }
  }

  async function handleRestart() {
    try {
      await restartGuessNumberGame(actualRoomCode);
    } catch (error) {
      console.error(error);
      alert("重新開始失敗");
    }
  }

  if (winner) {
    return (
      <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-zinc-900 p-10">
        <div className="text-center">
          <h1 className="text-6xl">🎉</h1>

          <h2 className="mt-6 text-4xl font-bold text-green-400">
            {winner} 猜中了！
          </h2>

          <p className="mt-4 text-gray-400">本局遊戲結束</p>

          {isHost ? (
            <button
              onClick={handleRestart}
              className="mt-8 w-full rounded-xl bg-purple-600 py-4 text-2xl font-bold hover:bg-purple-500 transition"
            >
              🔄 再玩一次
            </button>
          ) : (
            <p className="mt-8 text-lg text-gray-400">
              等待房主開始下一局...
            </p>
          )}
        </div>

        <div className="mt-10 rounded-xl bg-zinc-800 p-5">
          <h3 className="mb-4 text-2xl font-bold">📜 本局猜測紀錄</h3>

          {guesses.length === 0 ? (
            <p className="text-gray-400">尚無猜測紀錄</p>
          ) : (
            guesses.map((item) => (
              <div
                key={item.id}
                className="mb-2 flex justify-between rounded-lg bg-zinc-700 p-3"
              >
                <span>{item.player}</span>
                <span>{item.guess}</span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-zinc-900 p-8">
      <h1 className="text-center text-5xl font-bold">🎲 猜數字</h1>

      <p className="mt-8 text-center text-gray-400">目前範圍</p>

      <h2 className="mt-3 text-center text-6xl font-bold text-green-400">
        {min} ~ {max}
      </h2>

      <div className="mt-10">
        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleGuess();
            }
          }}
          placeholder="請輸入數字"
          className="w-full rounded-xl bg-zinc-800 p-4 text-center text-2xl outline-none"
        />

        <button
          onClick={handleGuess}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-purple-600 py-4 text-2xl font-bold hover:bg-purple-500 disabled:bg-zinc-700 disabled:cursor-not-allowed transition"
        >
          {loading ? "送出中..." : "猜！"}
        </button>
      </div>

      <div className="mt-10 rounded-xl bg-zinc-800 p-5">
        <h3 className="mb-4 text-2xl font-bold">📜 猜測紀錄</h3>

        {guesses.length === 0 ? (
          <p className="text-gray-400">尚無猜測紀錄</p>
        ) : (
          guesses.map((item) => (
            <div
              key={item.id}
              className="mb-2 flex justify-between rounded-lg bg-zinc-700 p-3"
            >
              <span>{item.player}</span>
              <span>{item.guess}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
