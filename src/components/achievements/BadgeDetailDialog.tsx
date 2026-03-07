import { Button } from '../ui/Button';
import type { BadgeResult } from '../../utils/badgeUtils';
import styles from './BadgeDetailDialog.module.css';

interface BadgeDetailDialogProps {
  badge: BadgeResult | null;
  onClose: () => void;
}

export function BadgeDetailDialog({ badge, onClose }: BadgeDetailDialogProps) {
  if (!badge) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.body}>
          <span className={`${styles.emoji} ${badge.unlocked ? '' : styles.emojiLocked}`}>
            {badge.badge.emoji}
          </span>
          <h2 className={styles.title}>{badge.badge.title}</h2>
          <p className={styles.description}>{badge.badge.description}</p>
          {badge.unlocked ? (
            <p className={styles.status}>達成済み ✓</p>
          ) : (
            <p className={styles.statusLocked}>未達成</p>
          )}
          <Button variant="secondary" fullWidth onClick={onClose}>
            閉じる
          </Button>
        </div>
      </div>
    </div>
  );
}
