import { useState, useMemo } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { CalendarPicker } from '../../components/record/CalendarPicker';
import { MonthRankingSlider } from '../../components/record/MonthRankingSlider';
import { RecordGroup } from '../../components/record/RecordGroup';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { RecordFormContent } from '../../components/record/RecordFormContent';
import { useRecords } from '../../hooks/useRecords';
import { useGames } from '../../hooks/useGames';
import { usePlayers } from '../../hooks/usePlayers';
import { useGameImages } from '../../hooks/useGameImages';
import { formatYearMonth, formatDateShort, todayString } from '../../utils/dateUtils';
import styles from './RecordListPage.module.css';

export function RecordListPage() {
  const { recordsByDate, deleteRecord } = useRecords();
  const { getGameById } = useGames();
  const { players } = usePlayers();
  const { getGameImage } = useGameImages();

  // 現在表示中の月 "YYYY-MM"
  const [currentMonth, setCurrentMonth] = useState<string>(() =>
    todayString().slice(0, 7)
  );
  // 選択中の日付（nullなら月全体表示）
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  // 対戦記録追加モーダル
  const [showRecordForm, setShowRecordForm] = useState(false);

  // カレンダーのバッジ表示用 + ランキング集計用: 選択月の記録のみ
  const monthRecordsByDate = useMemo(
    () => recordsByDate.filter((g) => g.date.startsWith(currentMonth)),
    [recordsByDate, currentMonth]
  );

  // 月間勝利数ランキング（上位3件）
  const monthRanking = useMemo(() => {
    const winCount: Record<string, number> = {};
    for (const group of monthRecordsByDate) {
      for (const record of group.records) {
        for (const pr of record.playerResults) {
          if (pr.rank === 1) {
            winCount[pr.playerId] = (winCount[pr.playerId] ?? 0) + 1;
          }
        }
      }
    }
    return Object.entries(winCount)
      .map(([playerId, wins]) => ({
        name: players.find((p) => p.id === playerId)?.name ?? '???',
        wins,
      }))
      .sort((a, b) => b.wins - a.wins)
      .slice(0, 3);
  }, [monthRecordsByDate, players]);

  // 表示月の記録 + 日付選択でさらに絞り込み
  const displayRecords = useMemo(() => {
    return selectedDate
      ? monthRecordsByDate.filter((g) => g.date === selectedDate)
      : monthRecordsByDate;
  }, [monthRecordsByDate, selectedDate]);

  // 月グループに整理
  const monthGroups = useMemo(() => {
    const groups: { month: string; dateGroups: typeof recordsByDate }[] = [];
    for (const dg of displayRecords) {
      const month = formatYearMonth(dg.date);
      const existing = groups.find((g) => g.month === month);
      if (existing) {
        existing.dateGroups.push(dg);
      } else {
        groups.push({ month, dateGroups: [dg] });
      }
    }
    return groups;
  }, [displayRecords]);

  const handleSelectDate = (date: string) => {
    // 同じ日を再タップで選択解除
    setSelectedDate((prev) => (prev === date ? null : date));
  };

  const handleMonthChange = (month: string) => {
    setCurrentMonth(month);
    setSelectedDate(null); // 月変更時は選択クリア
  };

  return (
    <div>
      <PageHeader title="対戦記録" />

      {/* 月間ランキングスライダー（ヘッダーとカレンダーの間） */}
      <MonthRankingSlider ranking={monthRanking} month={currentMonth} />

      <CalendarPicker
        recordsByDate={monthRecordsByDate}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        currentMonth={currentMonth}
        onMonthChange={handleMonthChange}
      />

      {/* 日付選択時のみ「新しい対戦を記録」ボタンを表示 */}
      {selectedDate && (
        <div className={styles.addButtonArea}>
          <Button fullWidth onClick={() => setShowRecordForm(true)}>
            + 新しい対戦を記録
          </Button>
        </div>
      )}

      {monthRecordsByDate.length === 0 ? (
        <EmptyState message="この月の記録はありません" description="日付を選択して対戦を記録してください" />
      ) : (
        <div className={styles.container}>
          {displayRecords.length === 0 ? (
            <EmptyState message="この日の記録はありません" />
          ) : (
            monthGroups.map(({ month, dateGroups }) => (
              <section key={month} className={styles.monthSection}>
                {dateGroups.map(({ date, records }) => (
                  <RecordGroup
                    key={date}
                    date={date}
                    records={records}
                    getGame={getGameById}
                    players={players}
                    onDelete={deleteRecord}
                    getGameImage={getGameImage}
                  />
                ))}
              </section>
            ))
          )}
        </div>
      )}

      {/* 対戦記録追加モーダル */}
      <Modal
        open={showRecordForm}
        onClose={() => setShowRecordForm(false)}
        title={`${formatDateShort(selectedDate ?? todayString())} の対戦を記録`}
      >
        <RecordFormContent
          initialDate={selectedDate ?? todayString()}
          onSuccess={() => setShowRecordForm(false)}
        />
      </Modal>
    </div>
  );
}
