import { useCountUp } from '../../hooks/useCountUp';
import styles from './StatsSummary.module.css';
import type { PlayerStats } from '../../types';

interface StatsSummaryProps {
  stats: PlayerStats;
}

export function StatsSummary({ stats }: StatsSummaryProps) {
  const winRatePct = stats.totalGames > 0
    ? Math.round((stats.wins / stats.totalGames) * 100)
    : 0;

  const animatedGames = useCountUp(stats.totalGames);
  const animatedWins  = useCountUp(stats.wins);
  const animatedRate  = useCountUp(winRatePct);

  return (
    <div className={styles.card}>
      <div className={styles.item}>
        <span className={styles.value}>{animatedGames}</span>
        <span className={styles.itemLabel}>プレイ</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.item}>
        <span className={styles.value}>{animatedWins}</span>
        <span className={styles.itemLabel}>勝利</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.item}>
        <span className={styles.value}>{stats.totalGames > 0 ? `${animatedRate}%` : '-'}</span>
        <span className={styles.itemLabel}>勝率</span>
      </div>
    </div>
  );
}
