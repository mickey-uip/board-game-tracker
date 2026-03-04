import type { GenreWinRate } from '../types';
import type { Genre } from '../types';

export type PlayerTypeResult = {
  title: string;
  isHybrid: boolean;
  primaryGenre: Genre;
  secondaryGenre: Genre | null;
} | null;

// 単体タイプ称号
const SOLO_TITLES: Record<Genre, string> = {
  strategy:    'ロジックマスター',
  luck:        'ダイスの申し子',
  negotiation: '対話の魔術師',
  cooperative: '司令塔',
  memory:      '情報トラッカー',
};

// ハイブリッドタイプ称号（キーは2つのジャンルをアルファベット順にソートして ":" で結合）
const HYBRID_TITLES: Record<string, string> = {
  'cooperative:negotiation': '共感型ディレクター',
  'memory:strategy':         '完全解析者',
  'negotiation:strategy':    '心理設計士',
  'luck:negotiation':        'チャンスメーカー',
  'luck:strategy':           '確率の支配者',
  'cooperative:luck':        '流れ星',
  'memory:negotiation':      '記録型ディベーター',
  'cooperative:memory':      'チーム解析官',
};

// タイプ別背景画像マップ（画像があるタイプのみ定義）
export const PLAYER_TYPE_IMAGE: Record<string, string> = {
  '心理設計士': '/player-types/shinri-sekkei-shi.png',
  'ロジックマスター': '/player-types/logic-master.png',
  'ダイスの申し子':   '/player-types/dice-no-miko.png',
  '対話の魔術師':     '/player-types/taiwa-no-majutsushi.png',
  '司令塔':           '/player-types/shirei-to.png',
  '情報トラッカー':   '/player-types/joho-tracker.png',
  '共感型ディレクター': '/player-types/kyokan-director.png',
  '完全解析者':       '/player-types/kanzen-kaiseki.png',
  'チャンスメーカー': '/player-types/chance-maker.png',
  '確率の支配者':     '/player-types/kakuritsu-shihai.png',
  '流れ星':           '/player-types/nagareboshi.png',
  '記録型ディベーター': '/player-types/kiroku-debater.png',
  'チーム解析官':     '/player-types/team-kaiseki.png',
  // 今後のタイプはここに追加
};

export function calcPlayerType(genreStats: GenreWinRate[]): PlayerTypeResult {
  // 各ジャンルの勝利数を計算
  const winsPerGenre = genreStats.map((s) => ({
    genre: s.genre,
    wins: Math.round(s.playCount * s.winRate),
  }));

  // 全体勝利数が0なら未判定
  const totalWins = winsPerGenre.reduce((sum, w) => sum + w.wins, 0);
  if (totalWins === 0) return null;

  // 勝利数の多い順にソート
  const sorted = [...winsPerGenre].sort((a, b) => b.wins - a.wins);
  const first = sorted[0];
  const second = sorted[1];

  // ハイブリッド判定
  //   条件A: 1位と2位の差が max(1, 1位の20%) 以内
  //   条件B: 上位2ジャンルの合計が全体の70%以上
  const gap = first.wins - second.wins;
  const threshold = Math.max(1, Math.round(first.wins * 0.2));
  const topTwoRatio = (first.wins + second.wins) / totalWins;
  const isHybrid = second.wins > 0 && (gap <= threshold || topTwoRatio >= 0.7);

  if (isHybrid) {
    const key = [first.genre, second.genre].sort().join(':');
    const hybridTitle = HYBRID_TITLES[key];
    if (hybridTitle) {
      return {
        title: hybridTitle,
        isHybrid: true,
        primaryGenre: first.genre,
        secondaryGenre: second.genre,
      };
    }
  }

  // 単体タイプ
  return {
    title: SOLO_TITLES[first.genre],
    isHybrid: false,
    primaryGenre: first.genre,
    secondaryGenre: null,
  };
}
