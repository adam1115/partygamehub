"use client";

import {
  OAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

const provider = new OAuthProvider("oidc.line");

export async function login() {
  await signInWithPopup(
    auth,
    provider
  );
}

export async function logout() {
  await signOut(auth);
}