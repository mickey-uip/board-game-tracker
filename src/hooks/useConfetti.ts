import { useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';

/**
 * 紙吹雪エフェクト用フック
 * カスタム canvas をポップアップより前面（z-index: 100000）に配置し、
 * ブラーの影響を受けずに紙吹雪を描画する。
 */
export function useConfetti() {
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRunningRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiInstanceRef = useRef<confetti.CreateTypes | null>(null);

  /** 最前面の canvas を作成して confetti インスタンスを返す */
  const getConfettiInstance = useCallback(() => {
    if (confettiInstanceRef.current && canvasRef.current) {
      return confettiInstanceRef.current;
    }

    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '100000'; // ポップアップ(10000)より前面
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    canvasRef.current = canvas;
    confettiInstanceRef.current = confetti.create(canvas, { resize: true });
    return confettiInstanceRef.current;
  }, []);

  /** canvas を破棄 */
  const removeCanvas = useCallback(() => {
    if (confettiInstanceRef.current) {
      confettiInstanceRef.current.reset();
      confettiInstanceRef.current = null;
    }
    if (canvasRef.current) {
      canvasRef.current.remove();
      canvasRef.current = null;
    }
  }, []);

  const fire = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    const myConfetti = getConfettiInstance();

    // アプリのカラーに寄せたゴールド系 + カラフルな紙吹雪
    const colors = ['#d4a744', '#f0c040', '#e8b830', '#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf'];

    // ── 第1波: 左側から ──
    myConfetti({
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
    myConfetti({
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
      myConfetti({
        particleCount: 80,
        spread: 100,
        origin: { x: 0.5, y: 0.3 },
        colors,
        gravity: 0.7,
        ticks: 250,
        scalar: 1.2,
      });

      // アニメーション完了後に canvas を自動破棄
      setTimeout(() => {
        isRunningRef.current = false;
        removeCanvas();
      }, 3000);
    }, 400);
  }, [getConfettiInstance, removeCanvas]);

  const stop = useCallback(() => {
    isRunningRef.current = false;
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    removeCanvas();
  }, [removeCanvas]);

  return { fire, stop };
}
