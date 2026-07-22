import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export interface UserProfile {
  uid: string;
  name: string;
  avatar: string;
}

export interface UserData {
  uid: string;
  name: string;
  avatar: string;
  level: number;
  exp: number;
  totalScore: number;
  gamesPlayed: number;
  wins: number;
  loses: number;
  createdAt: any;
  lastLogin: any;
}

/**
 * 存儲或更新使用者資料
 * 
 * 首次登入：建立新使用者文件，初始化所有欄位
 * 再次登入：更新 name, avatar, lastLogin，保留統計資料
 */
export async function saveUser(user: UserProfile) {
  const ref = doc(db, "users", user.uid);

  const snap = await getDoc(ref);

  if (snap.exists()) {
    // 使用者已存在，只更新 name, avatar, lastLogin
    await updateDoc(ref, {
      name: user.name,
      avatar: user.avatar,
      lastLogin: serverTimestamp(),
    });
  } else {
    // 首次登入，建立新使用者文件
    await setDoc(ref, {
      uid: user.uid,
      name: user.name,
      avatar: user.avatar,
      level: 1,
      exp: 0,
      totalScore: 0,
      gamesPlayed: 0,
      wins: 0,
      loses: 0,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
  }
}
