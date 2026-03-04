import { useState, useEffect, useRef } from 'react';
import styles from './MascotBot.module.css';

const ADVICES = [
  '手番前に選択肢を3つ考えると強いよ',
  '相手の動きをよく観察しよう',
  '焦らず、じっくり考えるのが勝利の鍵',
  '得点よりも相手を妨害することも戦略だよ',
  '序盤はリソースを大切に使おう',
  '初めてのゲームは負けても経験値！',
  '勝てるゲームよりも楽しめるゲームを選ぼう',
  '手番の最後に盤面全体を確認しよう',
  'カードゲームは手札管理が命だよ',
  '協力ゲームはしっかりコミュニケーションを',
  '運も実力のうち、楽しんでいこう！',
  '相手の残り手番を常に数えよう',
  '終盤は得点計算を忘れずに',
  '新しいゲームを試すのも楽しみのひとつ！',
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
// W=280, H=44, r=12, しっぽ: 右辺の下寄りから突出
const BUBBLE_W = 280;
const BUBBLE_H = 44;
const R = 12;
const TAIL_X = BUBBLE_W;        // しっぽの根元X（矩形の右端）
const TAIL_TIP_X = BUBBLE_W + 12; // しっぽの先端X
const TAIL_Y_TOP = BUBBLE_H - 28; // しっぽ上辺Y
const TAIL_Y_BOT = BUBBLE_H - 12; // しっぽ下辺Y
const TAIL_Y_MID = (TAIL_Y_TOP + TAIL_Y_BOT) / 2; // しっぽ先端Y

// SVGパス: 角丸矩形をしっぽの箇所だけ切り欠いて三角を挿入
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

export function MascotBot() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [imgError, setImgError] = useState(false);
  const [mascotImg, setMascotImg] = useState(MASCOT_IMAGES[0]);
  const [visible, setVisible] = useState(true);

  const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // スクロールで表示/非表示を切り替え
  useEffect(() => {
    const scrollEl = document.querySelector('main') as HTMLElement | null;
    if (!scrollEl) return;
    const handleScroll = () => {
      setVisible(scrollEl.scrollTop < 60);
    };
    scrollEl.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollEl.removeEventListener('scroll', handleScroll);
  }, []);

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

  // 10秒ごとにアドバイスを切り替え、同時にキャラクター画像をランダム変更
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
    <div className={`${styles.wrapper}${visible ? '' : ` ${styles.wrapperHidden}`}`}>
      {/* SVG吹き出し：角丸+しっぽが一体のシェイプ */}
      <div className={styles.bubbleWrap}>
        <svg
          className={styles.bubbleSvg}
          width={BUBBLE_W + 12}
          height={BUBBLE_H}
          viewBox={`0 0 ${BUBBLE_W + 12} ${BUBBLE_H}`}
          overflow="visible"
        >
          <filter id="bubble-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="rgba(0,0,0,0.45)" />
          </filter>
          <path
            d={bubblePath}
            className={styles.bubblePath}
            filter="url(#bubble-shadow)"
          />
        </svg>
        {/* テキストをSVGの上に重ねる */}
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
