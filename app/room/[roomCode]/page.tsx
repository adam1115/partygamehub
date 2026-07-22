"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  collection,
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { useAuth } from "@/context/AuthContext";

import {
  startGame,
  updatePlayerReady,
  updateSelectedGame,
  kickPlayer,
  leaveRoom,
  deleteRoom,
} from "@/services/room.service";

import GuessNumberGame from "@/components/GuessNumberGame";
import Leaderboard from "@/components/Leaderboard";
import GameSelector from "@/components/GameSelector";
// 下一步加入
import RoomChat from "@/components/RoomChat";

interface Room {
  roomCode: string;
  roomName: string;
  status: string;
  selectedGame: string;
}

interface Player {
  id: string;

  uid: string;

  name: string;

  avatar: string;

  isHost: boolean;

  ready: boolean;

  score: number;
}

interface Game {
  type: string;
  answer: number;
  min: number;
  max: number;
  winner: string;
}

export default function RoomPage() {
  const router = useRouter();

  const params = useParams();

  const roomCode = params.roomCode as string;

  const { user } = useAuth();

  const [room, setRoom] =
    useState<Room | null>(null);

  const [players, setPlayers] =
    useState<Player[]>([]);

  const [game, setGame] =
    useState<Game | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!roomCode) return;

    const unsubscribeRoom = onSnapshot(
      doc(db, "rooms", roomCode),
      (snapshot) => {
        if (snapshot.exists()) {
          setRoom(snapshot.data() as Room);
        } else {
          setRoom(null);
        }

        setLoading(false);
      }
    );

    const unsubscribePlayers =
      onSnapshot(
        collection(
          db,
          "rooms",
          roomCode,
          "players"
        ),
        (snapshot) => {
          setPlayers(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...(doc.data() as Omit<
                Player,
                "id"
              >),
            }))
          );
        }
      );

    const unsubscribeGame =
      onSnapshot(
        doc(
          db,
          "rooms",
          roomCode,
          "game",
          "current"
        ),
        (snapshot) => {
          if (snapshot.exists()) {
            setGame(snapshot.data() as Game);
          } else {
            setGame(null);
          }
        }
      );

    return () => {
      unsubscribeRoom();
      unsubscribePlayers();
      unsubscribeGame();
    };
  }, [roomCode]);

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <h1>請先登入</h1>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <h1>載入中...</h1>
      </main>
    );
  }

  if (!room) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <h1>房間不存在</h1>
      </main>
    );
  }

  const me =
    players.find(
      (player) =>
        player.uid === user.uid
    ) || null;

  const isHost =
    me?.isHost ?? false;

  const everyoneReady =
    players.length > 0 &&
    players.every((player) => player.ready);

  const readyCount =
    players.filter(
      (player) => player.ready
    ).length;

  async function handleLeave() {
    if (!me) return;

    if (isHost) {
      if (
        confirm(
          "離開後將解散房間，確定？"
        )
      ) {
        await deleteRoom(roomCode);
        router.push("/");
      }

      return;
    }

    if (
      confirm("確定離開房間？")
    ) {
      await leaveRoom(
        roomCode,
        me.id
      );

      router.push("/");
    }
  }

  if (
    room.status === "playing" &&
    game
  ) {
    return (
      <main className="min-h-screen bg-zinc-950 p-8 text-white">

        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">

          <div className="lg:col-span-2">

            <GuessNumberGame
              min={game.min}
              max={game.max}
              winner={game.winner}
              isHost={isHost}
            />

          </div>

          <Leaderboard
            roomCode={roomCode}
          />

        </div>

      </main>
    );
  }
    return (
    <main className="min-h-screen bg-zinc-950 p-10 text-white">

      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">

        {/* 左邊 */}

        <div className="lg:col-span-2">

          <h1 className="text-5xl font-bold">
            🎉 {room.roomName}
          </h1>

          <p className="mt-4 text-xl">
            房號：
            <span className="ml-2 text-purple-400">
              {room.roomCode}
            </span>
          </p>

          <div className="mt-8">

            <GameSelector
              value={room.selectedGame}
              onChange={(game) => {
                if (isHost) {
                  updateSelectedGame(
                    roomCode,
                    game
                  );
                }
              }}
            />

            {!isHost && (
              <p className="mt-3 text-gray-400">
                等待房主選擇遊戲...
              </p>
            )}

          </div>

          {/* RoomChat 下一步加入 */}

          ="mt-10 rounded-2xl bg-zinc-900 p-6">

          <RoomChat roomCode={roomCode} />

        {/* 右邊 */}

        <div className="rounded-2xl bg-zinc-900 p-6">

          <div className="mb-6 flex items-center justify-between">

            <h2 className="text-2xl font-bold">

              玩家 ({players.length})

            </h2>

            <span className="rounded-full bg-zinc-800 px-4 py-2 font-bold text-green-400">

              {readyCount} / {players.length}

            </span>

          </div>

          <div className="space-y-3">

            {players.map((player) => (

              <div
                key={player.id}
                className="flex items-center justify-between rounded-xl bg-zinc-800 p-4"
              >

                <div className="flex items-center gap-4">

                  <img
                    src={
                      player.avatar ||
                      "/avatar.png"
                    }
                    className="h-14 w-14 rounded-full"
                    alt=""
                  />

                  <div>

                    <div className="text-lg font-bold">

                      {player.isHost
                        ? "👑 "
                        : ""}

                      {player.name}

                    </div>

                    <div
                      className={
                        player.ready
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >

                      {player.ready
                        ? "已準備"
                        : "未準備"}

                    </div>

                  </div>

                </div>

                {isHost &&
                  !player.isHost && (

                    <button
                      onClick={() => {

                        if (
                          confirm(
                            `踢除 ${player.name}？`
                          )
                        ) {
                          kickPlayer(
                            roomCode,
                            player.id
                          );
                        }

                      }}
                      className="rounded-lg bg-red-600 px-4 py-2 hover:bg-red-500"
                    >

                      ❌

                    </button>

                  )}

              </div>

            ))}

          </div>

          <button
            onClick={() => {

              if (!me) return;

              updatePlayerReady(
                roomCode,
                me.id,
                !me.ready
              );

            }}
            className={`mt-6 w-full rounded-xl py-4 text-xl font-bold ${
              me?.ready
                ? "bg-red-600 hover:bg-red-500"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >

            {me?.ready
              ? "取消準備"
              : "準備"}

          </button>

          {isHost &&
            everyoneReady && (

              <button
                onClick={() =>
                  startGame(
                    roomCode
                  )
                }
                className="mt-4 w-full rounded-xl bg-green-600 py-4 text-xl font-bold hover:bg-green-500"
              >

                ▶ 開始遊戲

              </button>

            )}

          <button
            onClick={handleLeave}
            className="mt-4 w-full rounded-xl bg-zinc-700 py-4 font-bold hover:bg-zinc-600"
          >

            {isHost
              ? "🗑 解散房間"
              : "🚪 離開房間"}

          </button>

        </div>

      </div>

    </main>
  );
}