import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { InviteDialog } from '../invite/InviteDialog';
import { OnboardingPopup } from '../onboarding/OnboardingPopup';
import { RecordsProvider } from '../../contexts/RecordsContext';
import styles from './AppShell.module.css';

const PARTICLE_COUNT = 6;

const COLORS = ['#f5c842', '#ffeb80', '#ffffff', '#ffa040', '#ffe4a0'];

function spawnSparkles(x: number, y: number) {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const el = document.createElement('div');
    // ランダムに星型 or 丸型
    const isStar = Math.random() > 0.4;
    el.className = isStar ? styles.sparkleStar : styles.sparkleCircle;
    const angle = (i / PARTICLE_COUNT) * 2 * Math.PI + (Math.random() - 0.5) * 0.6;
    const dist = 24 + Math.random() * 32;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const size = 4 + Math.random() * 5;
    const duration = 0.45 + Math.random() * 0.3;
    const delay = Math.random() * 0.08;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    el.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    el.style.setProperty('--color', color);
    el.style.setProperty('--size', `${size}px`);
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${delay}s`;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }
}

export function AppShell() {
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      spawnSparkles(e.clientX, e.clientY);
    };
    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  return (
    <RecordsProvider>
      <div className={styles.shell}>
        <main className={styles.main}>
          <Outlet />
        </main>
        <BottomNav />
        <InviteDialog />
        <OnboardingPopup />
      </div>
    </RecordsProvider>
  );
}
