import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocalPlayers } from './useLocalPlayers';
import { useFriends } from './useFriends';
import type { Player } from '../types';

/**
 * 自分 + フレンド + ローカルプレイヤーを統合して返す
 */
export function usePlayers() {
  const { user, profile } = useAuth();
  const {
    localPlayers,
    loading: localLoading,
    addLocalPlayer,
    updateLocalPlayer,
    deleteLocalPlayer,
  } = useLocalPlayers();
  const { friends, loading: friendsLoading } = useFriends();

  // ログインユーザー自身を Player として表現
  const selfPlayer: Player | null = useMemo(() => {
    if (!user || !profile) return null;
    return {
      id: user.uid,
      name: profile.displayName,
      createdAt: new Date().toISOString(),
    };
  }, [user, profile]);

  // 全プレイヤー = 自分 + フレンド + ローカル
  const players: Player[] = useMemo(() => {
    const list: Player[] = [];
    if (selfPlayer) list.push(selfPlayer);
    list.push(...friends);
    list.push(...localPlayers);
    return list;
  }, [selfPlayer, friends, localPlayers]);

  return {
    players,
    selfPlayer,
    friends,
    localPlayers,
    loading: localLoading || friendsLoading,
    addPlayer: addLocalPlayer,
    updatePlayer: updateLocalPlayer,
    deletePlayer: deleteLocalPlayer,
  };
}
