type Props = {
  params: {
    roomCode: string;
  };
};

export default function RoomPage({ params }: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      <div className="w-full max-w-xl rounded-3xl border border-zinc-800 bg-zinc-900 p-10">

        <h1 className="text-4xl font-bold">
          🎉 房間
        </h1>

        <p className="mt-4 text-2xl text-purple-400">
          房號：{params.roomCode}
        </p>

        <div className="mt-10 rounded-xl bg-zinc-800 p-6">

          <p className="text-lg">
            玩家：
          </p>

          <div className="mt-3 rounded-lg bg-zinc-700 p-3">
            👤 房主
          </div>

        </div>

        <button className="mt-8 w-full rounded-xl bg-purple-600 py-4 font-bold">
          開始遊戲
        </button>

      </div>
    </main>
  );
}