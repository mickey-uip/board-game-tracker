import { useState, useCallback, useEffect, useRef } from 'react';

// HMR でモジュールレベル変数がリセットされないよう window に持つ
declare global {
  interface Window {
    __lsSubscribers?: Map<string, Map<symbol, (value: unknown) => void>>;
  }
}

function getSubscribers() {
  if (!window.__lsSubscribers) {
    window.__lsSubscribers = new Map();
  }
  return window.__lsSubscribers;
}

function notify(key: string, value: unknown, excludeId: symbol) {
  getSubscribers().get(key)?.forEach((cb, id) => {
    if (id !== excludeId) cb(value);
  });
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const instanceId = useRef<symbol>(Symbol());
  const initialValueRef = useRef(initialValue);

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValueRef.current;
    } catch {
      return initialValueRef.current;
    }
  });

  // 最新の setStoredValue を ref で保持（stale closure 回避）
  const setterRef = useRef(setStoredValue);
  useEffect(() => {
    setterRef.current = setStoredValue;
  });

  // 他インスタンスからの通知を受け取る
  useEffect(() => {
    const subs = getSubscribers();
    const id = instanceId.current;
    const cb = (value: unknown) => setterRef.current(value as T);
    if (!subs.has(key)) subs.set(key, new Map());
    subs.get(key)!.set(id, cb);
    return () => {
      subs.get(key)?.delete(id);
    };
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = typeof value === 'function' ? (value as (p: T) => T)(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch (e) {
          console.error(`[useLocalStorage] Failed to write "${key}":`, e);
        }
        // 自分自身を除く同キーの全インスタンスに通知
        notify(key, next, instanceId.current);
        return next;
      });
    },
    [key]
  );

  return [storedValue, setValue] as const;
}
