import { Select } from '../ui/Select';
import styles from './CurrentPlayerSelector.module.css';
import type { Player } from '../../types';

interface CurrentPlayerSelectorProps {
  players: Player[];
  currentPlayerId: string | null;
  onSelect: (id: string) => void;
}

export function CurrentPlayerSelector({
  players,
  currentPlayerId,
  onSelect,
}: CurrentPlayerSelectorProps) {
  const options = players.map((p) => ({ value: p.id, label: p.name }));

  return (
    <div className={styles.wrapper}>
      <Select
        label="表示するプレイヤー"
        id="current-player-select"
        options={options}
        placeholder="プレイヤーを選択してください"
        value={currentPlayerId ?? ''}
        onChange={(e) => {
          if (e.target.value) onSelect(e.target.value);
        }}
      />
    </div>
  );
}
