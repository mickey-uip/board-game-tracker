import styles from './PlayerRankInput.module.css';

interface PlayerRankInputProps {
  playerName: string;
  rank: number;
  maxRank: number;
  onChange: (rank: number) => void;
}

export function PlayerRankInput({ playerName, rank, maxRank, onChange }: PlayerRankInputProps) {
  const options = Array.from({ length: maxRank }, (_, i) => i + 1);

  return (
    <div className={styles.row}>
      <span className={styles.name}>{playerName}</span>
      <div className={styles.selectWrapper}>
        <select
          className={styles.select}
          value={rank}
          onChange={(e) => onChange(Number(e.target.value))}
        >
          {options.map((r) => (
            <option key={r} value={r}>
              {r}位
            </option>
          ))}
        </select>
        <span className={styles.arrow}>▼</span>
      </div>
    </div>
  );
}
