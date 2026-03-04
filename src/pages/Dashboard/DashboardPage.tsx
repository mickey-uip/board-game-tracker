import { Link, useNavigate } from 'react-router-dom';
import { ProfileHeader } from '../../components/dashboard/ProfileHeader';
import { MascotBot } from '../../components/dashboard/MascotBot';
import { RecordCard } from '../../components/record/RecordCard';
import { RadarChart } from '../../components/stats/RadarChart';
import { PlayerTypeBadge } from '../../components/stats/PlayerTypeBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { usePlayers } from '../../hooks/usePlayers';
import { useCurrentPlayer } from '../../hooks/useCurrentPlayer';
import { useRecords } from '../../hooks/useRecords';
import { useGames } from '../../hooks/useGames';
import { usePlayerStats } from '../../hooks/useStats';
import { usePlayerAvatars } from '../../hooks/usePlayerAvatars';
import { useGameImages } from '../../hooks/useGameImages';
import { calcPlayerType } from '../../utils/playerType';
import type { Genre } from '../../types';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { players } = usePlayers();
  const { currentPlayer, currentPlayerId } = useCurrentPlayer();
  const { records, getRecordsByPlayerId } = useRecords();
  const { getGameById } = useGames();

  const { getAvatar } = usePlayerAvatars();
  const avatarImage = currentPlayerId ? getAvatar(currentPlayerId) : null;
  const { getGameImage } = useGameImages();
  const navigate = useNavigate();
  const stats = usePlayerStats(currentPlayerId ?? '', records, getGameById);
  const playerRecords = currentPlayerId ? getRecordsByPlayerId(currentPlayerId) : [];
  const recentRecords = playerRecords.slice(0, 5);

  // タイプ診断の根拠ジャンル（primary + secondary）を点滅対象として渡す
  const playerType = calcPlayerType(stats.genreStats);
  const highlightGenres: Genre[] = playerType
    ? [
        playerType.primaryGenre,
        ...(playerType.secondaryGenre ? [playerType.secondaryGenre] : []),
      ]
    : [];

  return (
    <div>
      {/* プロフィールヘッダー（ページ最上部・padding なし） */}
      {currentPlayer && (
        <ProfileHeader
          playerName={currentPlayer.name}
          totalGames={stats.totalGames}
          wins={stats.wins}
          avatarImage={avatarImage}
          onSettingsClick={() => navigate('/settings')}
          genreStats={stats.genreStats}
        />
      )}

      <MascotBot />

      <div className={styles.container}>
        {/* プレイヤー未登録の場合 */}
        {players.length === 0 && (
          <EmptyState
            message="プレイヤーがいません"
            description="設定からプレイヤーを追加してください"
          />
        )}

        {/* 自分のプレイヤー未設定の案内 */}
        {players.length > 0 && !currentPlayer && (
          <EmptyState
            message="自分のプレイヤーが未設定です"
            description="設定から自分のプレイヤーを設定してください"
          />
        )}

        {/* レーダーチャート */}
        {currentPlayer && stats.totalGames > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>ジャンル別勝率</h2>
            <RadarChart genreStats={stats.genreStats} highlightGenres={highlightGenres} />
          </section>
        )}

        {/* プレイヤータイプ診断 */}
        {currentPlayer && stats.totalGames > 0 && (
          <section className={styles.section}>
            <PlayerTypeBadge genreStats={stats.genreStats} heading="あなたのタイプは" />
          </section>
        )}

        {/* 記録0件時の案内 */}
        {currentPlayer && stats.totalGames === 0 && (
          <EmptyState
            message="まだ記録がありません"
            description="対戦後に記録を追加するとここに統計が表示されます"
          />
        )}

        {/* 直近の記録 */}
        {currentPlayer && recentRecords.length > 0 && (
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
