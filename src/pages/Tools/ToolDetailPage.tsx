import { useParams, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { DiceTool } from './tools/DiceTool';
import { CoinTool } from './tools/CoinTool';
import { CalculatorTool } from './tools/CalculatorTool';
import { TimerTool } from './tools/TimerTool';
import { RulebookTool } from './tools/RulebookTool';
import styles from './ToolDetailPage.module.css';
import rulebookStyles from './tools/RulebookTool.module.css';

const TOOL_META: Record<string, { label: string; icon: string }> = {
  dice:       { label: 'サイコロ',     icon: '🎲' },
  coin:       { label: 'コイン',       icon: '🪙' },
  calculator: { label: '計算機',       icon: '🧮' },
  timer:      { label: 'タイマー',     icon: '⏱️' },
  rulebook:   { label: 'ルールブック', icon: '📚' },
};

export function ToolDetailPage() {
  const { toolKey } = useParams<{ toolKey: string }>();
  const [searchOpen, setSearchOpen] = useState(false);

  if (!toolKey || !TOOL_META[toolKey]) {
    return <Navigate to="/tools" replace />;
  }

  const { label } = TOOL_META[toolKey];

  // ルールブックのみ虫眼鏡ボタンをヘッダー右に表示
  const rightAction = toolKey === 'rulebook' ? (
    <button
      className={rulebookStyles.searchBtn}
      onClick={() => setSearchOpen((prev) => !prev)}
      aria-label="検索"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <line x1="16.5" y1="16.5" x2="22" y2="22" />
      </svg>
    </button>
  ) : undefined;

  return (
    <div className={styles.page}>
      <PageHeader title={label} showBack rightAction={rightAction} />
      <div className={`${styles.content}${toolKey !== 'rulebook' ? ` ${styles.contentCentered}` : ''}`}>
        {toolKey === 'dice'       && <DiceTool />}
        {toolKey === 'coin'       && <CoinTool />}
        {toolKey === 'calculator' && <CalculatorTool />}
        {toolKey === 'timer'      && <TimerTool />}
        {toolKey === 'rulebook'   && (
          <RulebookTool
            searchOpen={searchOpen}
            onSearchClose={() => setSearchOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
