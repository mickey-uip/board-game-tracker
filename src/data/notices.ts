export type Notice = {
  id: string;
  title: string;
  body: string;
  date: string; // YYYY-MM-DD
  bannerImage?: string; // /public 以下の画像パス（任意）
};

// 新着順（日付が新しい順）に並べてください
export const NOTICES: Notice[] = [
  {
    id: '3',
    title: 'プレイヤータイプ診断機能を追加しました',
    body: 'ジャンル別の勝利実績をもとに、あなたのプレイスタイルを診断する「プレイヤータイプ」機能を追加しました。ホーム画面とプレイヤー詳細画面でご確認いただけます。',
    date: '2026-02-01',
    bannerImage: '/notices/player-type.png',
  },
  {
    id: '2',
    title: 'ツール機能を追加しました',
    body: 'ボードゲームで使えるサイコロ・コイン・計算機ツールを追加しました。ナビゲーションの「ツール」からご利用いただけます。',
    date: '2026-01-15',
    bannerImage: '/notices/tools.png',
  },
  {
    id: '1',
    title: 'ボードゲームレコードへようこそ！',
    body: 'プレイヤーを登録して対戦記録をつけましょう。ジャンル別の勝率やプレイヤータイプ診断が楽しめます。まずは設定画面からプレイヤーを追加してください。',
    date: '2026-01-01',
    bannerImage: '/onboarding/slide1.png',
  },
];
