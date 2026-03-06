/**
 * SNS共有用ユーティリティ
 * - Canvas API でシェアカード画像を生成
 * - X（Twitter）共有
 * - Instagram 共有（Web Share API / ダウンロードフォールバック）
 */

const CARD_SIZE = 1080;
const BG_COLOR = '#19130c';
const TITLE_COLOR = '#fff0d0';
const RANK_COLOR = '#f5c842';
const MUTED_COLOR = '#b3a68b';
const BORDER_COLOR = '#2a2010';

interface ShareCardOptions {
  gameName: string;
  rank: number;
  totalPlayers: number;
}

/** Canvas 1080×1080 のシェアカード画像を生成 */
export async function generateShareCard(options: ShareCardOptions): Promise<Blob> {
  const { gameName, rank, totalPlayers } = options;
  const canvas = document.createElement('canvas');
  canvas.width = CARD_SIZE;
  canvas.height = CARD_SIZE;
  const ctx = canvas.getContext('2d')!;

  // ── 背景 ──
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, CARD_SIZE, CARD_SIZE);

  // 内側のボーダー（装飾フレーム）
  const inset = 40;
  ctx.strokeStyle = BORDER_COLOR;
  ctx.lineWidth = 2;
  ctx.strokeRect(inset, inset, CARD_SIZE - inset * 2, CARD_SIZE - inset * 2);

  // ── サイコロ絵文字（上部） ──
  ctx.font = '80px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🎲', CARD_SIZE / 2, 260);

  // ── ゲームタイトル ──
  ctx.fillStyle = TITLE_COLOR;
  ctx.font = `bold 64px "LINE Seed JP", "Hiragino Sans", "Yu Gothic", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 長いタイトルは縮小
  const maxWidth = CARD_SIZE - 160;
  let titleFontSize = 64;
  ctx.font = `bold ${titleFontSize}px "LINE Seed JP", "Hiragino Sans", "Yu Gothic", sans-serif`;
  while (ctx.measureText(gameName).width > maxWidth && titleFontSize > 32) {
    titleFontSize -= 4;
    ctx.font = `bold ${titleFontSize}px "LINE Seed JP", "Hiragino Sans", "Yu Gothic", sans-serif`;
  }
  ctx.fillText(gameName, CARD_SIZE / 2, 420);

  // ── 人数表示 ──
  ctx.fillStyle = MUTED_COLOR;
  ctx.font = `500 36px "LINE Seed JP", "Hiragino Sans", "Yu Gothic", sans-serif`;
  ctx.fillText(`${totalPlayers}人中`, CARD_SIZE / 2, 550);

  // ── 順位（大きく） ──
  ctx.fillStyle = RANK_COLOR;
  ctx.font = `bold 160px "LINE Seed JP", "Hiragino Sans", "Yu Gothic", sans-serif`;
  ctx.fillText(`${rank}`, CARD_SIZE / 2, 700);
  ctx.font = `bold 64px "LINE Seed JP", "Hiragino Sans", "Yu Gothic", sans-serif`;
  ctx.fillText('位', CARD_SIZE / 2 + 100, 700);

  // ── ウォーターマーク ──
  ctx.fillStyle = MUTED_COLOR;
  ctx.font = `500 28px "LINE Seed JP", "Hiragino Sans", "Yu Gothic", sans-serif`;
  ctx.fillText('── ボドゲレコード ──', CARD_SIZE / 2, 900);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob failed'))),
      'image/png',
    );
  });
}

/** SNS投稿テキストを生成 */
export function getShareText(gameName: string, rank: number, totalPlayers: number): string {
  return `🎲 ${gameName}で${totalPlayers}人中${rank}位になりました！ #ボドゲレコード`;
}

/** X（Twitter）でテキストを共有 */
export function shareToX(text: string): void {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/** 画像を共有（Web Share API → ダウンロードフォールバック） */
export async function shareImage(blob: Blob, filename: string): Promise<void> {
  const file = new File([blob], filename, { type: 'image/png' });

  // Web Share API（モバイル）
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return;
    } catch {
      // ユーザーがキャンセルした場合などは無視
    }
  }

  // フォールバック: ダウンロード
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
