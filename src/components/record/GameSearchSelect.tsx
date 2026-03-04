import { useState, useRef, useEffect, useCallback } from 'react';
import type { Game } from '../../types';
import { GameImageIcon } from '../game/GameImageIcon';
import { useGameImages } from '../../hooks/useGameImages';
import { useGameFavorites } from '../../hooks/useGameFavorites';
import styles from './GameSearchSelect.module.css';

interface GameSearchSelectProps {
  games: Game[];
  value: string;       // 選択中のgameId
  onChange: (gameId: string) => void;
}

export function GameSearchSelect({ games, value, onChange }: GameSearchSelectProps) {
  const { getGameImage } = useGameImages();
  const { isFavorite } = useGameFavorites();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const selectedGame = games.find((g) => g.id === value) ?? null;

  // ポップアップを開いたらフォーカス
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [open]);

  // お気に入りを先頭に並べ替え
  const filtered = [...(query.trim()
    ? games.filter((g) => g.name.includes(query.trim()))
    : games)].sort((a, b) => {
    const aFav = isFavorite(a.id) ? 0 : 1;
    const bFav = isFavorite(b.id) ? 0 : 1;
    return aFav - bFav;
  });

  const handleSelect = useCallback((gameId: string) => {
    onChange(gameId);
    setOpen(false);
  }, [onChange]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  }, [onChange]);

  return (
    <>
      {/* トリガーボタン（選択済み or プレースホルダー） */}
      <div className={styles.wrapper}>
        <span className={styles.label}>ゲーム</span>
        <button
          type="button"
          className={`${styles.trigger} ${!selectedGame ? styles.triggerEmpty : ''}`}
          onClick={() => setOpen(true)}
        >
          {selectedGame ? (
            <span className={styles.selectedGame}>
              <GameImageIcon src={getGameImage(selectedGame.id)} gameName={selectedGame.name} />
              <span className={styles.selectedName}>{selectedGame.name}</span>
            </span>
          ) : (
            <span className={styles.placeholder}>ゲームを選択</span>
          )}
          <span className={styles.triggerIcons}>
            {selectedGame && (
              <span
                className={styles.clearBtn}
                role="button"
                aria-label="クリア"
                onClick={handleClear}
              >✕</span>
            )}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
          </span>
        </button>
      </div>

      {/* 検索ポップアップ */}
      {open && (
        <div
          ref={overlayRef}
          className={styles.overlay}
          onClick={() => setOpen(false)}
        >
          <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
            {/* 検索バー */}
            <div className={styles.searchBar}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.searchBarIcon}>
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="22" y2="22" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                className={styles.searchInput}
                placeholder="ゲーム名で検索..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button className={styles.searchClear} onClick={() => setQuery('')}>✕</button>
              )}
            </div>

            {/* ゲーム一覧 */}
            <div className={styles.list}>
              {filtered.length === 0 ? (
                <p className={styles.noResult}>「{query}」に一致するゲームが見つかりません</p>
              ) : (
                filtered.map((game) => (
                  <button
                    key={game.id}
                    type="button"
                    className={`${styles.item} ${game.id === value ? styles.itemActive : ''}`}
                    onClick={() => handleSelect(game.id)}
                  >
                    <GameImageIcon src={getGameImage(game.id)} gameName={game.name} />
                    <span className={styles.itemName}>{game.name}</span>
                    {isFavorite(game.id) && <span className={styles.favTag}>お気に入り</span>}
                    {game.id === value && <span className={styles.check}>✓</span>}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
