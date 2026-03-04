import { useNavigate } from 'react-router-dom';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function PageHeader({ title, showBack = false, rightAction }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      {showBack ? (
        <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="戻る">
          ←
        </button>
      ) : (
        <div className={styles.spacer} />
      )}
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.right}>{rightAction ?? <div className={styles.spacer} />}</div>
    </header>
  );
}
