import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { PlayerRankInput } from '../../components/record/PlayerRankInput';
import { EmptyState } from '../../components/ui/EmptyState';
import { usePlayers } from '../../hooks/usePlayers';
import { useGames } from '../../hooks/useGames';
import { useRecords } from '../../hooks/useRecords';
import { GENRE_LABEL } from '../../constants/genres';
import { todayString } from '../../utils/dateUtils';
import { RULEBOOK } from '../../data/rulebook';
import styles from './RecordFormPage.module.css';

export function RecordFormPage() {
  const navigate = useNavigate();
  const { players } = usePlayers();
  const { games, getGameById } = useGames();
  const { addRecord } = useRecords();

  const [date, setDate] = useState(todayString());
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

  const togglePlayer = (playerId: string) => {
    setSelectedPlayerIds((prev) => {
      const next = prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId];
      // 追加時はデフォルト順位をセット
      if (!prev.includes(playerId)) {
        setRanks((r) => ({ ...r, [playerId]: next.length }));
      }
      return next;
    });
  };

  const setRank = useCallback((playerId: string, rank: number) => {
    setRanks((prev) => ({ ...prev, [playerId]: rank }));
  }, []);

  const isOverMaxPlayers = maxPlayers !== null && selectedPlayerIds.length > maxPlayers;

  const canSubmit =
    !!gameId &&
    selectedPlayerIds.length >= 2 &&
    !isOverMaxPlayers &&
    selectedPlayerIds.every((id) => ranks[id] !== undefined);

  const handleSubmit = () => {
    if (!canSubmit) return;
    const playerResults = selectedPlayerIds.map((id) => ({
      playerId: id,
      rank: ranks[id],
    }));
    addRecord(gameId, date, playerResults);
    navigate('/records');
  };

  if (players.length === 0) {
    return (
      <div>
        <PageHeader title="対戦記録" showBack />
        <EmptyState
          message="プレイヤーがいません"
          description="設定からプレイヤーを追加してください"
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="対戦記録" showBack />
      <div className={styles.container}>
        {/* 日付 */}
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="record-date">
            日付
          </label>
          <input
            id="record-date"
            type="date"
            className={styles.dateInput}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* ゲーム選択 */}
        <Select
          label="ゲーム"
          id="game-select"
          placeholder="ゲームを選択"
          options={games.map((g) => ({ value: g.id, label: g.name }))}
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
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
    </div>
  );
}
