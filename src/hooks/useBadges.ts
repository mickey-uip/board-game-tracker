import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRecords } from './useRecords';
import { useGames } from './useGames';
import { usePlayers } from './usePlayers';
import { usePlayerStats } from './useStats';
import { calcPlayerType } from '../utils/playerType';
import { computeBadges } from '../utils/badgeUtils';

export function useBadges() {
  const { user } = useAuth();
  const { records } = useRecords();
  const { getGameById } = useGames();
  const { friends } = usePlayers();

  const playerId = user?.uid ?? '';
  const stats = usePlayerStats(playerId, records, getGameById);
  const playerType = calcPlayerType(stats.genreStats);

  const playerRecords = useMemo(
    () =>
      records.filter((r) =>
        r.playerResults.some((pr) => pr.playerId === playerId)
      ),
    [records, playerId]
  );

  const badges = useMemo(
    () =>
      computeBadges({
        stats,
        playerType,
        friendCount: friends.length,
        records: playerRecords,
      }),
    [stats, playerType, friends.length, playerRecords]
  );

  const unlockedCount = useMemo(
    () => badges.filter((b) => b.unlocked).length,
    [badges]
  );

  return { badges, unlockedCount, totalCount: badges.length };
}
