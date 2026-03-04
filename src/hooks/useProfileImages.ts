import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';

export function useProfileImages() {
  const [avatarImage, setAvatarImage] = useLocalStorage<string | null>(
    STORAGE_KEYS.AVATAR_IMAGE,
    null
  );
  return { avatarImage, setAvatarImage };
}
