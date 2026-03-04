import { useState, useCallback, useMemo } from 'react';
import { GameSearchSelect } from './GameSearchSelect';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { PlayerRankInput } from './PlayerRankInput';
import { EmptyState } from '../ui/EmptyState';
import { usePlayers } from '../../hooks/usePlayers';
import { useGames } from '../../hooks/useGames';
import { useRecords } from '../../hooks/useRecords';
import { GENRE_LABEL } from '../../constants/genres';
import { RULEBOOK } from '../../data/rulebook';
import styles from './RecordFormContent.module.css';

interface RecordFormContentProps {
  initialDate: string;
  onSuccess: () => void;
}

export function RecordFormContent({ initialDate, onSuccess }: RecordFormContentProps) {
  const { players } = usePlayers();
  const { games, getGameById } = useGames();
  const { addRecord } = useRecords();

  const [gameId, setGameId] = useState('');
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [ranks, setRanks] = useState<Record<string, number>>({});

  const selectedGame = gameId ? getGameById(gameId) : null;

  // 選択ゲームの最大プレイ人数をRULEBOOKから取得
  const maxPlayers = useMemo(() => {
    if (!gameId) return null;
    const entry = RULEBOOK.find((r) => 'preset-' + r.gameId === gameId);
    if (!entry) return null;
    const rangeMatch = entry.players.match(/(\d+)〜(\d+)人/);
    if (rangeMatch) return parseInt(rangeMatch[2], 10);
    const singleMatch = entry.players.match(/(\d+)人/);
    return singleMatch ? parseInt(singleMatch[1], 10) : null;
  }, [gameId]);

  const togglePlayer = useCallback((playerId: string) => {
    setSelectedPlayerIds((prev) => {
      if (prev.includes(playerId)) {
        // 除外: ranks からも削除
        setRanks((r) => {
          const next = { ...r };
          delete next[playerId];
          return next;
        });
        return prev.filter((id) => id !== playerId);
      } else {
        // 追加: デフォルト順位を付与
        const next = [...prev, playerId];
        setRanks((r) => ({ ...r, [playerId]: next.length }));
        return next;
      }
    });
  }, []);

  const setRank = useCallback((playerId: string, rank: number) => {
    setRanks((prev) => ({ ...prev, [playerId]: rank }));
  }, []);

  const isOverMaxPlayers = maxPlayers !== null && selectedPlayerIds.length > maxPlayers;

  const canSubmit =
    !!gameId &&
    selectedPlayerIds.length >= 2 &&
    !isOverMaxPlayers &&
    selectedPlayerIds.every((id) => ranks[id] !== undefined);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const playerResults = selectedPlayerIds.map((id) => ({
      playerId: id,
      rank: ranks[id],
    }));
    const game = getGameById(gameId);
    await addRecord(gameId, initialDate, playerResults, game?.name ?? '');
    onSuccess();
  };

  if (players.length === 0) {
    return (
      <EmptyState
        message="プレイヤーがいません"
        description="設定からプレイヤーを追加してください"
      />
    );
  }

  return (
    <div className={styles.container}>
      {/* ゲーム選択（検索付き） */}
      <GameSearchSelect
        games={games}
        value={gameId}
        onChange={setGameId}
      />

      {/* ジャンルバッジ */}
      {selectedGame && (
        <div className={styles.genres}>
          {selectedGame.genres.map((g) => (
            <Badge key={g} label={GENRE_LABEL[g]} />
          ))}
        </div>
      )}

      {/* 参加プレイヤー */}
      <div className={styles.field}>
        <p className={styles.fieldLabel}>参加プレイヤー（2人以上）</p>
        <div className={styles.playerCheckList}>
          {players.map((player) => (
            <label key={player.id} className={styles.playerCheck}>
              <input
                type="checkbox"
                checked={selectedPlayerIds.includes(player.id)}
                onChange={() => togglePlayer(player.id)}
              />
              <span>{player.name}</span>
            </label>
          ))}
        </div>
        {isOverMaxPlayers && (
          <p className={styles.playerAlert}>
            このゲームのプレイ人数は最大 {maxPlayers} 人です
          </p>
        )}
      </div>

      {/* 順位入力 */}
      {selectedPlayerIds.length >= 2 && (
        <div className={styles.rankSection}>
          <p className={styles.fieldLabel}>順位入力</p>
          {selectedPlayerIds.map((playerId) => {
            const player = players.find((p) => p.id === playerId)!;
            return (
              <PlayerRankInput
                key={playerId}
                playerName={player.name}
                rank={ranks[playerId] ?? 1}
                maxRank={selectedPlayerIds.length}
                onChange={(rank) => setRank(playerId, rank)}
              />
            );
          })}
        </div>
      )}

      <Button fullWidth onClick={handleSubmit} disabled={!canSubmit}>
        記録する
      </Button>
    </div>
  );
}
