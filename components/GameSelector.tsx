"use client";

interface Props {
  value: string;
  onChange: (game: string) => void;
  disabled?: boolean;
}

const games = [
  {
    id: "guess-number",
    emoji: "🎲",
    name: "猜數字",
    desc: "經典多人猜數字遊戲",
  },
  {
    id: "undercover",
    emoji: "🕵️",
    name: "誰是臥底",
    desc: "找出真正的臥底",
  },
  {
    id: "truth",
    emoji: "😂",
    name: "真心話大冒險",
    desc: "聚會最受歡迎的小遊戲",
  },
  {
    id: "draw",
    emoji: "🎨",
    name: "你畫我猜",
    desc: "畫圖讓隊友猜答案",
  },
];

export default function GameSelector({
  value,
  onChange,
  disabled = false,
}: Props) {
  return (
    <div className="rounded-2xl bg-zinc-900 p-6">

      <h2 className="mb-6 text-2xl font-bold">
        🎮 選擇遊戲
      </h2>

      <div className="space-y-4">

        {games.map((game) => {
          const selected = value === game.id;

          return (
            <button
              key={game.id}
              disabled={disabled}
              onClick={() => onChange(game.id)}
              className={`w-full rounded-xl border p-5 text-left transition duration-200
              ${
                selected
                  ? "border-purple-500 bg-purple-700"
                  : "border-zinc-700 bg-zinc-800 hover:bg-zinc-700 hover:border-purple-400"
              }
              ${
                disabled
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer"
              }`}
            >
              <div className="flex items-center justify-between">

                <div>
                  <div className="text-2xl font-bold">
                    {game.emoji} {game.name}
                  </div>

                  <div className="mt-2 text-gray-300">
                    {game.desc}
                  </div>
                </div>

                {selected && (
                  <div className="text-3xl">
                    ✅
                  </div>
                )}

              </div>
            </button>
          );
        })}

      </div>

      <div className="mt-8 rounded-xl bg-zinc-800 p-4">

        <p className="text-sm text-gray-400">
          目前選擇
        </p>

        <p className="mt-2 text-xl font-bold text-purple-400">
          {games.find((g) => g.id === value)?.emoji}{" "}
          {games.find((g) => g.id === value)?.name ?? "尚未選擇"}
        </p>

      </div>

      {disabled && (
        <p className="mt-4 text-center text-gray-500">
          🔒 只有房主可以選擇遊戲
        </p>
      )}

    </div>
  );
}