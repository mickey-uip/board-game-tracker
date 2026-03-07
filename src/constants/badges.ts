export type BadgeCategory = 'play' | 'win' | 'genre' | 'social' | 'special';

export interface BadgeDefinition {
  id: string;
  category: BadgeCategory;
  emoji: string;
  image?: string;
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
  { id: 'play-1', category: 'play', emoji: '🎲', image: '/Achievement/旅の始まり.png', title: '旅の始まり', description: '初めての対戦を記録しよう', conditionKey: 'totalGames>=1' },
  { id: 'play-10', category: 'play', emoji: '🎯', title: '見習いゲーマー', description: '10回の対戦を記録しよう', conditionKey: 'totalGames>=10' },
  { id: 'play-50', category: 'play', emoji: '🏅', title: '歴戦の亡者', description: '50回の対戦を記録しよう', conditionKey: 'totalGames>=50' },
  { id: 'play-100', category: 'play', emoji: '👑', image: '/Achievement/皇帝.png', title: '皇帝', description: '100回の対戦を記録しよう', conditionKey: 'totalGames>=100' },

  // ── 勝利（4） ──
  { id: 'win-1', category: 'win', emoji: '✌️', image: '/Achievement/ニューフェイス.png', title: 'ニューフェイス', description: '初めての勝利をつかもう', conditionKey: 'wins>=1' },
  { id: 'win-10', category: 'win', emoji: '🏆', image: '/Achievement/戦場の刃.png', title: '戦場の刃', description: '10回の勝利を達成しよう', conditionKey: 'wins>=10' },
  { id: 'win-50', category: 'win', emoji: '⚡', title: '無双', description: '50回の勝利を達成しよう', conditionKey: 'wins>=50' },
  { id: 'win-100', category: 'win', emoji: '💎', title: '百戦錬磨', description: '100回の勝利を達成しよう', conditionKey: 'wins>=100' },

  // ── ジャンル（6） ──
  { id: 'genre-str', category: 'genre', emoji: '🧠', title: 'ストラテジスタ', description: '戦略ゲームで5回勝利しよう', conditionKey: 'genreWin5:strategy' },
  { id: 'genre-lck', category: 'genre', emoji: '🍀', title: 'グッドラッカー', description: '運ゲームで5回勝利しよう', conditionKey: 'genreWin5:luck' },
  { id: 'genre-neg', category: 'genre', emoji: '🤝', title: 'ネゴシエイター', description: '交渉ゲームで5回勝利しよう', conditionKey: 'genreWin5:negotiation' },
  { id: 'genre-cop', category: 'genre', emoji: '💪', title: 'コムレイズ', description: '協力ゲームで5回勝利しよう', conditionKey: 'genreWin5:cooperative' },
  { id: 'genre-mem', category: 'genre', emoji: '🔮', title: 'レミニセンサ', description: '記憶ゲームで5回勝利しよう', conditionKey: 'genreWin5:memory' },
  { id: 'genre-all', category: 'genre', emoji: '🌟', title: 'オールラウンダー', description: '全ジャンルで5回ずつ勝利しよう', conditionKey: 'genreWin5All' },

  // ── ソーシャル（2） ──
  { id: 'social-1', category: 'social', emoji: '🤗', title: 'コンビ', description: 'フレンドを1人追加しよう', conditionKey: 'friends>=1' },
  { id: 'social-5', category: 'social', emoji: '🎉', title: 'パーティ編成', description: 'フレンドを5人追加しよう', conditionKey: 'friends>=5' },

  // ── スペシャル（4） ──
  { id: 'spec-type', category: 'special', emoji: '🔥', title: '才能覚醒', description: 'プレイヤータイプが判明する', conditionKey: 'playerTypeExists' },
  { id: 'spec-hyb', category: 'special', emoji: '✨', title: '二つの魂', description: 'ハイブリッドタイプになる', conditionKey: 'playerTypeHybrid' },
  { id: 'spec-coll', category: 'special', emoji: '📚', title: '探究心', description: '10種類以上のゲームをプレイしよう', conditionKey: 'uniqueGames>=10' },
  { id: 'spec-days', category: 'special', emoji: '🗓️', title: '常連', description: '7日以上プレイしよう', conditionKey: 'uniqueDays>=7' },
];
