import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { GameInvite } from '../types';

/**
 * ゲーム招待のリアルタイム管理フック
 * - 受信側: pending な招待をリッスン（ダイアログ表示用）
 * - 送信側: 送信した招待のステータス変化をリッスン
 */
export function useGameInvites() {
  const { user, profile } = useAuth();
  const [incomingInvites, setIncomingInvites] = useState<GameInvite[]>([]);
  const [outgoingInvites, setOutgoingInvites] = useState<GameInvite[]>([]);

  // ── 受信: 自分宛の pending 招待をリッスン ──
  useEffect(() => {
    if (!user) {
      setIncomingInvites([]);
      return;
    }
    const q = query(
      collection(db, 'gameInvites'),
      where('toUid', '==', user.uid),
      where('status', '==', 'pending'),
    );
    const unsub = onSnapshot(q, (snap) => {
      setIncomingInvites(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<GameInvite, 'id'>),
          createdAt: d.data().createdAt?.toDate?.()?.toISOString?.() ?? '',
        })),
      );
    });
    return unsub;
  }, [user]);

  // ── 送信: 自分が送った招待をリッスン（ステータス変化検知用） ──
  useEffect(() => {
    if (!user) {
      setOutgoingInvites([]);
      return;
    }
    const q = query(
      collection(db, 'gameInvites'),
      where('fromUid', '==', user.uid),
    );
    const unsub = onSnapshot(q, (snap) => {
      setOutgoingInvites(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<GameInvite, 'id'>),
          createdAt: d.data().createdAt?.toDate?.()?.toISOString?.() ?? '',
        })),
      );
    });
    return unsub;
  }, [user]);

  /** フレンドコードでユーザーを検索して招待を送信 */
  const sendInvite = useCallback(
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
        return { success: false, message: 'このIDのユーザーが見つかりません' };
      }

      const targetDoc = snap.docs[0];
      const targetUid = targetDoc.id;
      const targetName = (targetDoc.data().displayName as string) ?? '???';

      // 自分自身チェック
      if (targetUid === user.uid) {
        return { success: false, message: '自分自身には招待を送れません' };
      }

      // 既に招待送信済みチェック（pending）
      const existingPending = outgoingInvites.find(
        (inv) => inv.toUid === targetUid && inv.status === 'pending',
      );
      if (existingPending) {
        return { success: false, message: '既に招待を送信中です' };
      }

      // 既に承諾済みチェック
      const existingAccepted = outgoingInvites.find(
        (inv) => inv.toUid === targetUid && inv.status === 'accepted',
      );
      if (existingAccepted) {
        return { success: false, message: `${targetName} は既に参加済みです` };
      }

      // 招待ドキュメント作成
      await addDoc(collection(db, 'gameInvites'), {
        fromUid: user.uid,
        fromName: profile.displayName,
        toUid: targetUid,
        toName: targetName,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      return { success: true, message: `${targetName} に招待を送信しました` };
    },
    [user, profile, outgoingInvites],
  );

  /** 招待を承諾 */
  const acceptInvite = useCallback(
    async (inviteId: string) => {
      await updateDoc(doc(db, 'gameInvites', inviteId), {
        status: 'accepted',
      });
    },
    [],
  );

  /** 招待を辞退 */
  const declineInvite = useCallback(
    async (inviteId: string) => {
      await updateDoc(doc(db, 'gameInvites', inviteId), {
        status: 'declined',
      });
    },
    [],
  );

  /** 送信済み招待を全削除（フォーム離脱時に呼ぶ） */
  const cleanupInvites = useCallback(
    async () => {
      for (const inv of outgoingInvites) {
        try {
          await deleteDoc(doc(db, 'gameInvites', inv.id));
        } catch {
          /* ignore */
        }
      }
    },
    [outgoingInvites],
  );

  return {
    incomingInvites,
    outgoingInvites,
    sendInvite,
    acceptInvite,
    declineInvite,
    cleanupInvites,
  };
}
