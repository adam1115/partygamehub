"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import GameCard from "@/components/GameCard";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SplashScreen show={showSplash} />

      {!showSplash && (
        <>
          <Navbar />

          <main className="min-h-screen overflow-hidden bg-zinc-950 text-white">

            <div className="absolute left-1/2 top-28 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-600/20 blur-3xl" />

            <section className="relative flex flex-col items-center justify-center px-6 py-28 text-center">

              <h1 className="text-6xl font-extrabold">
                🎭 Party Game Hub
              </h1>

              <p className="mt-6 max-w-2xl text-xl text-gray-300">
                與朋友一起玩最有趣的派對遊戲，
                建立房間、邀請好友，
                隨時開始一場歡樂派對！
              </p>

              <div className="mt-12 flex flex-wrap justify-center gap-5">

                <Link href="/create-room">
                  <button className="rounded-xl bg-purple-600 px-8 py-4 text-lg font-bold transition hover:scale-105 hover:bg-purple-500">
                    🎉 建立房間
                  </button>
                </Link>

                <button className="rounded-xl bg-green-600 px-8 py-4 text-lg font-bold transition hover:scale-105 hover:bg-green-500">
                  🚪 加入房間
                </button>

              </div>

            </section>

            <section className="relative mx-auto max-w-6xl px-6 pb-24">

              <h2 className="mb-8 text-4xl font-bold">
                🔥 熱門遊戲
              </h2>

              <div className="grid gap-8 md:grid-cols-3">

                <GameCard
                  emoji="🎲"
                  title="猜數字"
                  description="經典多人猜數字遊戲，看看誰最快猜中答案。"
                />

                <GameCard
                  emoji="🧠"
                  title="誰是臥底"
                  description="每個人拿到不同詞語，找出真正的臥底。"
                />

                <GameCard
                  emoji="😂"
                  title="真心話大冒險"
                  description="聚會最受歡迎的經典遊戲，保證笑聲不斷。"
                />

              </div>

            </section>

          </main>

        </>
      )}

    </>
  );
}