import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { Player } from '../types';

interface FriendDoc {
  id: string; // Firestore doc id
  userIds: string[];
  createdAt: unknown;
}

export interface FriendPlayer extends Player {
  friendDocId: string; // for unfriending
}

/**
 * フレンド一覧を管理するhook
 * friends コレクションから自分が含まれるドキュメントを取得し、
 * 相手の users ドキュメントから表示名・アバターを取得する
 */
export function useFriends() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<FriendPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFriends([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'friends'),
      where('userIds', 'array-contains', user.uid),
    );

    const unsub = onSnapshot(q, async (snap) => {
      const friendDocs: FriendDoc[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<FriendDoc, 'id'>),
      }));

      // 各フレンドの相手uidを取得し、usersドキュメントを読む
      const result: FriendPlayer[] = [];
      for (const fd of friendDocs) {
        const otherUid = fd.userIds.find((uid) => uid !== user.uid);
        if (!otherUid) continue;

        const userDoc = await getDoc(doc(db, 'users', otherUid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          result.push({
            id: otherUid,
            name: data.displayName ?? '???',
            createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? '',
            friendDocId: fd.id,
          });
        }
      }
      setFriends(result);
      setLoading(false);
    });

    return unsub;
  }, [user]);

  const removeFriend = useCallback(
    async (friendDocId: string) => {
      await deleteDoc(doc(db, 'friends', friendDocId));
    },
    [],
  );

  return { friends, loading, removeFriend };
}
