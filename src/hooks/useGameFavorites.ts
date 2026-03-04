import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';

export function useGameFavorites() {
  const [favorites, setFavorites] = useLocalStorage<Record<string, boolean>>(
    STORAGE_KEYS.GAME_FAVORITES,
    {}
  );

  const isFavorite = useCallback(
    (gameId: string) => !!favorites[gameId],
    [favorites]
  );

  const toggleFavorite = useCallback(
    (gameId: string) => {
      setFavorites((prev) => ({ ...prev, [gameId]: !prev[gameId] }));
    },
    [setFavorites]
  );

  return { isFavorite, toggleFavorite };
}
