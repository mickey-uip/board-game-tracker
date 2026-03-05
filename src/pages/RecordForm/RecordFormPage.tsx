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
  const { user, profile } = useAuth();
  const { friends } = usePlayers();
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

  // 全参加者の名前解決用
  const allParticipants = useMemo(() => {
    const base: { id: string; name: string }[] = [];
    if (user && profile) {
      base.push({ id: user.uid, name: profile.displayName });
    }
    for (const f of friends) {
      if (!base.find((p) => p.id === f.id)) {
        base.push({ id: f.id, name: f.name });
      }
    }
    for (const inv of acceptedInvites) {
      if (!base.find((p) => p.id === inv.toUid)) {
        base.push({ id: inv.toUid, name: inv.toName });
      }
    }
    return base;
  }, [user, profile, friends, acceptedInvites]);

  // 承諾済みプレイヤー（自分以外）
  const acceptedPlayers = useMemo(() => {
    return selectedPlayerIds
      .filter((id) => id !== user?.uid)
      .map((id) => {
        const p = allParticipants.find((x) => x.id === id);
        return { id, name: p?.name ?? '???' };
      });
  }, [selectedPlayerIds, user, allParticipants]);

  // 承諾済みプレイヤーを除外
  const removePlayer = useCallback((playerId: string) => {
    if (playerId === user?.uid) return;
    setSelectedPlayerIds((prev) => prev.filter((id) => id !== playerId));
    setRanks((prev) => {
      const next = { ...prev };
      delete next[playerId];
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

  // フレンドをコードで招待
  const handleFriendSelect = async (friendId: string) => {
    const friend = friends.find((f) => f.id === friendId);
    if (!friend || !friend.friendCode) return;
    await sendInvite(friend.friendCode);
  };

  // 招待中・承諾済みを除外したフレンド（拒否されたフレンドは再招待可能）
  const availableFriends = useMemo(() => {
    return friends.filter(
      (f) => !outgoingInvites.find(
        (inv) => inv.toUid === f.id && inv.status !== 'declined',
      ),
    );
  }, [friends, outgoingInvites]);

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
          <p className={styles.fieldLabel}>参加プレイヤー</p>

          {/* 自分（リーダー） */}
          {user && profile && (
            <div className={styles.leaderCard}>
              <span className={styles.leaderName}>
                {profile.displayName}
              </span>
              <span className={styles.leaderBadge}>リーダー</span>
            </div>
          )}

          {/* フレンドをセレクトで招待 */}
          {availableFriends.length > 0 && (
            <select
              className={styles.friendSelectInput}
              value=""
              onChange={(e) => {
                if (e.target.value) handleFriendSelect(e.target.value);
              }}
            >
              <option value="">フレンドを招待...</option>
              {availableFriends.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          )}

          {/* IDでプレイヤーを招待 */}
          <InviteByCode onSendInvite={sendInvite} />

          {isOverMaxPlayers && (
            <p className={styles.playerAlert}>
              このゲームのプレイ人数は最大 {maxPlayers} 人です
            </p>
          )}
        </div>

        {/* 承諾済みプレイヤー一覧 */}
        {acceptedPlayers.length > 0 && (
          <div className={styles.acceptedSection}>
            <p className={styles.fieldLabel}>参加確定（{acceptedPlayers.length}人）</p>
            <div className={styles.acceptedList}>
              {acceptedPlayers.map((p) => (
                <div key={p.id} className={styles.acceptedItem}>
                  <span className={styles.acceptedName}>{p.name}</span>
                  <button
                    className={styles.acceptedRemove}
                    onClick={() => removePlayer(p.id)}
                    aria-label="除外"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
