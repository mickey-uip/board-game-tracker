import { calcPlayerType, PLAYER_TYPE_IMAGE } from '../../utils/playerType';
import { GENRE_LABEL } from '../../constants/genres';
import type { GenreWinRate } from '../../types';
import styles from './PlayerTypeBadge.module.css';

interface PlayerTypeBadgeProps {
  genreStats: GenreWinRate[];
  /** ホーム: "あなたのタイプは" / プレイヤー詳細: プレイヤー名など */
  heading?: string;
}

export function PlayerTypeBadge({ genreStats, heading = 'あなたのタイプは' }: PlayerTypeBadgeProps) {
  const result = calcPlayerType(genreStats);

  if (!result) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyText}>記録を積み上げるとタイプが判定されます</span>
      </div>
    );
  }

  const { title, isHybrid, primaryGenre, secondaryGenre } = result;
  const primaryLabel  = GENRE_LABEL[primaryGenre];
  const secondaryLabel = secondaryGenre ? GENRE_LABEL[secondaryGenre] : null;
  const bgImage = PLAYER_TYPE_IMAGE[title] ?? null;

  return (
    <div
      className={`${styles.wrapper}${bgImage ? ` ${styles.hasImage}` : ''}`}
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
    >
      <p className={styles.heading}>{heading}</p>

      <div className={styles.badge}>
        <span className={styles.title}>{title}</span>
      </div>

      <p className={styles.sub}>
        {isHybrid && secondaryLabel
          ? `${primaryLabel} × ${secondaryLabel} のハイブリッドタイプ`
          : `${primaryLabel} の勝利数が最多`}
      </p>
    </div>
  );
}
