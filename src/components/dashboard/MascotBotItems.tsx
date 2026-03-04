import { useState, useEffect, useRef } from 'react';
import styles from './MascotBot.module.css';

const ADVICES = [
  'アイテムを使うともっと快適にゲームできるよ！',
  'サイコロは振る前に願掛けするのが流儀だよ',
  'コインでどちらが先攻か決めよう',
  '計算機で点数を正確に管理しよう',
  'タイマーがあると考えすぎを防いでくれるよ',
  'ルールブックでゲームの流れを予習しよう',
  'サイコロを振るときは心を無にするといいよ',
  '点数計算はこまめにするのが勝ちへの近道',
  'ルールに迷ったらすぐルールブックを確認！',
  'タイマーで制限時間を設けると盛り上がるよ',
  'コイントスで公平に決めよう',
  'ルールブックは全員が一緒に確認するといいね',
  '複数のゲームを組み合わせて遊ぶのも楽しいよ',
  'タイマーはゲームのテンポを保つ大事な道具',
  'サイコロの目は運だけじゃなく楽しさを生むよ！',
];

const TYPEWRITER_INTERVAL = 60;
const ADVICE_INTERVAL = 10000;

const MASCOT_IMAGES = [
  '/mascot/1.png',
  '/mascot/2.png',
  '/mascot/3.png',
  '/mascot/4.png',
  '/mascot/5.png',
  '/mascot/6.png',
];

// 角丸矩形 + 右しっぽが一体になった吹き出しSVGパス
const BUBBLE_W = 280;
const BUBBLE_H = 44;
const R = 12;
const TAIL_TIP_X = BUBBLE_W + 12;
const TAIL_Y_TOP = BUBBLE_H - 28;
const TAIL_Y_BOT = BUBBLE_H - 12;
const TAIL_Y_MID = (TAIL_Y_TOP + TAIL_Y_BOT) / 2;

const bubblePath = [
  `M ${R} 0`,
  `H ${BUBBLE_W - R}`,
  `Q ${BUBBLE_W} 0 ${BUBBLE_W} ${R}`,
  `V ${TAIL_Y_TOP}`,
  `L ${TAIL_TIP_X} ${TAIL_Y_MID}`,
  `L ${BUBBLE_W} ${TAIL_Y_BOT}`,
  `V ${BUBBLE_H - R}`,
  `Q ${BUBBLE_W} ${BUBBLE_H} ${BUBBLE_W - R} ${BUBBLE_H}`,
  `H ${R}`,
  `Q 0 ${BUBBLE_H} 0 ${BUBBLE_H - R}`,
  `V ${R}`,
  `Q 0 0 ${R} 0`,
  'Z',
].join(' ');

export function MascotBotItems() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [imgError, setImgError] = useState(false);
  const [mascotImg, setMascotImg] = useState(MASCOT_IMAGES[0]);

  const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisplayText('');
    if (typewriterRef.current !== null) clearInterval(typewriterRef.current);
    const text = ADVICES[currentIndex];
    let charIndex = 0;
    typewriterRef.current = setInterval(() => {
      charIndex += 1;
      setDisplayText(text.slice(0, charIndex));
      if (charIndex >= text.length) {
        clearInterval(typewriterRef.current!);
        typewriterRef.current = null;
      }
    }, TYPEWRITER_INTERVAL);
    return () => { if (typewriterRef.current !== null) clearInterval(typewriterRef.current); };
  }, [currentIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ADVICES.length);
      setMascotImg((prev) => {
        const others = MASCOT_IMAGES.filter((img) => img !== prev);
        return others[Math.floor(Math.random() * others.length)];
      });
    }, ADVICE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.bubbleWrap}>
        <svg
          className={styles.bubbleSvg}
          width={BUBBLE_W + 12}
          height={BUBBLE_H}
          viewBox={`0 0 ${BUBBLE_W + 12} ${BUBBLE_H}`}
          overflow="visible"
        >
          <filter id="bubble-shadow-items" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="rgba(0,0,0,0.45)" />
          </filter>
          <path
            d={bubblePath}
            className={styles.bubblePath}
            filter="url(#bubble-shadow-items)"
          />
        </svg>
        <div className={styles.bubbleText}>
          <span>{displayText}</span>
          <span className={styles.cursor}>|</span>
        </div>
      </div>

      <div className={styles.character}>
        {!imgError ? (
          <img
            src={mascotImg}
            alt="マスコット"
            className={styles.characterImg}
            onError={() => setImgError(true)}
          />
        ) : (
          <span className={styles.characterFallback}>🤖</span>
        )}
      </div>
    </div>
  );
}
