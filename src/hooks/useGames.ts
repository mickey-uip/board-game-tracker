import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { PRESET_GAMES } from '../constants/presetGames';
import type { Game, Genre } from '../types';

function generateId() {
  return `game-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function useGames() {
  const [customGames, setCustomGames] = useLocalStorage<Game[]>(STORAGE_KEYS.GAMES, []);

  const games = useMemo(
    () => [...PRESET_GAMES, ...customGames],
    [customGames]
  );

  const addGame = useCallback(
    (name: string, genres: Genre[]) => {
      const newGame: Game = {
        id: generateId(),
        name: name.trim(),
        genres,
        isPreset: false,
        createdAt: new Date().toISOString(),
      };
      setCustomGames((prev) => [...prev, newGame]);
      return newGame;
    },
    [setCustomGames]
  );

  const deleteGame = useCallback(
    (id: string) => {
      setCustomGames((prev) => prev.filter((g) => g.id !== id));
    },
    [setCustomGames]
  );

  const getGameById = useCallback(
    (id: string) => games.find((g) => g.id === id) ?? null,
    [games]
  );

  return { games, customGames, addGame, deleteGame, getGameById };
}
