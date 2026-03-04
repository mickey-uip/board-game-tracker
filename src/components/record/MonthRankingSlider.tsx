import styles from './MonthRankingSlider.module.css';

interface RankingEntry {
  name: string;
  wins: number;
}

interface MonthRankingSliderProps {
  ranking: RankingEntry[];
  month: string; // "YYYY-MM"
}

const MEDALS = ['🥇', '🥈', '🥉'] as const;

export function MonthRankingSlider({ ranking, month }: MonthRankingSliderProps) {
  const [year, m] = month.split('-');
  const label = `${year}年${Number(m)}月`;

  // スライダーのアイテムを生成
  const items: string[] =
    ranking.length === 0
      ? [`${label} の記録はまだありません`]
      : ranking.map(
          (entry, i) =>
            `${MEDALS[i]}  ${i + 1}位  ${entry.name}  ${entry.wins}勝`
        );

  // 3セット複製してシームレスなループを実現（アイテム数が少ない場合も対応）
  const loopItems = [...items, ...items, ...items];

  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        <div className={styles.slide}>
          {loopItems.map((item, i) => (
            <span key={i} className={styles.item}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
