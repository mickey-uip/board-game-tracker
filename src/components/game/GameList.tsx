import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { GameImageIcon } from './GameImageIcon';
import { GENRE_LABEL } from '../../constants/genres';
import styles from './GameList.module.css';
import type { Game } from '../../types';

interface GameListProps {
  games: Game[];
  onDelete: (id: string) => void;
  getGameImage: (gameId: string) => string | null;
  isFavorite: (gameId: string) => boolean;
  onToggleFavorite: (gameId: string) => void;
}

function GameItem({
  game,
  getGameImage,
  isFav,
  onToggleFavorite,
  onDelete,
}: {
  game: Game;
  getGameImage: (gameId: string) => string | null;
  isFav: boolean;
  onToggleFavorite: (gameId: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <li className={styles.item}>
      <GameImageIcon src={getGameImage(game.id)} gameName={game.name} />
      <div className={styles.info}>
        <span className={styles.name}>{game.name}</span>
        <div className={styles.badges}>
          {game.genres.map((g) => (
            <Badge key={g} label={GENRE_LABEL[g]} />
          ))}
          <span className={styles.typeLabel}>
            {game.isPreset ? 'プリセット' : 'カスタム'}
          </span>
        </div>
      </div>

      {/* お気に入りボタン */}
      <button
        className={`${styles.favBtn} ${isFav ? styles.favActive : ''}`}
        onClick={() => onToggleFavorite(game.id)}
        aria-label={isFav ? 'お気に入り解除' : 'お気に入りに追加'}
      >
        {isFav ? '★' : '☆'}
      </button>

      {/* 削除ボタン（カスタムゲームのみ） */}
      {!game.isPreset && (
        <button
          className={styles.deleteBtn}
          onClick={() => {
            if (confirm(`「${game.name}」を削除しますか？`)) {
              onDelete(game.id);
            }
          }}
        >
          削除
        </button>
      )}
    </li>
  );
}

export function GameList({
  games,
  onDelete,
  getGameImage,
  isFavorite,
  onToggleFavorite,
}: GameListProps) {
  if (games.length === 0) {
    return <EmptyState message="ゲームがありません" />;
  }

  const favoriteGames = games.filter((g) => isFavorite(g.id));
  const otherGames = games.filter((g) => !isFavorite(g.id));
  const hasFavorites = favoriteGames.length > 0;

  return (
    <ul className={styles.list}>
      {/* ── お気に入りセクション ── */}
      {hasFavorites && (
        <>
          <li className={styles.sectionHeader}>お気に入り</li>
          {favoriteGames.map((game) => (
            <GameItem
              key={game.id}
              game={game}
              getGameImage={getGameImage}
              isFav={true}
              onToggleFavorite={onToggleFavorite}
              onDelete={onDelete}
            />
          ))}
          {otherGames.length > 0 && (
            <li className={styles.sectionHeader}>すべて</li>
          )}
        </>
      )}

      {/* ── 残りのゲーム ── */}
      {otherGames.map((game) => (
        <GameItem
          key={game.id}
          game={game}
          getGameImage={getGameImage}
          isFav={false}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
