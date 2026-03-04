import { useState, useRef, useEffect } from 'react';
import { RULEBOOK, type RulebookEntry } from '../../../data/rulebook';
import { GameImageIcon } from '../../../components/game/GameImageIcon';
import { useGameFavorites } from '../../../hooks/useGameFavorites';
import styles from './RulebookTool.module.css';

const DIFFICULTY_COLOR: Record<string, string> = {
  初級: '#27ae60',
  中級: '#f39c12',
  上級: '#e74c3c',
};

interface RulebookToolProps {
  searchOpen?: boolean;
  onSearchClose?: () => void;
}

export function RulebookTool({ searchOpen = false, onSearchClose }: RulebookToolProps) {
  const [selected, setSelected] = useState<RulebookEntry | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { isFavorite } = useGameFavorites();

  // 検索ポップアップが開いたらフォーカス、閉じたらクエリリセット
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  const handleImgError = (gameId: string) => {
    setImgErrors((prev) => ({ ...prev, [gameId]: true }));
  };

  // 検索フィルタ（ポップアップ内の候補リスト用）、お気に入りを先頭に並べ替え
  const filteredRulebook = [...(query.trim()
    ? RULEBOOK.filter((e) => e.name.includes(query.trim()))
    : RULEBOOK)].sort((a, b) => {
    const aFav = isFavorite('preset-' + a.gameId) ? 0 : 1;
    const bFav = isFavorite('preset-' + b.gameId) ? 0 : 1;
    return aFav - bFav;
  });

  // 本棚は常に全冊表示（検索はポップアップで処理）
  const BOOKS_PER_ROW = 8;
  const TOTAL_ROWS = Math.ceil(RULEBOOK.length / BOOKS_PER_ROW);
  const rows: (typeof RULEBOOK[number] | null)[][] = [];
  for (let r = 0; r < TOTAL_ROWS; r++) {
    const rowBooks: (typeof RULEBOOK[number] | null)[] = [];
    for (let c = 0; c < BOOKS_PER_ROW; c++) {
      const idx = r * BOOKS_PER_ROW + c;
      rowBooks.push(idx < RULEBOOK.length ? RULEBOOK[idx] : null);
    }
    rows.push(rowBooks);
  }

  return (
    <div className={styles.container}>
      <p className={styles.hint}>本をタップするとルールを確認できます</p>

      {/* 検索ポップアップ（fixed オーバーレイ、本棚レイアウトに影響しない） */}
      {searchOpen && (
        <div
          className={styles.searchOverlay}
          onClick={() => { onSearchClose?.(); }}
        >
          <div className={styles.searchPopup} onClick={(e) => e.stopPropagation()}>
            {/* 検索入力欄 */}
            <div className={styles.searchBar}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.searchIcon}>
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="22" y2="22" />
              </svg>
              <input
                ref={inputRef}
                className={styles.searchInput}
                type="text"
                placeholder="ゲーム名で検索..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button className={styles.searchClear} onClick={() => setQuery('')}>✕</button>
              )}
            </div>

            {/* 候補リスト */}
            <div className={styles.searchList}>
              {filteredRulebook.length === 0 ? (
                <p className={styles.noResult}>「{query}」に一致するゲームが見つかりません</p>
              ) : (
                filteredRulebook.map((entry) => (
                  <button
                    key={entry.gameId}
                    className={styles.searchItem}
                    onClick={() => {
                      setSelected(entry);
                      onSearchClose?.();
                    }}
                  >
                    <GameImageIcon src={entry.coverImage} gameName={entry.name} />
                    <span className={styles.searchItemName}>{entry.name}</span>
                    {isFavorite('preset-' + entry.gameId) && (
                      <span className={styles.favTag}>お気に入り</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 本棚（複数段） */}
      <div className={styles.shelves}>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.shelf}>
            <div className={styles.books}>
              {row.map((entry, colIndex) =>
                entry ? (
                  <button
                    key={entry.gameId}
                    className={styles.book}
                    style={{ '--spine-color': entry.spineColor } as React.CSSProperties}
                    onClick={() => setSelected(entry)}
                    aria-label={entry.name}
                  >
                    <span className={styles.bookTitle}>{entry.name}</span>
                  </button>
                ) : (
                  <div key={`empty-${rowIndex}-${colIndex}`} className={`${styles.book} ${styles.bookEmpty}`} />
                )
              )}
            </div>
            <div className={styles.shelfBottom} />
          </div>
        ))}
      </div>

      {/* ゲーム詳細モーダル */}
      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>

            <div className={styles.coverWrap}>
              {!imgErrors[selected.gameId] ? (
                <img
                  src={selected.coverImage}
                  alt={selected.name}
                  className={styles.coverImg}
                  onError={() => handleImgError(selected.gameId)}
                />
              ) : (
                <div className={styles.coverFallback} style={{ backgroundColor: selected.spineColor }}>
                  <span>📖</span>
                </div>
              )}
            </div>

            <div className={styles.info}>
              <h2 className={styles.gameName}>{selected.name}</h2>

              <div className={styles.badges}>
                <span className={styles.badge}>👥 {selected.players}</span>
                <span className={styles.badge}>⏱ {selected.duration}</span>
                <span
                  className={styles.badge}
                  style={{ backgroundColor: DIFFICULTY_COLOR[selected.difficulty] + '33', color: DIFFICULTY_COLOR[selected.difficulty] }}
                >
                  {selected.difficulty}
                </span>
              </div>

              <p className={styles.summary}>{selected.summary}</p>

              <button
                className={styles.youtubeBtn}
                disabled={!selected.youtubeUrl}
                onClick={() => {
                  if (selected.youtubeUrl) {
                    window.open(selected.youtubeUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                ▶ YouTubeで解説動画を見る
              </button>
              {!selected.youtubeUrl && (
                <p className={styles.youtubeHint}>動画URLは未設定です</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
