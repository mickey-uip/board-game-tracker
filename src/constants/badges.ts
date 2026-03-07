export type BadgeCategory = 'play' | 'win' | 'genre' | 'social' | 'special';

export interface BadgeDefinition {
  id: string;
  category: BadgeCategory;
  emoji: string;
  title: string;
  description: string;
  conditionKey: string;
}

export const BADGE_CATEGORIES: { key: BadgeCategory; label: string }[] = [
  { key: 'play', label: 'プレイ' },
  { key: 'win', label: '勝利' },
  { key: 'genre', label: 'ジャンル' },
  { key: 'social', label: 'ソーシャル' },
  { key: 'special', label: 'スペシャル' },
];

export const BADGES: BadgeDefinition[] = [
  // ── プレイ（4） ──
  { id: 'play-1', category: 'play', emoji: '🎲', title: 'はじめの一歩', description: '初めての対戦を記録しよう', conditionKey: 'totalGames>=1' },
  { id: 'play-10', category: 'play', emoji: '🎯', title: 'レギュラー', description: '10回の対戦を記録しよう', conditionKey: 'totalGames>=10' },
  { id: 'play-50', category: 'play', emoji: '🏅', title: 'ベテラン', description: '50回の対戦を記録しよう', conditionKey: 'totalGames>=50' },
  { id: 'play-100', category: 'play', emoji: '👑', title: 'レジェンド', description: '100回の対戦を記録しよう', conditionKey: 'totalGames>=100' },

  // ── 勝利（4） ──
  { id: 'win-1', category: 'win', emoji: '✌️', title: '初勝利', description: '初めての勝利をつかもう', conditionKey: 'wins>=1' },
  { id: 'win-10', category: 'win', emoji: '🏆', title: '勝利の達人', description: '10回の勝利を達成しよう', conditionKey: 'wins>=10' },
  { id: 'win-50', category: 'win', emoji: '⚡', title: '無敵', description: '50回の勝利を達成しよう', conditionKey: 'wins>=50' },
  { id: 'win-100', category: 'win', emoji: '💎', title: '伝説の勝者', description: '100回の勝利を達成しよう', conditionKey: 'wins>=100' },

  // ── ジャンル（6） ──
  { id: 'genre-str', category: 'genre', emoji: '🧠', title: '戦略家', description: '戦略ゲームで勝利しよう', conditionKey: 'genreWin:strategy' },
  { id: 'genre-lck', category: 'genre', emoji: '🍀', title: '幸運の持ち主', description: '運ゲームで勝利しよう', conditionKey: 'genreWin:luck' },
  { id: 'genre-neg', category: 'genre', emoji: '🤝', title: '交渉人', description: '交渉ゲームで勝利しよう', conditionKey: 'genreWin:negotiation' },
  { id: 'genre-cop', category: 'genre', emoji: '💪', title: '協力者', description: '協力ゲームで勝利しよう', conditionKey: 'genreWin:cooperative' },
  { id: 'genre-mem', category: 'genre', emoji: '🔮', title: '記憶の番人', description: '記憶ゲームで勝利しよう', conditionKey: 'genreWin:memory' },
  { id: 'genre-all', category: 'genre', emoji: '🌟', title: 'オールラウンダー', description: '全ジャンルで勝利しよう', conditionKey: 'genreWinAll' },

  // ── ソーシャル（2） ──
  { id: 'social-1', category: 'social', emoji: '🤗', title: '仲間', description: 'フレンドを1人追加しよう', conditionKey: 'friends>=1' },
  { id: 'social-5', category: 'social', emoji: '🎉', title: '社交家', description: 'フレンドを5人追加しよう', conditionKey: 'friends>=5' },

  // ── スペシャル（4） ──
  { id: 'spec-type', category: 'special', emoji: '🔥', title: 'タイプ覚醒', description: 'プレイヤータイプが判明する', conditionKey: 'playerTypeExists' },
  { id: 'spec-hyb', category: 'special', emoji: '✨', title: 'ハイブリッド', description: 'ハイブリッドタイプになる', conditionKey: 'playerTypeHybrid' },
  { id: 'spec-coll', category: 'special', emoji: '📚', title: 'ゲームコレクター', description: '10種類以上のゲームをプレイしよう', conditionKey: 'uniqueGames>=10' },
  { id: 'spec-days', category: 'special', emoji: '🗓️', title: '常連プレイヤー', description: '7日以上プレイしよう', conditionKey: 'uniqueDays>=7' },
];
