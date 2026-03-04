import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { PRESET_GAME_IMAGES } from '../constants/presetGameImages';

export function useGameImages() {
  const [customImages, setCustomImages] = useLocalStorage<Record<string, string>>(
    STORAGE_KEYS.GAME_IMAGES,
    {}
  );

  const getGameImage = (gameId: string): string | null =>
    PRESET_GAME_IMAGES[gameId] ?? customImages[gameId] ?? null;

  const setGameImage = (gameId: string, base64: string | null) => {
    setCustomImages((prev) => {
      const next = { ...prev };
      if (base64 === null) {
        delete next[gameId];
      } else {
        next[gameId] = base64;
      }
      return next;
    });
  };

  return { getGameImage, setGameImage };
}
