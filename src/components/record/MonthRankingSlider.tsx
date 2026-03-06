import styles from './MonthRankingSlider.module.css';

interface RankingEntry {
  name: string;
  wins: number;
}

interface MonthRankingSliderProps {
  ranking: RankingEntry[];
  month: string; // "YYYY-MM"
}

const TROPHIES = [
  '/game_log/trophy_gold.png',
  '/game_log/trophy_silver.png',
  '/game_log/trophy_bronze.png',
] as const;

export function MonthRankingSlider({ ranking, month }: MonthRankingSliderProps) {
  const [year, m] = month.split('-');
  const label = `${year}年${Number(m)}月`;

  // ランキングが空の場合
  if (ranking.length === 0) {
    const emptyItems = Array(3).fill(`${label} の記録はまだありません`);
    return (
      <div className={styles.wrapper}>
        <div className={styles.track}>
          <div className={styles.slide}>
            {emptyItems.map((item, i) => (
              <span key={i} className={styles.item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3セット複製してシームレスなループを実現
  const loopRanking = [...ranking, ...ranking, ...ranking];

  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        <div className={styles.slide}>
          {loopRanking.map((entry, i) => {
            const rank = i % ranking.length;
            return (
              <span key={i} className={styles.item}>
                <img
                  src={TROPHIES[rank]}
                  alt={`${rank + 1}位`}
                  className={styles.trophy}
                />
                {rank + 1}位  {entry.name}  {entry.wins}勝
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
