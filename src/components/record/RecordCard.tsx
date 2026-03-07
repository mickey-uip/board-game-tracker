import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { GameImageIcon } from '../game/GameImageIcon';
import { GENRE_LABEL } from '../../constants/genres';
import { useAuth } from '../../contexts/AuthContext';
import { getShareText, shareToX, generateShareCard, shareImage } from '../../utils/shareCard';
import styles from './RecordCard.module.css';
import type { GameRecord, Game, Player } from '../../types';

interface RecordCardProps {
  record: GameRecord;
  game: Game | null;
  players: Player[];
  onDelete?: (id: string) => void;
  showDetail?: boolean;
  getGameImage?: (gameId: string) => string | null;
}

export function RecordCard({ record, game, players, onDelete, showDetail = true, getGameImage }: RecordCardProps) {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const sortedResults = [...record.playerResults].sort((a, b) => a.rank - b.rank);
  const VISIBLE_COUNT = 3;
  const visibleResults = sortedResults.slice(0, VISIBLE_COUNT);
  const hiddenCount = sortedResults.length - VISIBLE_COUNT;

  const getPlayer = (playerId: string) => players.find((p) => p.id === playerId);
  const getPlayerName = (playerId: string) => getPlayer(playerId)?.name ?? '不明';

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.gameInfoRow}>
          <GameImageIcon
            src={game ? (getGameImage?.(game.id) ?? null) : null}
            gameName={game?.name ?? ''}
          />
          <div className={styles.gameInfo}>
            <span className={styles.gameName}>{game?.name ?? '不明なゲーム'}</span>
            <div className={styles.badges}>
              {game?.genres.map((g) => (
                <Badge key={g} label={GENRE_LABEL[g]} />
              ))}
            </div>
          </div>
        </div>
        {onDelete && record.createdByUid === user?.uid && (
          <button
            className={styles.deleteBtn}
            onClick={() => {
              if (confirm('この記録を削除しますか？')) onDelete(record.id);
            }}
            aria-label="削除"
          >
            ✕
          </button>
        )}
      </div>

      <div className={styles.results}>
        {visibleResults.map((result) => (
          <span key={result.playerId} className={styles.result}>
            <span className={styles.rank}>{result.rank}位</span>
            <span className={`${styles.playerName} ${result.rank === 1 ? styles.winner : ''}`}>
              {getPlayerName(result.playerId)}
            </span>
            {result.playerId === record.createdByUid && (
              <span className={styles.leaderTag}>リーダー</span>
            )}
          </span>
        ))}
        {hiddenCount > 0 && (
          <span className={styles.result}>
            <span className={styles.rank}>…</span>
            <span className={styles.playerName}>他{hiddenCount}名</span>
          </span>
        )}
      </div>

      {showDetail && (
        <button
          className={styles.expandBtn}
          onClick={() => setIsExpanded((prev) => !prev)}
          type="button"
        >
          {isExpanded ? '詳細を閉じる −' : '詳細を見る ＋'}
        </button>
      )}

      {isExpanded && (
        <div className={styles.detail}>
          <p className={styles.detailLabel}>参加プレイヤー</p>
          <div className={styles.playerLinks}>
            {sortedResults.map((result) => {
              const player = getPlayer(result.playerId);
              if (!player) return null;
              return (
                <Link
                  key={result.playerId}
                  to={`/players/${result.playerId}`}
                  className={styles.playerLink}
                >
                  <span className={styles.playerLinkRank}>{result.rank}位</span>
                  <span className={`${styles.playerName} ${result.rank === 1 ? styles.winner : ''}`}>
                    {player.name}
                  </span>
                  <span className={styles.playerLinkArrow}>→</span>
                </Link>
              );
            })}
          </div>
          {(() => {
            const myRank = record.playerResults.find((r) => r.playerId === user?.uid)?.rank;
            const totalPlayers = record.playerResults.length;
            const gameName = game?.name ?? '';
            if (myRank == null) return null;
            return (
              <div className={styles.shareSection}>
                <p className={styles.shareTitle}>結果をSNSでシェアしよう！</p>
                <div className={styles.shareRow}>
                  <button
                    className={`${styles.shareBtn} ${styles.shareBtnX}`}
                    aria-label="Xで共有"
                    onClick={() => shareToX(getShareText(gameName, myRank, totalPlayers))}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </button>
                  <button
                    className={`${styles.shareBtn} ${styles.shareBtnIg}`}
                    aria-label="Instagramで共有"
                    onClick={async () => {
                      const blob = await generateShareCard({ gameName, rank: myRank, totalPlayers });
                      await shareImage(blob, 'bodoge-record.png');
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="#ffffff" strokeWidth="2"/><circle cx="12" cy="12" r="5" stroke="#ffffff" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="#ffffff"/></svg>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
