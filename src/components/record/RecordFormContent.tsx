import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { GameSearchSelect } from './GameSearchSelect';
import { InviteByCode } from './InviteByCode';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { PlayerRankInput } from './PlayerRankInput';
import { usePlayers } from '../../hooks/usePlayers';
import { useGames } from '../../hooks/useGames';
import { useRecords } from '../../hooks/useRecords';
import { useGameInvites } from '../../hooks/useGameInvites';
import { useAuth } from '../../contexts/AuthContext';
import { GENRE_LABEL } from '../../constants/genres';
import { RULEBOOK } from '../../data/rulebook';
import styles from './RecordFormContent.module.css';

interface RecordFormContentProps {
  initialDate: string;
  onSuccess: () => void;
}

export function RecordFormContent({ initialDate, onSuccess }: RecordFormContentProps) {
  const { user, profile } = useAuth();
  const { friends } = usePlayers();
  const { games, getGameById } = useGames();
  const { addRecord } = useRecords();
  const { outgoingInvites, sendInvite, removeInviteByUid, cleanupInvites, purgeStaleInvites } = useGameInvites();

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

  // マウント時に前回セッションの残留招待をクリーンアップ（Firestore直接クエリ）
  useEffect(() => {
    purgeStaleInvites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 手動除外したプレイヤーを追跡（useEffectが再追加しないように）
  const removedPlayerIdsRef = useRef<Set<string>>(new Set());

  // 承諾済みの招待プレイヤーを自動的にselectedPlayerIdsに追加
  const acceptedInvites = useMemo(
    () => outgoingInvites.filter((inv) => inv.status === 'accepted'),
    [outgoingInvites],
  );

  useEffect(() => {
    for (const inv of acceptedInvites) {
      if (removedPlayerIdsRef.current.has(inv.toUid)) continue;
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

  // 承諾済みプレイヤー（自分以外）のリスト
  const acceptedPlayers = useMemo(() => {
    return selectedPlayerIds
      .filter((id) => id !== user?.uid)
      .map((id) => {
        const p = allParticipants.find((x) => x.id === id);
        return { id, name: p?.name ?? '???' };
      });
  }, [selectedPlayerIds, user, allParticipants]);

  // 承諾済みプレイヤーを除外（招待も削除して再招待可能にする）
  const removePlayer = useCallback((playerId: string) => {
    if (playerId === user?.uid) return;
    removedPlayerIdsRef.current.add(playerId);
    setSelectedPlayerIds((prev) => prev.filter((id) => id !== playerId));
    setRanks((prev) => {
      const next = { ...prev };
      delete next[playerId];
      return next;
    });
    removeInviteByUid(playerId);
  }, [user, removeInviteByUid]);

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

  // フレンド選択で招待を送る（再招待時は除外追跡をリセット）
  const handleFriendSelect = async (friendId: string) => {
    removedPlayerIdsRef.current.delete(friendId);
    const friend = friends.find((f) => f.id === friendId);
    if (!friend || !friend.friendCode) return;
    await sendInvite(friend.friendCode);
  };

  // pending・accepted以外のフレンドはセレクトに表示（再招待可能）
  const availableFriends = useMemo(() => {
    return friends.filter(
      (f) => !outgoingInvites.find(
        (inv) => inv.toUid === f.id && (inv.status === 'pending' || inv.status === 'accepted'),
      ),
    );
  }, [friends, outgoingInvites]);

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
  );
}
