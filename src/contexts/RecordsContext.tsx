import { createContext, useContext, useCallback, useMemo, useState, useEffect, type ReactNode } from 'react';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import type { GameRecord, PlayerResult } from '../types';

interface RecordsContextValue {
  records: GameRecord[];
  recordsSortedByDate: GameRecord[];
  recordsByDate: { date: string; records: GameRecord[] }[];
  addRecord: (gameId: string, date: string, playerResults: PlayerResult[], gameName?: string) => Promise<GameRecord>;
  deleteRecord: (id: string) => Promise<void>;
  getRecordsByPlayerId: (playerId: string) => GameRecord[];
  loading: boolean;
}

const RecordsContext = createContext<RecordsContextValue | null>(null);

export function RecordsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Firestore リアルタイムリスナー: 自分が参加している記録を全取得
  useEffect(() => {
    if (!user) {
      setRecords([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'records'),
      where('participantUids', 'array-contains', user.uid),
    );

    const unsub = onSnapshot(q, (snap) => {
      const recs: GameRecord[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          gameId: data.gameId ?? '',
          date: data.date ?? '',
          playerResults: (data.playerResults ?? []).map((pr: Record<string, unknown>) => ({
            playerId: pr.playerId as string,
            rank: pr.rank as number,
          })),
          createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
        };
      });
      setRecords(recs);
      setLoading(false);
    });

    return unsub;
  }, [user]);

  const addRecord = useCallback(
    async (gameId: string, date: string, playerResults: PlayerResult[], gameName?: string): Promise<GameRecord> => {
      if (!user) throw new Error('Not authenticated');

      // participantUids: 自分のuidは必ず含める
      const participantUids = Array.from(
        new Set([user.uid, ...playerResults.map((pr) => pr.playerId)])
      );

      const docData = {
        gameId,
        gameName: gameName ?? '',
        date,
        playerResults: playerResults.map((pr) => ({
          playerId: pr.playerId,
          rank: pr.rank,
        })),
        participantUids,
        createdByUid: user.uid,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'records'), docData);

      return {
        id: docRef.id,
        gameId,
        date,
        playerResults,
        createdAt: new Date().toISOString(),
      };
    },
    [user],
  );

  const deleteRecord = useCallback(
    async (id: string) => {
      await deleteDoc(doc(db, 'records', id));
    },
    [],
  );

  const recordsSortedByDate = useMemo(
    () => [...records].sort((a, b) => b.date.localeCompare(a.date)),
    [records],
  );

  const recordsByDate = useMemo(() => {
    const groups: { date: string; records: GameRecord[] }[] = [];
    for (const record of recordsSortedByDate) {
      const existing = groups.find((g) => g.date === record.date);
      if (existing) {
        existing.records.push(record);
      } else {
        groups.push({ date: record.date, records: [record] });
      }
    }
    return groups;
  }, [recordsSortedByDate]);

  const getRecordsByPlayerId = useCallback(
    (playerId: string) =>
      recordsSortedByDate.filter((r) =>
        r.playerResults.some((pr) => pr.playerId === playerId),
      ),
    [recordsSortedByDate],
  );

  const value = useMemo(
    () => ({ records, recordsSortedByDate, recordsByDate, addRecord, deleteRecord, getRecordsByPlayerId, loading }),
    [records, recordsSortedByDate, recordsByDate, addRecord, deleteRecord, getRecordsByPlayerId, loading],
  );

  return <RecordsContext.Provider value={value}>{children}</RecordsContext.Provider>;
}

export function useRecordsContext() {
  const ctx = useContext(RecordsContext);
  if (!ctx) throw new Error('useRecordsContext must be used within RecordsProvider');
  return ctx;
}
