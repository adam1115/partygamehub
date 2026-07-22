"use client";

import { useAuth } from "@/context/AuthContext";

export function useUser() {
  const { user } = useAuth();

  return {
    uid: user?.uid ?? "",
    name: user?.displayName ?? "",
    avatar: user?.photoURL ?? "",
    email: user?.email ?? "",
    user,
  };
}