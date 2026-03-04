import { createContext, useContext, useCallback, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';
import type { GameRecord, PlayerResult } from '../types';

function generateId() {
  return `record-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface RecordsContextValue {
  records: GameRecord[];
  recordsSortedByDate: GameRecord[];
  recordsByDate: { date: string; records: GameRecord[] }[];
  addRecord: (gameId: string, date: string, playerResults: PlayerResult[]) => GameRecord;
  deleteRecord: (id: string) => void;
  getRecordsByPlayerId: (playerId: string) => GameRecord[];
}

const RecordsContext = createContext<RecordsContextValue | null>(null);

export function RecordsProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useLocalStorage<GameRecord[]>(STORAGE_KEYS.RECORDS, []);

  const addRecord = useCallback(
    (gameId: string, date: string, playerResults: PlayerResult[]) => {
      const newRecord: GameRecord = {
        id: generateId(),
        gameId,
        date,
        playerResults,
        createdAt: new Date().toISOString(),
      };
      setRecords((prev) => [newRecord, ...prev]);
      return newRecord;
    },
    [setRecords]
  );

  const deleteRecord = useCallback(
    (id: string) => {
      setRecords((prev) => prev.filter((r) => r.id !== id));
    },
    [setRecords]
  );

  const recordsSortedByDate = useMemo(
    () => [...records].sort((a, b) => b.date.localeCompare(a.date)),
    [records]
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
        r.playerResults.some((pr) => pr.playerId === playerId)
      ),
    [recordsSortedByDate]
  );

  const value = useMemo(
    () => ({ records, recordsSortedByDate, recordsByDate, addRecord, deleteRecord, getRecordsByPlayerId }),
    [records, recordsSortedByDate, recordsByDate, addRecord, deleteRecord, getRecordsByPlayerId]
  );

  return <RecordsContext.Provider value={value}>{children}</RecordsContext.Provider>;
}

export function useRecordsContext() {
  const ctx = useContext(RecordsContext);
  if (!ctx) throw new Error('useRecordsContext must be used within RecordsProvider');
  return ctx;
}
