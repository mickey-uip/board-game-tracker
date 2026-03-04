import { useState, useEffect, useRef } from 'react';
import styles from './TimerTool.module.css';

const PRESETS = [
  { label: '3分', seconds: 180 },
  { label: '5分', seconds: 300 },
  { label: '10分', seconds: 600 },
];

type Phase = 'idle' | 'running' | 'paused' | 'done';

export function TimerTool() {
  const [selected, setSelected] = useState<number>(PRESETS[0].seconds);
  const [remaining, setRemaining] = useState<number>(PRESETS[0].seconds);
  const [phase, setPhase] = useState<Phase>('idle');
  const [customMin, setCustomMin] = useState('');
  const [customSec, setCustomSec] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // カウントダウン
  useEffect(() => {
    if (phase !== 'running') return;
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setPhase('done');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase]);

  const handlePreset = (seconds: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSelected(seconds);
    setRemaining(seconds);
    setPhase('idle');
  };

  const handleCustomApply = () => {
    const m = parseInt(customMin || '0', 10);
    const s = parseInt(customSec || '0', 10);
    const total = (isNaN(m) ? 0 : m) * 60 + (isNaN(s) ? 0 : s);
    if (total <= 0) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSelected(total);
    setRemaining(total);
    setPhase('idle');
    setCustomMin('');
    setCustomSec('');
  };

  const handleStart = () => setPhase('running');

  const handlePause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase('paused');
  };

  const handleResume = () => setPhase('running');

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRemaining(selected);
    setPhase('idle');
  };

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');

  const isCustomActive =
    phase !== 'running' &&
    !PRESETS.some((p) => p.seconds === selected);

  return (
    <div className={styles.container}>
      {/* 時間表示 */}
      <div className={`${styles.display} ${phase === 'done' ? styles.displayDone : ''}`}>
        <span className={styles.time}>{mm}:{ss}</span>
      </div>

      {/* プリセットボタン */}
      <div className={styles.presets}>
        {PRESETS.map(({ label, seconds }) => (
          <button
            key={seconds}
            className={`${styles.presetBtn} ${selected === seconds && !isCustomActive ? styles.presetActive : ''}`}
            onClick={() => handlePreset(seconds)}
            disabled={phase === 'running'}
          >
            {label}
          </button>
        ))}
      </div>

      {/* カスタム入力 */}
      <div className={styles.custom}>
        <input
          className={styles.customInput}
          type="number"
          min="0"
          max="99"
          placeholder="分"
          value={customMin}
          onChange={(e) => setCustomMin(e.target.value)}
          disabled={phase === 'running'}
        />
        <span className={styles.colon}>:</span>
        <input
          className={styles.customInput}
          type="number"
          min="0"
          max="59"
          placeholder="秒"
          value={customSec}
          onChange={(e) => setCustomSec(e.target.value)}
          disabled={phase === 'running'}
        />
        <button
          className={styles.customApplyBtn}
          onClick={handleCustomApply}
          disabled={phase === 'running'}
        >
          セット
        </button>
      </div>

      {/* 操作ボタン */}
      <div className={styles.controls}>
        {phase === 'idle' && (
          <button className={styles.startBtn} onClick={handleStart}>
            開始
          </button>
        )}
        {phase === 'running' && (
          <button className={styles.pauseBtn} onClick={handlePause}>
            一時停止
          </button>
        )}
        {phase === 'paused' && (
          <>
            <button className={styles.startBtn} onClick={handleResume}>
              再開
            </button>
            <button className={styles.resetBtn} onClick={handleReset}>
              リセット
            </button>
          </>
        )}
        {phase === 'done' && (
          <>
            <span className={styles.doneLabel}>⏰ 終了！</span>
            <button className={styles.resetBtn} onClick={handleReset}>
              リセット
            </button>
          </>
        )}
      </div>
    </div>
  );
}
