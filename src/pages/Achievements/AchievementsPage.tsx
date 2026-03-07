import { PageHeader } from '../../components/layout/PageHeader';
import { BadgeGrid } from '../../components/achievements/BadgeGrid';
import { useBadges } from '../../hooks/useBadges';
import styles from './AchievementsPage.module.css';

export function AchievementsPage() {
  const { badges, unlockedCount, totalCount } = useBadges();

  return (
    <div>
      <PageHeader title="アチーブメント" showBack />
      <div className={styles.container}>
        <p className={styles.progress}>
          {unlockedCount} / {totalCount} 達成
        </p>
        <BadgeGrid badges={badges} />
      </div>
    </div>
  );
}
