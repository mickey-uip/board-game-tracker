import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFriends } from './useFriends';
import type { Player } from '../types';

/**
 * 自分 + フレンドを統合して返す
 */
export function usePlayers() {
  const { user, profile } = useAuth();
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

  // 全プレイヤー = 自分 + フレンド
  const players: Player[] = useMemo(() => {
    const list: Player[] = [];
    if (selfPlayer) list.push(selfPlayer);
    list.push(...friends);
    return list;
  }, [selfPlayer, friends]);

  return {
    players,
    selfPlayer,
    friends,
    loading: friendsLoading,
  };
}
