import { NavLink } from 'react-router-dom';
import styles from './BottomNav.module.css';

/* ── アイコンペア型 ── */
interface IconPair {
  outline: React.ReactNode;
  filled: React.ReactNode;
}

/* ── ホーム ── */
const homeIcons: IconPair = {
  outline: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <polyline points="9 21 9 12 15 12 15 21" />
    </svg>
  ),
  filled: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <rect x="9" y="12" width="6" height="9" />
    </svg>
  ),
};

/* ── 対戦記録 ── */
const recordsIcons: IconPair = {
  outline: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  ),
  filled: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" fill="none" stroke="var(--color-bg)" strokeWidth="1.5" />
      <line x1="8" y1="13" x2="16" y2="13" stroke="var(--color-bg)" strokeWidth="1.5" />
      <line x1="8" y1="17" x2="13" y2="17" stroke="var(--color-bg)" strokeWidth="1.5" />
    </svg>
  ),
};

/* ── アイテム ── */
const itemsIcons: IconPair = {
  outline: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" ry="3"/>
      <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="8.5" cy="15.5" r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" stroke="none"/>
    </svg>
  ),
  filled: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <rect x="3" y="3" width="18" height="18" rx="3" ry="3"/>
      <circle cx="8.5" cy="8.5" r="1.2" fill="var(--color-bg)" stroke="none"/>
      <circle cx="15.5" cy="8.5" r="1.2" fill="var(--color-bg)" stroke="none"/>
      <circle cx="12" cy="12" r="1.2" fill="var(--color-bg)" stroke="none"/>
      <circle cx="8.5" cy="15.5" r="1.2" fill="var(--color-bg)" stroke="none"/>
      <circle cx="15.5" cy="15.5" r="1.2" fill="var(--color-bg)" stroke="none"/>
    </svg>
  ),
};

/* ── 設定 ── */
const settingsIcons: IconPair = {
  outline: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  filled: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      {/* 中央の穴をくり抜き */}
      <circle cx="12" cy="12" r="3" fill="var(--color-bg)" />
    </svg>
  ),
};

const NAV_ITEMS: { to: string; label: string; icons: IconPair }[] = [
  { to: '/',         label: 'ホーム',   icons: homeIcons     },
  { to: '/records',  label: '対戦記録', icons: recordsIcons  },
  { to: '/tools',    label: 'アイテム', icons: itemsIcons    },
  { to: '/settings', label: '設定',     icons: settingsIcons },
];

export function BottomNav() {
  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map(({ to, label, icons }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            [styles.item, isActive ? styles.active : ''].filter(Boolean).join(' ')
          }
        >
          {({ isActive }) => (
            <>
              <span className={styles.icon}>
                {isActive ? icons.filled : icons.outline}
              </span>
              <span className={styles.label}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
