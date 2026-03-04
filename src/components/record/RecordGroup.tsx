import { RecordCard } from './RecordCard';
import { formatDateShort } from '../../utils/dateUtils';
import styles from './RecordGroup.module.css';
import type { GameRecord, Game, Player } from '../../types';

interface RecordGroupProps {
  date: string;
  records: GameRecord[];
  getGame: (id: string) => Game | null;
  players: Player[];
  onDelete?: (id: string) => void;
  getGameImage?: (gameId: string) => string | null;
}

export function RecordGroup({ date, records, getGame, players, onDelete, getGameImage }: RecordGroupProps) {
  return (
    <div className={styles.group}>
      <h3 className={styles.dateLabel}>{formatDateShort(date)}</h3>
      <div className={styles.cards}>
        {records.map((record) => (
          <RecordCard
            key={record.id}
            record={record}
            game={getGame(record.gameId)}
            players={players}
            onDelete={onDelete}
            getGameImage={getGameImage}
          />
        ))}
      </div>
    </div>
  );
}
