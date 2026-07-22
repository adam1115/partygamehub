import { auth } from "@/lib/firebase";

import {
  OAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const provider = new OAuthProvider("oidc.line");

export async function signInWithLine() {
  const result = await signInWithPopup(auth, provider);

  return result.user;
}

export async function logout() {
  await signOut(auth);
}