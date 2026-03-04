import styles from './EmptyState.module.css';

interface EmptyStateProps {
  message: string;
  description?: string;
}

export function EmptyState({ message, description }: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <p className={styles.message}>{message}</p>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}
