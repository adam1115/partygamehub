"use client";

import Link from "next/link";

import LoginButton from "./LoginButton";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-8 py-5">

      <Link
        href="/"
        className="text-2xl font-bold text-white"
      >
        🎭 PartyGameHub
      </Link>

      <LoginButton />

    </nav>
  );
}