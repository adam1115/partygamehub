"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateRoomCode } from "@/lib/room";

export default function CreateRoomPage() {
  const router = useRouter();

  const [roomName, setRoomName] = useState("");
  const [playerName, setPlayerName] = useState("");

  function handleCreateRoom() {
    const roomCode = generateRoomCode();

    router.push(`/room/${roomCode}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900 p-10 shadow-2xl">

        <h1 className="mb-8 text-center text-4xl font-bold">
          🎉 建立房間
        </h1>

        <div className="space-y-6">

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              房間名稱
            </label>

            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="例如：今晚聚會"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              玩家名稱
            </label>

            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="輸入你的名字"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>

          <button
            onClick={handleCreateRoom}
            className="w-full rounded-xl bg-purple-600 py-4 text-lg font-bold transition hover:bg-purple-500"
          >
            建立房間
          </button>

        </div>

      </div>
    </main>
  );
}