import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './CalculatorTool.module.css';

type CalcButton = {
  label: string;
  value: string;
  type: 'number' | 'operator' | 'action' | 'equals';
};

const BUTTONS: CalcButton[] = [
  { label: 'C',  value: 'clear',  type: 'action' },
  { label: '⌫', value: 'back',   type: 'action' },
  { label: '÷',  value: '/',      type: 'operator' },
  { label: '×',  value: '*',      type: 'operator' },
  { label: '7',  value: '7',      type: 'number' },
  { label: '8',  value: '8',      type: 'number' },
  { label: '9',  value: '9',      type: 'number' },
  { label: '−',  value: '-',      type: 'operator' },
  { label: '4',  value: '4',      type: 'number' },
  { label: '5',  value: '5',      type: 'number' },
  { label: '6',  value: '6',      type: 'number' },
  { label: '+',  value: '+',      type: 'operator' },
  { label: '1',  value: '1',      type: 'number' },
  { label: '2',  value: '2',      type: 'number' },
  { label: '3',  value: '3',      type: 'number' },
  { label: '=',  value: '=',      type: 'equals' },
  { label: '0',  value: '0',      type: 'number' },
  { label: '.',  value: '.',      type: 'number' },
];

// ── 手書きメモ Canvas ──────────────────────────────
function MemoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Canvas の解像度を CSS サイズに合わせる
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = rect.width  * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = true;
    lastPos.current = getPos(e);
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !lastPos.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#211a10';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPos.current = pos;
  }, []);

  const onPointerUp = useCallback(() => {
    drawing.current = false;
    lastPos.current = null;
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <div className={styles.memo}>
      <div className={styles.memoHeader}>
        <span className={styles.memoLabel}>メモ</span>
        <button className={styles.memoClearBtn} onClick={clearCanvas}>消去</button>
      </div>
      <canvas
        ref={canvasRef}
        className={styles.memoCanvas}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      />
    </div>
  );
}

// ── 電卓本体 ──────────────────────────────────────
export function CalculatorTool() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [evaluated, setEvaluated] = useState(false);

  const handleButton = (btn: CalcButton) => {
    if (btn.value === 'clear') {
      setExpression('');
      setResult('');
      setEvaluated(false);
      return;
    }
    if (btn.value === 'back') {
      if (evaluated) {
        setExpression('');
        setResult('');
        setEvaluated(false);
      } else {
        setExpression((prev) => prev.slice(0, -1));
      }
      return;
    }
    if (btn.value === '=') {
      try {
        if (!expression) return;
        // eslint-disable-next-line no-new-func
        const res = Function(`"use strict"; return (${expression})`)() as number;
        const formatted = Number.isFinite(res)
          ? parseFloat(res.toFixed(10)).toString()
          : 'エラー';
        setResult(formatted);
        setEvaluated(true);
      } catch {
        setResult('エラー');
        setEvaluated(true);
      }
      return;
    }

    if (evaluated) {
      if (btn.type === 'operator') {
        setExpression(result + btn.value);
      } else {
        setExpression(btn.value);
      }
      setResult('');
      setEvaluated(false);
      return;
    }

    if (btn.type === 'operator') {
      setExpression((prev) => {
        const last = prev.slice(-1);
        if (['+', '-', '*', '/'].includes(last)) {
          return prev.slice(0, -1) + btn.value;
        }
        return prev + btn.value;
      });
      return;
    }

    setExpression((prev) => prev + btn.value);
  };

  const displayExpression = expression
    .replace(/\*/g, '×')
    .replace(/\//g, '÷');

  return (
    <div className={styles.container}>
      {/* 表示エリア */}
      <div className={styles.display}>
        <div className={styles.expressionRow}>{displayExpression || '0'}</div>
        {result && <div className={styles.resultRow}>= {result}</div>}
      </div>

      {/* ボタングリッド（4列） */}
      <div className={styles.grid}>
        {BUTTONS.map((btn) => (
          <button
            key={btn.label}
            className={`${styles.btn} ${styles[btn.type]} ${btn.label === '=' ? styles.equalsWide : ''}`}
            onClick={() => handleButton(btn)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* 手書きメモ */}
      <MemoCanvas />
    </div>
  );
}
