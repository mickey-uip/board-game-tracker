import { useMemo } from 'react';
import { calcPlayerStats, calcAllPlayersWinRate } from '../utils/statsUtils';
import type { GameRecord, Game } from '../types';

export function usePlayerStats(
  playerId: string,
  records: GameRecord[],
  getGame: (id: string) => Game | null
) {
  return useMemo(
    () => calcPlayerStats(playerId, records, getGame),
    [playerId, records, getGame]
  );
}

export function useAllPlayersWinRate(
  playerIds: string[],
  records: GameRecord[],
  getGame: (id: string) => Game | null
) {
  return useMemo(
    () => calcAllPlayersWinRate(playerIds, records, getGame),
    [playerIds, records, getGame]
  );
}
