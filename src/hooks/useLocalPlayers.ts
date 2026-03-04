import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { Player } from '../types';

/**
 * Firestore `users/{uid}/localPlayers` サブコレクションで
 * ローカルプレイヤー（アカウントを持たない人）を管理する
 */
export function useLocalPlayers() {
  const { user } = useAuth();
  const [localPlayers, setLocalPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLocalPlayers([]);
      setLoading(false);
      return;
    }
    const colRef = collection(db, 'users', user.uid, 'localPlayers');
    const unsub = onSnapshot(colRef, (snap) => {
      const players: Player[] = snap.docs.map((d) => ({
        id: d.id,
        name: d.data().name ?? '',
        createdAt: d.data().createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
      }));
      setLocalPlayers(players);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const addLocalPlayer = useCallback(
    async (name: string): Promise<Player | null> => {
      if (!user) return null;
      const colRef = collection(db, 'users', user.uid, 'localPlayers');
      const docRef = await addDoc(colRef, {
        name: name.trim(),
        createdAt: serverTimestamp(),
      });
      return {
        id: docRef.id,
        name: name.trim(),
        createdAt: new Date().toISOString(),
      };
    },
    [user],
  );

  const updateLocalPlayer = useCallback(
    async (id: string, name: string) => {
      if (!user) return;
      const docRef = doc(db, 'users', user.uid, 'localPlayers', id);
      await updateDoc(docRef, { name: name.trim() });
    },
    [user],
  );

  const deleteLocalPlayer = useCallback(
    async (id: string) => {
      if (!user) return;
      const docRef = doc(db, 'users', user.uid, 'localPlayers', id);
      await deleteDoc(docRef);
    },
    [user],
  );

  return { localPlayers, loading, addLocalPlayer, updateLocalPlayer, deleteLocalPlayer };
}
