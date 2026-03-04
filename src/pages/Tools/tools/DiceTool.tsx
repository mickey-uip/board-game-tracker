import { useRef, useCallback, useState } from 'react';
import styles from './DiceTool.module.css';

// 各値が front 面を向くときの最終 rotation
const FACE_ROTATIONS: Record<number, { x: number; y: number }> = {
  1: { x: 0,   y: 0   },
  2: { x: -90, y: 0   },
  3: { x: 0,   y: -90 },
  4: { x: 0,   y: 90  },
  5: { x: 90,  y: 0   },
  6: { x: 0,   y: 180 },
};

// 各面の dot グリッド位置（"row/col"）
const DOT_POSITIONS: Record<number, string[]> = {
  1: ['2/2'],
  2: ['1/1', '3/3'],
  3: ['1/1', '2/2', '3/3'],
  4: ['1/1', '1/3', '3/1', '3/3'],
  5: ['1/1', '1/3', '2/2', '3/1', '3/3'],
  6: ['1/1', '2/1', '3/1', '1/3', '2/3', '3/3'],
};

function DiceFace({ value }: { value: number }) {
  const isOne = value === 1;
  return (
    <div className={styles.faceInner}>
      {DOT_POSITIONS[value].map((pos, i) => (
        <span
          key={i}
          className={`${styles.dot} ${isOne ? styles.dotRed : ''}`}
          style={{ gridArea: pos }}
        />
      ))}
    </div>
  );
}

interface SingleDiceProps {
  cubeRef: React.RefObject<HTMLDivElement | null>;
  onClick: () => void;
  rolling: boolean;
}

function SingleDice({ cubeRef, onClick, rolling: _rolling }: SingleDiceProps) {
  return (
    <div
      className={styles.scene}
      onClick={onClick}
      role="button"
      aria-label="サイコロを振る"
    >
      <div className={styles.cube} ref={cubeRef}>
        {/* front=1, back=6, right=3, left=4, top=2, bottom=5 */}
        <div className={`${styles.face} ${styles.front}`}><DiceFace value={1} /></div>
        <div className={`${styles.face} ${styles.back}`}><DiceFace value={6} /></div>
        <div className={`${styles.face} ${styles.right}`}><DiceFace value={3} /></div>
        <div className={`${styles.face} ${styles.left}`}><DiceFace value={4} /></div>
        <div className={`${styles.face} ${styles.top}`}><DiceFace value={2} /></div>
        <div className={`${styles.face} ${styles.bottom}`}><DiceFace value={5} /></div>
      </div>
    </div>
  );
}

function useDice() {
  const cubeRef = useRef<HTMLDivElement>(null);
  const currentRotation = useRef({ x: 0, y: 0 });

  const roll = useCallback((): Promise<number> => {
    return new Promise((resolve) => {
      if (!cubeRef.current) { resolve(1); return; }

      const nextValue = Math.floor(Math.random() * 6) + 1;
      const target = FACE_ROTATIONS[nextValue];

      const spinX = currentRotation.current.x + 360 * 2 + target.x;
      const spinY = currentRotation.current.y + 360 * 3 + target.y;

      const cube = cubeRef.current;
      cube.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.5, 1)';
      cube.style.transform = `rotateX(${spinX}deg) rotateY(${spinY}deg)`;

      setTimeout(() => {
        cube.style.transition = 'transform 0.3s cubic-bezier(0.1, 0.8, 0.3, 1)';
        cube.style.transform = `rotateX(${target.x}deg) rotateY(${target.y}deg)`;
        currentRotation.current = { x: target.x, y: target.y };
        setTimeout(() => resolve(nextValue), 300);
      }, 600);
    });
  }, []);

  return { cubeRef, roll };
}

type DiceMode = 'single' | 'double';

export function DiceTool() {
  const [rolling, setRolling] = useState(false);
  const [mode, setMode] = useState<DiceMode>('single');
  const [total, setTotal] = useState<number | null>(null);

  const dice1 = useDice();
  const dice2 = useDice();

  const handleRoll = useCallback(async () => {
    if (rolling) return;
    setRolling(true);
    setTotal(null);

    if (mode === 'single') {
      await dice1.roll();
    } else {
      const [v1, v2] = await Promise.all([dice1.roll(), dice2.roll()]);
      setTotal(v1 + v2);
    }

    setRolling(false);
  }, [rolling, mode, dice1, dice2]);

  return (
    <div className={styles.container}>
      {/* サイコロ表示エリア */}
      <div className={styles.diceArea}>
        <SingleDice cubeRef={dice1.cubeRef} onClick={handleRoll} rolling={rolling} />
        {mode === 'double' && (
          <SingleDice cubeRef={dice2.cubeRef} onClick={handleRoll} rolling={rolling} />
        )}
      </div>

      {/* 2個モード時の合計 */}
      {mode === 'double' && total !== null && !rolling && (
        <div className={styles.totalBadge}>
          合計　<span className={styles.totalNum}>{total}</span>
        </div>
      )}

      <p className={`${styles.hint} ${!rolling ? styles.hintPulse : ''}`}>
        {rolling ? '振っています…' : 'タップして振る'}
      </p>

      {/* モード切替プリセットボタン */}
      <div className={styles.modeSelector}>
        <button
          className={`${styles.modeBtn} ${mode === 'single' ? styles.modeBtnActive : ''}`}
          onClick={() => { setMode('single'); setTotal(null); }}
        >
          1個
        </button>
        <button
          className={`${styles.modeBtn} ${mode === 'double' ? styles.modeBtnActive : ''}`}
          onClick={() => { setMode('double'); setTotal(null); }}
        >
          2個
        </button>
      </div>
    </div>
  );
}
