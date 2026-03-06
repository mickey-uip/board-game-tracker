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
        {onDelete && (
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
              <div className={styles.shareRow}>
                <button
                  className={styles.shareBtn}
                  onClick={() => shareToX(getShareText(gameName, myRank, totalPlayers))}
                >
                  Xで共有
                </button>
                <button
                  className={styles.shareBtn}
                  onClick={async () => {
                    const blob = await generateShareCard({ gameName, rank: myRank, totalPlayers });
                    await shareImage(blob, 'bodoge-record.png');
                  }}
                >
                  Instagramで共有
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
