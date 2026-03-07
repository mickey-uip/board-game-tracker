import { PageHeader } from '../../components/layout/PageHeader';
import { BadgeGrid } from '../../components/achievements/BadgeGrid';
import { useBadges } from '../../hooks/useBadges';
import styles from './AchievementsPage.module.css';

export function AchievementsPage() {
  const { badges } = useBadges();

  return (
    <div>
      <PageHeader title="称号" showBack />
      <div className={styles.container}>
        <BadgeGrid badges={badges} />
      </div>
    </div>
  );
}
