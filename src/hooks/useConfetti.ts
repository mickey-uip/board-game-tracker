import { useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';

/**
 * 紙吹雪エフェクト用フック
 * CodePen (marcobiedermann/ExvvyLQ) の演出を参考に、
 * canvas-confetti で画面上部から紙吹雪を降らせる。
 */
export function useConfetti() {
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRunningRef = useRef(false);

  const fire = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    // アプリのカラーに寄せたゴールド系 + カラフルな紙吹雪
    const colors = ['#d4a744', '#f0c040', '#e8b830', '#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf'];

    // ── 第1波: 左側から ──
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors,
      gravity: 0.8,
      ticks: 200,
      scalar: 1.1,
    });

    // ── 第2波: 右側から ──
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors,
      gravity: 0.8,
      ticks: 200,
      scalar: 1.1,
    });

    // ── 第3波: 中央上部から (遅延) ──
    animationRef.current = setTimeout(() => {
      if (!isRunningRef.current) return;
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { x: 0.5, y: 0.3 },
        colors,
        gravity: 0.7,
        ticks: 250,
        scalar: 1.2,
      });
    }, 400);
  }, []);

  const stop = useCallback(() => {
    isRunningRef.current = false;
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    // 既存の紙吹雪を即座にクリア
    confetti.reset();
  }, []);

  return { fire, stop };
}
