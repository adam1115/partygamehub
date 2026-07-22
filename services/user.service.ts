import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export interface UserProfile {
  uid: string;
  name: string;
  avatar: string;
}

export async function saveUser(user: UserProfile) {
  const ref = doc(db, "users", user.uid);

  const snap = await getDoc(ref);

  if (snap.exists()) return;

  await setDoc(ref, {
    uid: user.uid,
    name: user.name,
    avatar: user.avatar,
    createdAt: serverTimestamp(),
  });
}