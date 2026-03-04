import { useRef, useCallback, useState } from 'react';
import styles from './CoinTool.module.css';

export function CoinTool() {
  const [flipping, setFlipping] = useState(false);
  const coinRef = useRef<HTMLDivElement>(null);
  // 累積回転角を保持（連続投げの連続感）
  const currentY = useRef(0);

  const flip = useCallback(() => {
    if (flipping || !coinRef.current) return;
    setFlipping(true);

    const nextSide = Math.random() < 0.5 ? 'heads' : 'tails';
    // heads = rotateY(0deg)（表が正面）, tails = rotateY(180deg)（裏が正面）
    const targetY = nextSide === 'heads' ? 0 : 180;

    // 現在角 + 複数回転 + 最終角
    const spinY = currentY.current + 360 * 4 + targetY;

    const coin = coinRef.current;

    // フェーズ1: 高速スピン（600ms）
    coin.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.5, 1)';
    coin.style.transform = `rotateY(${spinY}deg)`;

    // フェーズ2: 着地（300ms）
    setTimeout(() => {
      coin.style.transition = 'transform 0.3s cubic-bezier(0.1, 0.8, 0.3, 1)';
      coin.style.transform = `rotateY(${targetY}deg)`;
      currentY.current = targetY;

      setTimeout(() => {
        setFlipping(false);
      }, 300);
    }, 600);
  }, [flipping]);

  return (
    <div className={styles.container}>
      <div
        className={styles.scene}
        onClick={flip}
        role="button"
        aria-label="コインを投げる"
      >
        <div className={styles.coin} ref={coinRef}>
          {/* 表面（heads） */}
          <div className={`${styles.face} ${styles.heads}`}>
            <img src="/coin/coin_omote.png" alt="おもて" className={styles.faceImg} />
          </div>
          {/* 裏面（tails） */}
          <div className={`${styles.face} ${styles.tails}`}>
            <img src="/coin/coin_ura.png" alt="うら" className={styles.faceImg} />
          </div>
        </div>
      </div>
      <p className={`${styles.hint} ${!flipping ? styles.hintPulse : ''}`}>
        {flipping ? '投げています…' : 'タップして投げる'}
      </p>
    </div>
  );
}
