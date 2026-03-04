import styles from './WinRateBar.module.css';

interface WinRateBarProps {
  label: string;
  winRate: number;
  playCount: number;
}

export function WinRateBar({ label, winRate, playCount }: WinRateBarProps) {
  const percent = Math.round(winRate * 100);

  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${percent}%` }} />
      </div>
      <span className={styles.percent}>{percent}%</span>
      <span className={styles.count}>({playCount}戦)</span>
    </div>
  );
}
