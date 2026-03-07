import { BADGES } from '../constants/badges';
import type { BadgeDefinition } from '../constants/badges';
import type { PlayerStats, GameRecord, Genre } from '../types';
import type { PlayerTypeResult } from './playerType';

export interface BadgeInput {
  stats: PlayerStats;
  playerType: PlayerTypeResult;
  friendCount: number;
  records: GameRecord[];
}

export interface BadgeResult {
  id: string;
  badge: BadgeDefinition;
  unlocked: boolean;
}

const ALL_GENRES: Genre[] = ['strategy', 'luck', 'negotiation', 'cooperative', 'memory'];

export function computeBadges(input: BadgeInput): BadgeResult[] {
  const { stats, playerType, friendCount, records } = input;

  // ユニークゲーム数・ユニーク日数を事前計算
  const uniqueGameIds = new Set(records.map((r) => r.gameId));
  const uniqueDays = new Set(records.map((r) => r.date));

  // ジャンル別勝利数（genreStats から算出）
  const genreWins: Record<Genre, number> = {
    strategy: 0,
    luck: 0,
    negotiation: 0,
    cooperative: 0,
    memory: 0,
  };
  for (const gs of stats.genreStats) {
    genreWins[gs.genre] = Math.round(gs.playCount * gs.winRate);
  }

  function evaluate(conditionKey: string): boolean {
    // 数値比較系
    if (conditionKey.startsWith('totalGames>='))
      return stats.totalGames >= Number(conditionKey.split('>=')[1]);
    if (conditionKey.startsWith('wins>='))
      return stats.wins >= Number(conditionKey.split('>=')[1]);
    if (conditionKey === 'winRate>=0.6&&totalGames>=10')
      return stats.winRate >= 0.6 && stats.totalGames >= 10;
    if (conditionKey.startsWith('friends>='))
      return friendCount >= Number(conditionKey.split('>=')[1]);
    if (conditionKey.startsWith('uniqueGames>='))
      return uniqueGameIds.size >= Number(conditionKey.split('>=')[1]);
    if (conditionKey.startsWith('uniqueDays>='))
      return uniqueDays.size >= Number(conditionKey.split('>=')[1]);

    // ジャンル勝利
    if (conditionKey.startsWith('genreWin:')) {
      const genre = conditionKey.split(':')[1] as Genre;
      return genreWins[genre] > 0;
    }
    if (conditionKey === 'genreWinAll')
      return ALL_GENRES.every((g) => genreWins[g] > 0);

    // プレイヤータイプ
    if (conditionKey === 'playerTypeExists')
      return playerType !== null;
    if (conditionKey === 'playerTypeHybrid')
      return playerType?.isHybrid === true;

    return false;
  }

  return BADGES.map((badge) => ({
    id: badge.id,
    badge,
    unlocked: evaluate(badge.conditionKey),
  }));
}
