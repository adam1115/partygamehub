"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Props {
  roomCode: string;
}

interface Score {
  id: string;
  name: string;
  wins: number;
  guesses: number;
}

export default function Leaderboard({
  roomCode,
}: Props) {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "rooms", roomCode, "scores")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Score, "id">),
      }));

      list.sort((a, b) => {
        if (b.wins !== a.wins) {
          return b.wins - a.wins;
        }

        return a.guesses - b.guesses;
      });

      setScores(list);
    });

    return () => unsubscribe();
  }, [roomCode]);

  return (
    <div className="rounded-2xl bg-zinc-900 p-6">

      <h2 className="mb-5 text-3xl font-bold">
        🏆 排行榜
      </h2>

      {scores.length === 0 ? (
        <p className="text-gray-400">
          尚無資料
        </p>
      ) : (
        scores.map((player, index) => (
          <div
            key={player.id}
            className="mb-3 rounded-xl bg-zinc-800 p-4"
          >
            <div className="flex items-center justify-between">

              <div>

                <div className="text-xl font-bold">

                  {index === 0 && "🥇 "}
                  {index === 1 && "🥈 "}
                  {index === 2 && "🥉 "}

                  {player.name}

                </div>

                <div className="mt-2 text-sm text-gray-400">
                  猜測次數：{player.guesses}
                </div>

              </div>

              <div className="text-right">

                <div className="text-3xl font-bold text-yellow-400">
                  {player.wins}
                </div>

                <div className="text-sm text-gray-400">
                  勝場
                </div>

              </div>

            </div>

          </div>
        ))
      )}

    </div>
  );
}