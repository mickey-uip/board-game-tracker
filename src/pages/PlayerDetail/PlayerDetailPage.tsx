import { useParams } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { StatsSummary } from '../../components/stats/StatsSummary';
import { RadarChart } from '../../components/stats/RadarChart';
import { PlayerTypeBadge } from '../../components/stats/PlayerTypeBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { usePlayers } from '../../hooks/usePlayers';
import { useRecords } from '../../hooks/useRecords';
import { useGames } from '../../hooks/useGames';
import { usePlayerStats } from '../../hooks/useStats';
import { calcPlayerType } from '../../utils/playerType';
import { formatDateShort } from '../../utils/dateUtils';
import type { Genre } from '../../types';
import styles from './PlayerDetailPage.module.css';

export function PlayerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { players } = usePlayers();
  const { records, getRecordsByPlayerId } = useRecords();
  const { getGameById } = useGames();

  const player = players.find((p) => p.id === id);
  const stats = usePlayerStats(id ?? '', records, getGameById);
  const playerRecords = id ? getRecordsByPlayerId(id) : [];
  const recentRecords = playerRecords.slice(0, 5);

  // タイプ診断の根拠ジャンル（primary + secondary）を点滅対象として渡す
  const playerType = calcPlayerType(stats.genreStats);
  const highlightGenres: Genre[] = playerType
    ? [
        playerType.primaryGenre,
        ...(playerType.secondaryGenre ? [playerType.secondaryGenre] : []),
      ]
    : [];

  if (!player) {
    return (
      <div>
        <PageHeader title="プレイヤー" showBack />
        <EmptyState message="プレイヤーが見つかりません" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={player.name} showBack />
      <div className={styles.container}>
        <StatsSummary stats={stats} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>ジャンル別勝率</h2>
          <RadarChart genreStats={stats.genreStats} highlightGenres={highlightGenres} />
        </section>

        {/* プレイヤータイプ診断 */}
        <section className={styles.section}>
          <PlayerTypeBadge
            genreStats={stats.genreStats}
            heading={`${player.name} のタイプは`}
          />
        </section>

        <section className={`${styles.section} ${styles.recentSection}`}>
          <h2 className={styles.sectionTitle}>最近の記録</h2>
          {recentRecords.length === 0 ? (
            <EmptyState message="記録がありません" />
          ) : (
            <div className={styles.recentList}>
              {recentRecords.map((record) => {
                const result = record.playerResults.find((r) => r.playerId === id);
                const game = getGameById(record.gameId);
                return (
                  <div key={record.id} className={styles.recentItem}>
                    <span className={styles.recentDate}>{formatDateShort(record.date)}</span>
                    <span className={styles.recentGame}>{game?.name ?? '不明'}</span>
                    <span className={result?.rank === 1 ? styles.rankWin : styles.rank}>
                      {result?.rank}位
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
