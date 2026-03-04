import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';

export function usePlayerAvatars() {
  const [avatars, setAvatars] = useLocalStorage<Record<string, string>>(
    STORAGE_KEYS.PLAYER_AVATARS,
    {}
  );

  const getAvatar = (playerId: string): string | null => avatars[playerId] ?? null;

  const setAvatar = (playerId: string, base64: string | null) => {
    setAvatars((prev) => {
      const next = { ...prev };
      if (base64 === null) {
        delete next[playerId];
      } else {
        next[playerId] = base64;
      }
      return next;
    });
  };

  return { getAvatar, setAvatar };
}
