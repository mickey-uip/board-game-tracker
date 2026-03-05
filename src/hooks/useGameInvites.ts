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

  // ── 受信: 自分宛の pending / removed / cancelled 招待をリッスン ──
  useEffect(() => {
    if (!user) {
      setIncomingInvites([]);
      return;
    }
    const q = query(
      collection(db, 'gameInvites'),
      where('toUid', '==', user.uid),
      where('status', 'in', ['pending', 'removed', 'cancelled', 'completed']),
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

  /** 特定プレイヤーへの招待を除外通知に変更（✕で除外時に呼ぶ） */
  const removeInviteByUid = useCallback(
    async (targetUid: string) => {
      const targets = outgoingInvites.filter((inv) => inv.toUid === targetUid);
      for (const inv of targets) {
        try {
          if (inv.status === 'accepted') {
            // 承諾済み → 除外通知を送る
            await updateDoc(doc(db, 'gameInvites', inv.id), {
              status: 'removed',
            });
          } else {
            await deleteDoc(doc(db, 'gameInvites', inv.id));
          }
        } catch {
          /* ignore */
        }
      }
    },
    [outgoingInvites],
  );

  /** 送信済み招待をクリーンアップ（フォーム離脱時に呼ぶ）
   *  承諾済み → cancelled 通知、それ以外 → 削除 */
  const cleanupInvites = useCallback(
    async () => {
      for (const inv of outgoingInvites) {
        try {
          if (inv.status === 'accepted') {
            await updateDoc(doc(db, 'gameInvites', inv.id), {
              status: 'cancelled',
            });
          } else if (inv.status !== 'removed' && inv.status !== 'cancelled' && inv.status !== 'completed') {
            // removed/cancelled/completed は通知として残す（受信者が dismiss するまで削除しない）
            await deleteDoc(doc(db, 'gameInvites', inv.id));
          }
        } catch {
          /* ignore */
        }
      }
    },
    [outgoingInvites],
  );

  /** 対戦記録の完了通知を送信（記録する時に呼ぶ）
   *  承諾済み招待を completed に更新し、ゲーム情報と順位を付与
   *  リーダー自身にも completed 通知を作成 */
  const completeInvites = useCallback(
    async (
      gameName: string,
      gameImage: string,
      playerResults: { playerId: string; rank: number }[],
    ) => {
      // 招待プレイヤーの完了通知
      for (const inv of outgoingInvites) {
        if (inv.status !== 'accepted') continue;
        const result = playerResults.find((pr) => pr.playerId === inv.toUid);
        if (!result) continue;
        try {
          await updateDoc(doc(db, 'gameInvites', inv.id), {
            status: 'completed',
            gameName,
            gameImage,
            rank: result.rank,
          });
        } catch {
          /* ignore */
        }
      }

      // リーダー自身の完了通知を作成
      if (user && profile) {
        const leaderResult = playerResults.find((pr) => pr.playerId === user.uid);
        if (leaderResult) {
          try {
            await addDoc(collection(db, 'gameInvites'), {
              fromUid: user.uid,
              fromName: profile.displayName,
              toUid: user.uid,
              toName: profile.displayName,
              status: 'completed',
              gameName,
              gameImage,
              rank: leaderResult.rank,
              createdAt: serverTimestamp(),
            });
          } catch {
            /* ignore */
          }
        }
      }
    },
    [outgoingInvites, user, profile],
  );

  /** 通知を確認して削除（受信側がOKを押した後に呼ぶ） */
  const dismissNotification = useCallback(
    async (inviteId: string) => {
      try {
        await deleteDoc(doc(db, 'gameInvites', inviteId));
      } catch {
        /* ignore */
      }
    },
    [],
  );

  /** 残留招待を強制削除（マウント時の前回セッション残り掃除用）
   *  Firestoreに直接クエリし、リスナー状態に依存しない */
  const purgeStaleInvites = useCallback(
    async () => {
      if (!user) return;
      const q = query(
        collection(db, 'gameInvites'),
        where('fromUid', '==', user.uid),
      );
      const snap = await getDocs(q);
      for (const d of snap.docs) {
        try {
          const status = d.data().status;
          // removed/cancelled/completed は通知として残す（受信者が dismiss するまで削除しない）
          if (status === 'removed' || status === 'cancelled' || status === 'completed') continue;
          await deleteDoc(d.ref);
        } catch {
          /* ignore */
        }
      }
    },
    [user],
  );

  return {
    incomingInvites,
    outgoingInvites,
    sendInvite,
    acceptInvite,
    declineInvite,
    removeInviteByUid,
    cleanupInvites,
    completeInvites,
    dismissNotification,
    purgeStaleInvites,
  };
}
