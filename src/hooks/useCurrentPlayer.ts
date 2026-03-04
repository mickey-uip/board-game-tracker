import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { usePlayers } from './usePlayers';
import { STORAGE_KEYS } from '../utils/storageKeys';

export function useCurrentPlayer() {
  const { players } = usePlayers();
  const [currentPlayerId, setCurrentPlayerId] = useLocalStorage<string | null>(
    STORAGE_KEYS.CURRENT_PLAYER,
    null
  );

  // 削除されたプレイヤーIDが残留していた場合は null に補正
  const resolvedId =
    currentPlayerId && players.some((p) => p.id === currentPlayerId)
      ? currentPlayerId
      : null;

  const currentPlayer = players.find((p) => p.id === resolvedId) ?? null;

  const clearCurrentPlayer = useCallback(() => {
    setCurrentPlayerId(null);
  }, [setCurrentPlayerId]);

  return {
    currentPlayerId: resolvedId,
    currentPlayer,
    setCurrentPlayerId,
    clearCurrentPlayer,
  };
}
