import { useState } from 'react';
import { BadgeDetailDialog } from './BadgeDetailDialog';
import { BADGE_CATEGORIES } from '../../constants/badges';
import type { BadgeResult } from '../../utils/badgeUtils';
import styles from './BadgeGrid.module.css';

interface BadgeGridProps {
  badges: BadgeResult[];
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  const [selectedBadge, setSelectedBadge] = useState<BadgeResult | null>(null);

  return (
    <>
      {BADGE_CATEGORIES.map(({ key, label }) => {
        const categoryBadges = badges.filter((b) => b.badge.category === key);
        return (
          <section key={key} className={styles.categorySection}>
            <h3 className={styles.categoryTitle}>{label}</h3>
            <div className={styles.grid}>
              {categoryBadges.map((b) => (
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
          </section>
        );
      })}

      <BadgeDetailDialog
        badge={selectedBadge}
        onClose={() => setSelectedBadge(null)}
      />
    </>
  );
}
