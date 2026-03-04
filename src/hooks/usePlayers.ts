import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocalPlayers } from './useLocalPlayers';
import type { Player } from '../types';

/**
 * 自分 + ローカルプレイヤー（+ 将来的にフレンド）を統合して返す
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

  // ログインユーザー自身を Player として表現
  const selfPlayer: Player | null = useMemo(() => {
    if (!user || !profile) return null;
    return {
      id: user.uid,
      name: profile.displayName,
      createdAt: new Date().toISOString(),
    };
  }, [user, profile]);

  // 全プレイヤー = 自分 + ローカル (+ フレンド: Phase 4 で追加)
  const players: Player[] = useMemo(() => {
    const list: Player[] = [];
    if (selfPlayer) list.push(selfPlayer);
    list.push(...localPlayers);
    return list;
  }, [selfPlayer, localPlayers]);

  return {
    players,
    selfPlayer,
    localPlayers,
    loading: localLoading,
    addPlayer: addLocalPlayer,
    updatePlayer: updateLocalPlayer,
    deletePlayer: deleteLocalPlayer,
  };
}
