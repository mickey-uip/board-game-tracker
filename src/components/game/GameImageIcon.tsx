import { useState } from 'react';
import styles from './GameImageIcon.module.css';

interface GameImageIconProps {
  src: string | null;
  gameName: string;
}

export function GameImageIcon({ src, gameName }: GameImageIconProps) {
  const [imgError, setImgError] = useState(false);

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={gameName}
        className={styles.icon}
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div className={styles.fallback} aria-hidden="true">
      {gameName.charAt(0)}
    </div>
  );
}
