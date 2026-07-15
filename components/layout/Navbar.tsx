export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="text-2xl font-bold">
          🎭 Party Game Hub
        </div>

        <div className="flex items-center gap-6 text-sm">
          <button className="transition hover:text-purple-400">
            首頁
          </button>

          <button className="transition hover:text-purple-400">
            遊戲列表
          </button>

          <button className="transition hover:text-purple-400">
            排行榜
          </button>

          <button className="rounded-lg bg-purple-600 px-4 py-2 hover:bg-purple-500">
            登入
          </button>
        </div>
      </div>
    </nav>
  );
}