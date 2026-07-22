"use client";

import { useAuth } from "@/context/AuthContext";
import {
  login,
  logout,
} from "@/services/auth.service";

export default function LoginButton() {
  const { user } = useAuth();

  if (!user) {
    return (
      <button
        onClick={login}
        className="rounded-xl bg-green-600 px-6 py-3 font-bold hover:bg-green-500"
      >
        💬 LINE 登入
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">

      <img
        src={user.photoURL || "/avatar.png"}
        alt=""
        className="h-12 w-12 rounded-full"
      />

      <div>

        <div className="font-bold">
          {user.displayName}
        </div>

        <button
          onClick={logout}
          className="text-sm text-red-400 hover:text-red-300"
        >
          登出
        </button>

      </div>

    </div>
  );
}