import { useRef } from 'react';
import styles from './CalendarPicker.module.css';
import type { GameRecord } from '../../types';

const WEEK_DAYS = ['日', '月', '火', '水', '木', '金', '土'] as const;

interface CalendarPickerProps {
  recordsByDate: { date: string; records: GameRecord[] }[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  currentMonth: string; // "YYYY-MM"
  onMonthChange: (month: string) => void;
}

// 今日の日付を "YYYY-MM-DD" 形式で取得
const getTodayStr = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function CalendarPicker({
  recordsByDate,
  selectedDate,
  onSelectDate,
  currentMonth,
  onMonthChange,
}: CalendarPickerProps) {
  const touchStartX = useRef<number | null>(null);
  const [yearStr, monthStr] = currentMonth.split('-');
  const todayStr = getTodayStr();
  const year = Number(yearStr);
  const month = Number(monthStr); // 1-indexed

  // 月の1日の曜日（0=日, 6=土）
  const firstDay = new Date(year, month - 1, 1);
  const startWeekday = firstDay.getDay();

  // 月の総日数（new Date(year, month, 0) = 当月の最終日）
  const daysInMonth = new Date(year, month, 0).getDate();

  // グリッドのセル総数（7の倍数に切り上げ）
  const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;

  // 記録数マップ { "YYYY-MM-DD": count }
  const recordCountMap = new Map<string, number>();
  for (const group of recordsByDate) {
    recordCountMap.set(group.date, group.records.length);
  }

  const movePrevMonth = () => {
    const d = new Date(year, month - 2, 1);
    onMonthChange(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    );
  };

  const moveNextMonth = () => {
    const d = new Date(year, month, 1);
    onMonthChange(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    );
  };

  const toDateString = (day: number): string =>
    `${yearStr}-${monthStr}-${String(day).padStart(2, '0')}`;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    const THRESHOLD = 50;
    if (diff < -THRESHOLD) moveNextMonth();
    else if (diff > THRESHOLD) movePrevMonth();
    touchStartX.current = null;
  };

  return (
    <div
      className={styles.calendar}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 月ナビゲーション */}
      <div className={styles.nav}>
        <button className={styles.navBtn} onClick={movePrevMonth} type="button">
          {'<'}
        </button>
        <span className={styles.monthLabel}>
          {year}年{month}月
        </span>
        <button className={styles.navBtn} onClick={moveNextMonth} type="button">
          {'>'}
        </button>
      </div>

      {/* 曜日ヘッダー + 日付グリッド */}
      <div className={styles.grid}>
        {WEEK_DAYS.map((d) => (
          <div key={d} className={styles.weekDay}>
            {d}
          </div>
        ))}

        {Array.from({ length: totalCells }).map((_, i) => {
          const dayNumber = i - startWeekday + 1;
          const isValid = dayNumber >= 1 && dayNumber <= daysInMonth;

          if (!isValid) {
            return <div key={`empty-${i}`} className={styles.emptyCell} />;
          }

          const dateStr = toDateString(dayNumber);
          const count = recordCountMap.get(dateStr) ?? 0;
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === todayStr;

          return (
            <button
              key={dateStr}
              className={[
                styles.dayCell,
                isSelected ? styles.selected : '',
                count > 0 ? styles.hasRecord : '',
                isToday ? styles.today : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelectDate(dateStr)}
              type="button"
            >
              <span className={styles.dayNumber}>{dayNumber}</span>
              {count > 0 && <span className={styles.badge} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
