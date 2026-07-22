"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  User,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { saveUser } from "@/services/user.service";

const AuthContext = createContext<{
  user: User | null;
}>({
  user: null,
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        setUser(firebaseUser);

        if (firebaseUser) {
          await saveUser({
            uid: firebaseUser.uid,
            name:
              firebaseUser.displayName || "",
            avatar:
              firebaseUser.photoURL || "",
          });
        }
      }
    );
  }, []);

  return (
    <AuthContext.Provider
      value={{ user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}