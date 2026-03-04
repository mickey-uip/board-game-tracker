import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { InviteDialog } from '../invite/InviteDialog';
import { RecordsProvider } from '../../contexts/RecordsContext';
import styles from './AppShell.module.css';

const PARTICLE_COUNT = 8;
const SPREAD = 40; // px

function spawnSparkles(x: number, y: number) {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const el = document.createElement('div');
    el.className = styles.sparkleParticle;
    const angle = (i / PARTICLE_COUNT) * 2 * Math.PI;
    const dist = SPREAD * (0.6 + Math.random() * 0.4);
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty('--dx', `${Math.cos(angle) * dist - 4}px`);
    el.style.setProperty('--dy', `${Math.sin(angle) * dist - 4}px`);
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
      </div>
    </RecordsProvider>
  );
}
