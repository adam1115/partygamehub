import {
  doc,
  getDoc,
  runTransaction,
  increment,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export interface RewardData {
  exp: number;
  score: number;
  win: boolean;
}

/**
 * 獎勵玩家
 * 
 * 使用 Firestore transaction 更新玩家統計資料
 * 
 * 更新項目：
 * - gamesPlayed + 1
 * - totalScore + score
 * - exp + exp（並重新計算等級）
 * - wins + 1（若 win=true）
 * - loses + 1（若 win=false）
 * 
 * 等級計算：level = floor(exp/100) + 1
 * 例如：exp=0→Lv1, exp=99→Lv1, exp=100→Lv2, exp=250→Lv3
 */
export async function rewardPlayer(
  uid: string,
  reward: RewardData
): Promise<void> {
  try {
    await runTransaction(db, async (transaction) => {
      const userRef = doc(db, "users", uid);
      const userSnap = await transaction.get(userRef);

      if (!userSnap.exists()) {
        throw new Error(`使用者不存在: ${uid}`);
      }

      const userData = userSnap.data();

      // 計算新的統計值
      const newExp = userData.exp + reward.exp;
      const newTotalScore = userData.totalScore + reward.score;
      const newGamesPlayed = userData.gamesPlayed + 1;
      const newWins = reward.win ? userData.wins + 1 : userData.wins;
      const newLoses = !reward.win ? userData.loses + 1 : userData.loses;

      // 計算新等級：level = floor(exp/100) + 1
      const newLevel = Math.floor(newExp / 100) + 1;

      // 原子性更新使用者資料
      transaction.update(userRef, {
        exp: newExp,
        totalScore: newTotalScore,
        gamesPlayed: newGamesPlayed,
        wins: newWins,
        loses: newLoses,
        level: newLevel,
      });
    });
  } catch (error) {
    console.error("rewardPlayer 錯誤:", error);
    throw error;
  }
}
