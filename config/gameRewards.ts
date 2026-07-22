/**
 * PartyGameHub 遊戲獎勵設定
 * 
 * 每個遊戲的獲勝者和失敗者獎勵配置
 * 支援擴充新遊戲
 */

export const GAME_REWARDS = {
  "guess-number": {
    winner: {
      exp: 20,
      score: 15,
    },
    loser: {
      exp: 5,
      score: 2,
    },
  },

  "undercover": {
    winner: {
      exp: 25,
      score: 20,
    },
    loser: {
      exp: 8,
      score: 3,
    },
  },

  "pictionary": {
    winner: {
      exp: 22,
      score: 18,
    },
    loser: {
      exp: 6,
      score: 2,
    },
  },

  "truth-or-dare": {
    winner: {
      exp: 15,
      score: 10,
    },
    loser: {
      exp: 5,
      score: 2,
    },
  },
} as const;

export type GameType = keyof typeof GAME_REWARDS;

export function getGameReward(gameType: GameType, isWinner: boolean) {
  const game = GAME_REWARDS[gameType];
  return isWinner ? game.winner : game.loser;
}
