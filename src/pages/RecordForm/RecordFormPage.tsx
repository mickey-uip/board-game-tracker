import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { PlayerRankInput } from '../../components/record/PlayerRankInput';
import { InviteByCode } from '../../components/record/InviteByCode';
import { usePlayers } from '../../hooks/usePlayers';
import { useGames } from '../../hooks/useGames';
import { useRecords } from '../../hooks/useRecords';
import { useGameInvites } from '../../hooks/useGameInvites';
import { useAuth } from '../../contexts/AuthContext';
import { GENRE_LABEL } from '../../constants/genres';
import { todayString } from '../../utils/dateUtils';
import { RULEBOOK } from '../../data/rulebook';
import styles from './RecordFormPage.module.css';

export function RecordFormPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { players } = usePlayers();
  const { games, getGameById } = useGames();
  const { addRecord } = useRecords();
  const { outgoingInvites, sendInvite, cleanupInvites } = useGameInvites();

  const [date, setDate] = useState(todayString());
  const [gameId, setGameId] = useState('');
  // 自分は常に選択済み
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>(
    user ? [user.uid] : [],
  );
  const [ranks, setRanks] = useState<Record<string, number>>(
    user ? { [user.uid]: 1 } : {},
  );

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

  // 承諾済みの招待プレイヤーを自動追加
  const acceptedInvites = useMemo(
    () => outgoingInvites.filter((inv) => inv.status === 'accepted'),
    [outgoingInvites],
  );

  useEffect(() => {
    for (const inv of acceptedInvites) {
      setSelectedPlayerIds((prev) => {
        if (prev.includes(inv.toUid)) return prev;
        const next = [...prev, inv.toUid];
        setRanks((r) => ({ ...r, [inv.toUid]: next.length }));
        return next;
      });
    }
  }, [acceptedInvites]);

  // アンマウント時に招待をクリーンアップ
  const cleanupRef = useRef(cleanupInvites);
  cleanupRef.current = cleanupInvites;
  useEffect(() => {
    return () => {
      cleanupRef.current();
    };
  }, []);

  // 全参加者 = 通常プレイヤー + 招待で承諾したプレイヤー（名前解決用）
  const allParticipants = useMemo(() => {
    const base = [...players];
    for (const inv of acceptedInvites) {
      if (!base.find((p) => p.id === inv.toUid)) {
        base.push({ id: inv.toUid, name: inv.toName, createdAt: '' });
      }
    }
    return base;
  }, [players, acceptedInvites]);

  const togglePlayer = useCallback((playerId: string) => {
    // 自分は外せない
    if (playerId === user?.uid) return;

    setSelectedPlayerIds((prev) => {
      const next = prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId];
      if (!prev.includes(playerId)) {
        setRanks((r) => ({ ...r, [playerId]: next.length }));
      } else {
        setRanks((r) => {
          const updated = { ...r };
          delete updated[playerId];
          return updated;
        });
      }
      return next;
    });
  }, [user]);

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
    await addRecord(gameId, date, playerResults, game?.name ?? '');
    navigate('/records');
  };

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
                  disabled={player.id === user?.uid}
                />
                <span>
                  {player.name}
                  {player.id === user?.uid && ' (自分)'}
                </span>
              </label>
            ))}
          </div>

          {/* IDでプレイヤーを招待 */}
          <InviteByCode
            outgoingInvites={outgoingInvites}
            onSendInvite={sendInvite}
          />

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
              const player = allParticipants.find((p) => p.id === playerId);
              return (
                <PlayerRankInput
                  key={playerId}
                  playerName={player?.name ?? '???'}
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
