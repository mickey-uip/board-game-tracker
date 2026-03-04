import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export interface FriendRequest {
  id: string;
  fromUid: string;
  toUid: string;
  fromName: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export function useFriendRequests() {
  const { user, profile } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // 受信リクエスト（自分宛のpending）
  useEffect(() => {
    if (!user) {
      setIncomingRequests([]);
      return;
    }
    const q = query(
      collection(db, 'friendRequests'),
      where('toUid', '==', user.uid),
      where('status', '==', 'pending'),
    );
    const unsub = onSnapshot(q, (snap) => {
      setIncomingRequests(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<FriendRequest, 'id'>),
          createdAt: d.data().createdAt?.toDate?.()?.toISOString?.() ?? '',
        })),
      );
      setLoading(false);
    });
    return unsub;
  }, [user]);

  // 送信リクエスト（自分が送ったpending）
  useEffect(() => {
    if (!user) {
      setOutgoingRequests([]);
      return;
    }
    const q = query(
      collection(db, 'friendRequests'),
      where('fromUid', '==', user.uid),
      where('status', '==', 'pending'),
    );
    const unsub = onSnapshot(q, (snap) => {
      setOutgoingRequests(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<FriendRequest, 'id'>),
          createdAt: d.data().createdAt?.toDate?.()?.toISOString?.() ?? '',
        })),
      );
    });
    return unsub;
  }, [user]);

  /** friendCode からユーザーを検索してリクエスト送信 */
  const sendRequest = useCallback(
    async (friendCode: string): Promise<{ success: boolean; message: string }> => {
      if (!user || !profile) return { success: false, message: '未ログイン' };

      const code = friendCode.trim().toUpperCase();

      // friendCode で相手を検索
      const q = query(
        collection(db, 'users'),
        where('friendCode', '==', code),
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        return { success: false, message: 'このフレンドコードのユーザーが見つかりません' };
      }

      const targetDoc = snap.docs[0];
      const targetUid = targetDoc.id;

      // 自分自身チェック
      if (targetUid === user.uid) {
        return { success: false, message: '自分自身にはリクエストを送れません' };
      }

      // 既にフレンドかチェック
      const friendsQ = query(
        collection(db, 'friends'),
        where('userIds', 'array-contains', user.uid),
      );
      const friendsSnap = await getDocs(friendsQ);
      const alreadyFriends = friendsSnap.docs.some((d) =>
        (d.data().userIds as string[]).includes(targetUid),
      );
      if (alreadyFriends) {
        return { success: false, message: '既にフレンドです' };
      }

      // 既にリクエスト送信済みかチェック
      const existingQ = query(
        collection(db, 'friendRequests'),
        where('fromUid', '==', user.uid),
        where('toUid', '==', targetUid),
        where('status', '==', 'pending'),
      );
      const existingSnap = await getDocs(existingQ);
      if (!existingSnap.empty) {
        return { success: false, message: 'リクエスト送信済みです' };
      }

      // リクエスト作成
      await addDoc(collection(db, 'friendRequests'), {
        fromUid: user.uid,
        toUid: targetUid,
        fromName: profile.displayName,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      return { success: true, message: 'フレンドリクエストを送信しました' };
    },
    [user, profile],
  );

  /** リクエスト承認 → friends ドキュメント作成 */
  const acceptRequest = useCallback(
    async (requestId: string, fromUid: string) => {
      if (!user) return;
      // リクエストを accepted に更新
      await updateDoc(doc(db, 'friendRequests', requestId), {
        status: 'accepted',
      });
      // friends ドキュメントを作成
      await addDoc(collection(db, 'friends'), {
        userIds: [user.uid, fromUid],
        createdAt: serverTimestamp(),
      });
    },
    [user],
  );

  /** リクエスト拒否 */
  const rejectRequest = useCallback(
    async (requestId: string) => {
      await updateDoc(doc(db, 'friendRequests', requestId), {
        status: 'rejected',
      });
    },
    [],
  );

  return {
    incomingRequests,
    outgoingRequests,
    loading,
    sendRequest,
    acceptRequest,
    rejectRequest,
  };
}
