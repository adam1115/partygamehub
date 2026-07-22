"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { joinRoom } from "@/services/room.service";

export default function JoinRoomPage() {
  const router = useRouter();

  const { user } = useAuth();

  const [roomCode, setRoomCode] = useState("");

  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <h1>請先登入 LINE</h1>
      </main>
    );
  }

  async function handleJoin() {
    if (!roomCode.trim()) {
      alert("請輸入房號");
      return;
    }

    try {
      setLoading(true);

      await joinRoom(roomCode.trim());

      router.push(`/room/${roomCode.trim()}`);
    } catch (err) {
      console.error(err);
      alert("加入房間失敗");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">

      <div className="w-full max-w-lg rounded-2xl bg-zinc-900 p-8">

        <div className="mb-8 flex items-center gap-4">

          <img
            src={user.photoURL || "/avatar.png"}
            className="h-16 w-16 rounded-full"
            alt=""
          />

          <div>

            <div className="text-xl font-bold">
              {user.displayName}
            </div>

            <div className="text-gray-400">
              使用 LINE 身分加入
            </div>

          </div>

        </div>

        <h1 className="mb-6 text-3xl font-bold">
          🚪 加入房間
        </h1>

        <input
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          placeholder="請輸入六位數房號"
          className="mb-6 w-full rounded-xl bg-zinc-800 p-4 outline-none"
        />

        <button
          disabled={loading}
          onClick={handleJoin}
          className="w-full rounded-xl bg-green-600 py-4 text-xl font-bold hover:bg-green-500 disabled:opacity-50"
        >
          {loading ? "加入中..." : "加入房間"}
        </button>

      </div>

    </main>
  );
}