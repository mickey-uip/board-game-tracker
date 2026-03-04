import { useState } from 'react';
import { NOTICES } from '../../data/notices';
import { calcPlayerType, PLAYER_TYPE_IMAGE } from '../../utils/playerType';
import { useCountUp } from '../../hooks/useCountUp';
import type { GenreWinRate } from '../../types';
import styles from './ProfileHeader.module.css';

interface ProfileHeaderProps {
  playerName: string;
  totalGames: number;
  wins: number;
  avatarImage: string | null;
  onSettingsClick: () => void;
  genreStats?: GenreWinRate[];
}

export function ProfileHeader({
  playerName,
  totalGames,
  wins,
  avatarImage,
  onSettingsClick,
  genreStats,
}: ProfileHeaderProps) {
  const [showNotices, setShowNotices] = useState(false);
  const initial = playerName.charAt(0);
  const winRatePct = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  const animatedGames = useCountUp(totalGames);
  const animatedWins  = useCountUp(wins);
  const animatedRate  = useCountUp(winRatePct);

  // タイプ別背景画像を取得
  const typeResult = genreStats ? calcPlayerType(genreStats) : null;
  const headerBgImage = typeResult ? (PLAYER_TYPE_IMAGE[typeResult.title] ?? null) : null;

  // 未読バッジ判定
  const lastSeen = localStorage.getItem('notices_last_seen');
  const hasUnread = NOTICES.some((n) => {
    if (!lastSeen) return true;
    return new Date(n.date) > new Date(lastSeen);
  });

  // お知らせを開く（同時に既読マーク）
  const handleOpenNotices = () => {
    setShowNotices(true);
    localStorage.setItem('notices_last_seen', new Date().toISOString());
  };

  return (
    <>
      <div
        className={styles.wrapper}
        style={headerBgImage ? { '--header-bg-image': `url(${headerBgImage})` } as React.CSSProperties : undefined}
      >
        {/* 上段: ベル・歯車アイコン（右寄せ） */}
        <div className={styles.topBar}>
          <button
            className={styles.iconBtn}
            onClick={handleOpenNotices}
            aria-label="お知らせ"
          >
            {/* Bell */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {hasUnread && <span className={styles.noticeBadge} />}
          </button>
          <button
            className={styles.iconBtn}
            onClick={onSettingsClick}
            aria-label="設定"
          >
            {/* Settings gear */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>

        {/* 下段: アバター + 名前・統計 */}
        <div className={styles.profile}>
          <div className={styles.avatar}>
            {avatarImage ? (
              <img src={avatarImage} alt="プロフィール画像" className={styles.avatarImg} />
            ) : (
              <span className={styles.avatarInitial}>{initial}</span>
            )}
          </div>

          <div className={styles.info}>
            <span className={styles.name}>{playerName}</span>
            <div className={styles.summary}>
              <span className={styles.summaryItem}>
                <span className={styles.summaryValue}>{animatedGames}</span>
                <span className={styles.summaryLabel}>プレイ</span>
              </span>
              <span className={styles.summaryDivider} />
              <span className={styles.summaryItem}>
                <span className={styles.summaryValue}>{animatedWins}</span>
                <span className={styles.summaryLabel}>勝利</span>
              </span>
              <span className={styles.summaryDivider} />
              <span className={styles.summaryItem}>
                <span className={styles.summaryValue}>{totalGames > 0 ? `${animatedRate}%` : '-'}</span>
                <span className={styles.summaryLabel}>勝率</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* お知らせ：画面中央ポップアップ */}
      {showNotices && (
        <div className={styles.noticeOverlay} onClick={() => setShowNotices(false)}>
          <div className={styles.noticeDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.noticeDialogHeader}>
              <span className={styles.noticeDialogTitle}>お知らせ</span>
              <button
                className={styles.noticeCloseBtn}
                onClick={() => setShowNotices(false)}
                aria-label="閉じる"
              >
                ✕
              </button>
            </div>
            <div className={styles.noticeList}>
              {NOTICES.map((n) => (
                <div key={n.id} className={styles.noticeItem}>
                  {n.bannerImage && (
                    <div className={styles.noticeBanner}>
                      <img src={n.bannerImage} alt="" className={styles.noticeBannerImg} />
                    </div>
                  )}
                  <span className={styles.noticeTitle}>{n.title}</span>
                  <p className={styles.noticeBody}>{n.body}</p>
                  <span className={styles.noticeDate}>{n.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
