import { useState, useCallback } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import styles from './OnboardingPopup.module.css';

interface Slide {
  image?: string;
  title: string;
  description: string;
}

const SLIDES: Slide[] = [
  {
    title: 'ボードゲームレコードへようこそ！',
    description:
      'プレイヤーを登録して対戦記録をつけましょう。\n記録をしていくことで、ジャンル別の勝率やプレイヤータイプ診断が楽しめます。',
  },
  {
    title: '遊んだゲームの戦績を記録しよう！',
    description:
      'フレンドを対戦に招待して、ゲームの結果を記録できます。\nプレイしたゲーム数や勝率など、あなたの戦績がひと目でわかります。',
  },
  {
    title: '友達を追加しよう！',
    description:
      'フレンドコードを共有して友達を追加しましょう。\nフレンドと一緒に対戦記録をつければ、ランキングや相性分析も楽しめます。',
  },
];

export function OnboardingPopup() {
  const { user, profile, refreshProfile } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const isLastSlide = currentSlide === SLIDES.length - 1;

  const handleNext = useCallback(async () => {
    if (!isLastSlide) {
      setCurrentSlide((prev) => prev + 1);
      return;
    }
    // 最後のスライド → 完了を保存
    if (user) {
      try {
        await setDoc(
          doc(db, 'users', user.uid),
          { onboardingCompleted: true },
          { merge: true },
        );
        await refreshProfile();
      } catch {
        // ignore
      }
    }
    setDismissed(true);
  }, [isLastSlide, user, refreshProfile]);

  // 表示条件: プロフィールがあり、オンボーディング未完了で、まだ閉じていない
  if (!profile || profile.onboardingCompleted || dismissed) {
    return null;
  }

  const slide = SLIDES[currentSlide];

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        {/* イメージエリア */}
        <div className={styles.imageArea}>
          {slide.image ? (
            <img src={slide.image} alt={slide.title} className={styles.image} />
          ) : (
            <span className={styles.imagePlaceholder}>🎲</span>
          )}
        </div>

        {/* 本文 */}
        <div className={styles.body} key={currentSlide}>
          <div className={styles.slideContent}>
            <h2 className={styles.title}>{slide.title}</h2>
            <p className={styles.description}>
              {slide.description.split('\n').map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
          </div>

          {/* ドットインジケーター */}
          <div className={styles.dots}>
            {SLIDES.map((_, i) => (
              <div
                key={i}
                className={`${styles.dot} ${i === currentSlide ? styles.dotActive : ''}`}
              />
            ))}
          </div>

          <Button fullWidth onClick={handleNext}>
            {isLastSlide ? 'はじめる' : '次へ'}
          </Button>
        </div>
      </div>
    </div>
  );
}
