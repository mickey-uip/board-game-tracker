import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';
import type { Player } from '../types';

function generateId() {
  return `player-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function usePlayers() {
  const [players, setPlayers] = useLocalStorage<Player[]>(STORAGE_KEYS.PLAYERS, []);

  const addPlayer = useCallback(
    (name: string) => {
      const newPlayer: Player = {
        id: generateId(),
        name: name.trim(),
        createdAt: new Date().toISOString(),
      };
      setPlayers((prev) => [...prev, newPlayer]);
      return newPlayer;
    },
    [setPlayers]
  );

  const updatePlayer = useCallback(
    (id: string, name: string) => {
      setPlayers((prev) =>
        prev.map((p) => (p.id === id ? { ...p, name: name.trim() } : p))
      );
    },
    [setPlayers]
  );

  const deletePlayer = useCallback(
    (id: string) => {
      setPlayers((prev) => prev.filter((p) => p.id !== id));
    },
    [setPlayers]
  );

  return { players, addPlayer, updatePlayer, deletePlayer };
}
