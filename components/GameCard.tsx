type GameCardProps = {
  emoji: string;
  title: string;
  description: string;
};

export default function GameCard({
  emoji,
  title,
  description,
}: GameCardProps) {
  return (
    <div className="rounded-3xl border border-zinc-700 bg-zinc-900/70 p-8 backdrop-blur transition duration-300 hover:-translate-y-2 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20">

      <div className="text-6xl">
        {emoji}
      </div>

      <h3 className="mt-6 text-2xl font-bold">
        {title}
      </h3>

      <p className="mt-4 text-gray-400">
        {description}
      </p>

      <button className="mt-8 w-full rounded-xl bg-purple-600 py-3 font-semibold transition hover:bg-purple-500">
        開始遊戲
      </button>

    </div>
  );
}