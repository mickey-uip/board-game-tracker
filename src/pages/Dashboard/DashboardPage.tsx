import { Link, useNavigate } from 'react-router-dom';
import { ProfileHeader } from '../../components/dashboard/ProfileHeader';
import { MascotBot } from '../../components/dashboard/MascotBot';
import { RecordCard } from '../../components/record/RecordCard';
import { RadarChart } from '../../components/stats/RadarChart';
import { PlayerTypeBadge } from '../../components/stats/PlayerTypeBadge';
import { useAuth } from '../../contexts/AuthContext';
import { usePlayers } from '../../hooks/usePlayers';
import { useRecords } from '../../hooks/useRecords';
import { useGames } from '../../hooks/useGames';
import { usePlayerStats } from '../../hooks/useStats';
import { useGameImages } from '../../hooks/useGameImages';
import { calcPlayerType } from '../../utils/playerType';
import type { Genre } from '../../types';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { user, profile } = useAuth();
  const { players } = usePlayers();
  const { records, getRecordsByPlayerId } = useRecords();
  const { getGameById } = useGames();
  const { getGameImage } = useGameImages();
  const navigate = useNavigate();

  const currentPlayerId = user?.uid ?? '';
  const avatarImage = profile?.avatarBase64 ?? null;
  const playerName = profile?.displayName ?? '';

  const stats = usePlayerStats(currentPlayerId, records, getGameById);
  const playerRecords = currentPlayerId ? getRecordsByPlayerId(currentPlayerId) : [];
  const recentRecords = playerRecords.slice(0, 5);

  // タイプ診断の根拠ジャンル
  const playerType = calcPlayerType(stats.genreStats);
  const highlightGenres: Genre[] = playerType
    ? [
        playerType.primaryGenre,
        ...(playerType.secondaryGenre ? [playerType.secondaryGenre] : []),
      ]
    : [];

  return (
    <div>
      {profile && (
        <ProfileHeader
          playerName={playerName}
          totalGames={stats.totalGames}
          wins={stats.wins}
          avatarImage={avatarImage}
          onSettingsClick={() => navigate('/settings')}
          genreStats={stats.genreStats}
        />
      )}

      <MascotBot />

      <div className={styles.container}>
        {profile && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>ジャンル別勝率</h2>
            <RadarChart genreStats={stats.genreStats} highlightGenres={highlightGenres} />
          </section>
        )}

        {profile && (
          <section className={styles.section}>
            <PlayerTypeBadge genreStats={stats.genreStats} heading="あなたのタイプは" />
          </section>
        )}

        {profile && recentRecords.length > 0 && (
          <section className={`${styles.section} ${styles.recentSection}`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>直近の記録</h2>
              <Link to="/records" className={styles.seeAll}>
                すべて見る
              </Link>
            </div>
            <div className={styles.cardList}>
              {recentRecords.map((record) => (
                <RecordCard
                  key={record.id}
                  record={record}
                  game={getGameById(record.gameId)}
                  players={players}
                  showDetail
                  getGameImage={getGameImage}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
