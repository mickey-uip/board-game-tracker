import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { GameSearchSelect } from './GameSearchSelect';
import { InviteByCode } from './InviteByCode';
import { Button } from '../ui/Button';
import { PlayerRankInput } from './PlayerRankInput';
import { usePlayers } from '../../hooks/usePlayers';
import { useGames } from '../../hooks/useGames';
import { useRecords } from '../../hooks/useRecords';
import { useGameInvites } from '../../hooks/useGameInvites';
import { useAuth } from '../../contexts/AuthContext';
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
  const { outgoingInvites, sendInvite, removeInviteByUid, cleanupInvites, completeInvites, purgeStaleInvites } = useGameInvites();

  const [gameId, setGameId] = useState('');
  const [step, setStep] = useState<'setup' | 'rank'>('setup');
  // 自分は常に選択済み
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>(
    user ? [user.uid] : [],
  );
  const [ranks, setRanks] = useState<Record<string, number>>(
    user ? { [user.uid]: 1 } : {},
  );

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
  const [purgeComplete, setPurgeComplete] = useState(false);
  useEffect(() => {
    purgeStaleInvites().then(() => setPurgeComplete(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 手動除外したプレイヤーを追跡（useEffectが再追加しないように）
  const removedPlayerIdsRef = useRef<Set<string>>(new Set());

  // 承諾済みの招待プレイヤーを自動的にselectedPlayerIdsに追加（purge完了後のみ）
  const acceptedInvites = useMemo(
    () => outgoingInvites.filter((inv) => inv.status === 'accepted'),
    [outgoingInvites],
  );

  useEffect(() => {
    if (!purgeComplete) return;
    for (const inv of acceptedInvites) {
      if (removedPlayerIdsRef.current.has(inv.toUid)) continue;
      setSelectedPlayerIds((prev) => {
        if (prev.includes(inv.toUid)) return prev;
        const next = [...prev, inv.toUid];
        setRanks((r) => ({ ...r, [inv.toUid]: next.length }));
        return next;
      });
    }
  }, [acceptedInvites, purgeComplete]);

  // アンマウント時に招待をクリーンアップ
  const cleanupRef = useRef(cleanupInvites);
  cleanupRef.current = cleanupInvites;
  useEffect(() => {
    return () => {
      cleanupRef.current();
    };
  }, []);

  // 招待中のプレイヤー
  const pendingInvites = useMemo(
    () => outgoingInvites.filter((inv) => inv.status === 'pending'),
    [outgoingInvites],
  );

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
    for (const inv of [...acceptedInvites, ...pendingInvites]) {
      if (!base.find((p) => p.id === inv.toUid)) {
        base.push({ id: inv.toUid, name: inv.toName });
      }
    }
    return base;
  }, [user, profile, friends, acceptedInvites, pendingInvites]);

  // 招待中プレイヤー（自分以外）のリスト
  const pendingPlayers = useMemo(() => {
    return pendingInvites.map((inv) => ({
      id: inv.toUid,
      name: inv.toName,
    }));
  }, [pendingInvites]);

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

  // ステップ1: ゲーム選択済み＋2人以上＋人数超過なし
  const canProceed =
    !!gameId &&
    selectedPlayerIds.length >= 2 &&
    !isOverMaxPlayers;

  // ステップ2: 全員の順位入力済み
  const canSubmit =
    canProceed &&
    selectedPlayerIds.every((id) => ranks[id] !== undefined);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const playerResults = selectedPlayerIds.map((id) => ({
      playerId: id,
      rank: ranks[id],
    }));
    const game = getGameById(gameId);
    const gameName = game?.name ?? '';
    // RULEBOOKからゲーム画像を取得
    const entry = RULEBOOK.find((r) => 'preset-' + r.gameId === gameId);
    const gameImage = entry?.coverImage ?? '';
    // 招待参加者に完了通知を送信（cleanupの前に実行）
    await completeInvites(gameName, gameImage, playerResults);
    await addRecord(gameId, initialDate, playerResults, gameName);
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
      {step === 'setup' ? (
        <>
          {/* ゲーム選択（検索付き） */}
          <GameSearchSelect
            games={games}
            value={gameId}
            onChange={setGameId}
          />

          {/* 参加プレイヤー */}
          <div className={styles.field}>
            <p className={styles.fieldLabel}>参加プレイヤー</p>

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

            {/* 自分（リーダー） */}
            {user && profile && (
              <div className={styles.leaderCard}>
                <span className={styles.leaderName}>
                  {profile.displayName}
                </span>
                <span className={styles.leaderBadge}>リーダー</span>
              </div>
            )}

            {/* 招待メンバー一覧（タイトルなし） */}
            {(pendingPlayers.length > 0 || acceptedPlayers.length > 0) && (
              <div className={styles.acceptedList}>
                {pendingPlayers.map((p) => (
                  <div key={p.id} className={styles.pendingItem}>
                    <span className={styles.acceptedName}>{p.name}</span>
                    <span className={styles.pendingStatus}>招待中...</span>
                  </div>
                ))}
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
            )}

            {isOverMaxPlayers && (
              <p className={styles.playerAlert}>
                このゲームのプレイ人数は最大 {maxPlayers} 人です
              </p>
            )}
          </div>

          <Button fullWidth onClick={() => setStep('rank')} disabled={!canProceed}>
            結果入力へ
          </Button>
        </>
      ) : (
        <>
          {/* 順位入力 */}
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

          <div className={styles.stepActions}>
            <Button variant="secondary" fullWidth onClick={() => setStep('setup')}>
              戻る
            </Button>
            <Button fullWidth onClick={handleSubmit} disabled={!canSubmit}>
              記録する
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
