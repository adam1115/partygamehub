"use client";

interface Player {
  id: string;
  name: string;
  isHost: boolean;
  ready: boolean;
}

interface Props {
  players: Player[];
}

export default function PlayerList({
  players,
}: Props) {
  return (
    <div className="rounded-2xl bg-zinc-900 p-6">
      <h2 className="mb-6 text-2xl font-bold">
        👥 玩家 ({players.length})
      </h2>

      <div className="space-y-3">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between rounded-xl bg-zinc-800 p-4"
          >
            <div className="text-xl">
              {player.isHost ? "👑 " : "🙂 "}
              {player.name}
            </div>

            <div
              className={`rounded-full px-4 py-1 font-bold ${
                player.ready
                  ? "bg-green-600"
                  : "bg-red-600"
              }`}
            >
              {player.ready ? "已準備" : "未準備"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}