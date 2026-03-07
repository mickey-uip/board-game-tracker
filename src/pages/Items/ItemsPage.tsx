import { useNavigate } from 'react-router-dom';
import { useRef, useCallback } from 'react';
import styles from './ItemsPage.module.css';
import { MascotBotItems } from '../../components/dashboard/MascotBotItems';

const VIDEO_DURATION = 5; // 秒

const TOOLS = [
  { key: 'dice',       label: 'サイコロ',     icon: '/tool-items/dice.png',      description: '1〜6をランダムに' },
  { key: 'coin',       label: 'コイン',       icon: '/tool-items/coin.png',      description: 'おもて・うらを決める' },
  { key: 'calculator', label: '計算機',       icon: '/tool-items/counting.png',  description: '点数計算に便利' },
  { key: 'timer',      label: 'タイマー',     icon: '/tool-items/hourglass.png', description: '時間を計る' },
  { key: 'rulebook',   label: 'ルールブック', icon: '/tool-items/spellbook.png', description: 'ゲームのルールを確認' },
] as const;

export function ItemsPage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (video && video.currentTime >= VIDEO_DURATION) {
      video.currentTime = 0;
      void video.play();
    }
  }, []);

  return (
    <div>
      {/* ヒーロー動画（16:9、幅100%、5秒でループ・音なし） */}
      <div className={styles.heroWrapper}>
        <video
          ref={videoRef}
          className={styles.heroImage}
          src="/tools-header.mp4"
          autoPlay
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
        />
        {/* テキストオーバーレイ */}
        <div className={styles.heroOverlay}>
          <p className={styles.heroLabel}>アイテム</p>
          <p className={styles.heroSub}>ボードゲームで使う便利機能</p>
        </div>
      </div>
      <div className={styles.contentArea}>
        <div className={styles.grid}>
          {TOOLS.map(({ key, label, icon, description: _description }) => (
            <button
              key={key}
              className={styles.card}
              onClick={() => navigate(`/tools/${key}`)}
            >
              <img src={icon} alt={label} className={styles.cardIcon} />
              <span className={styles.cardLabel}>{label}</span>
            </button>
          ))}
        </div>
        <MascotBotItems />
      </div>
    </div>
  );
}
