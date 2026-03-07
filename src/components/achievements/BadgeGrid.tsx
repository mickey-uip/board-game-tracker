import { useState } from 'react';
import { BadgeDetailDialog } from './BadgeDetailDialog';
import type { BadgeResult } from '../../utils/badgeUtils';
import styles from './BadgeGrid.module.css';

interface BadgeGridProps {
  badges: BadgeResult[];
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  const [selectedBadge, setSelectedBadge] = useState<BadgeResult | null>(null);

  return (
    <>
      <div className={styles.grid}>
        {badges.map((b) => (
          <button
            key={b.id}
            className={`${styles.badgeCircle} ${b.unlocked ? styles.unlocked : styles.locked}`}
            onClick={() => setSelectedBadge(b)}
            aria-label={b.badge.title}
          >
            <span className={styles.emoji}>{b.badge.emoji}</span>
          </button>
        ))}
      </div>

      <BadgeDetailDialog
        badge={selectedBadge}
        onClose={() => setSelectedBadge(null)}
      />
    </>
  );
}
