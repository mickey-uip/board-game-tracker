import { useState, useEffect, useRef, useCallback } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useGameInvites } from '../../hooks/useGameInvites';
import styles from './InviteDialog.module.css';

/**
 * グローバル招待 & 通知ダイアログ（受信側）
 * AppShell に配置し、どの画面でも招待・通知を受け取れるようにする
 * - pending: 10秒カウントダウン付き招待
 * - completed: 対戦記録完了の祝福通知
 * - removed: 対戦から除外された通知
 * - cancelled: 対戦記録が中止された通知
 */
export function InviteDialog() {
  const {
    incomingInvites,
    acceptInvite,
    declineInvite,
    dismissNotification,
  } = useGameInvites();
  const [countdown, setCountdown] = useState(10);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentInviteIdRef = useRef<string | null>(null);

  // 最初の招待/通知を表示
  const currentInvite = incomingInvites[0] ?? null;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // pending 招待の場合のみタイマーを開始
  useEffect(() => {
    if (!currentInvite) {
      clearTimer();
      currentInviteIdRef.current = null;
      return;
    }

    // 同じ招待なら何もしない
    if (currentInviteIdRef.current === currentInvite.id) return;

    currentInviteIdRef.current = currentInvite.id;

    // pending 以外はタイマー不要
    if (currentInvite.status !== 'pending') {
      clearTimer();
      return;
    }

    // pending → タイマーリセット
    setCountdown(10);
    clearTimer();

    const inviteId = currentInvite.id;
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          declineInvite(inviteId);
          clearTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimer();
  }, [currentInvite, declineInvite, clearTimer]);

  if (!currentInvite) return null;

  const handleAccept = () => {
    clearTimer();
    acceptInvite(currentInvite.id);
  };

  const handleDecline = () => {
    clearTimer();
    declineInvite(currentInvite.id);
  };

  const handleDismiss = () => {
    dismissNotification(currentInvite.id);
  };

  // ── 対戦記録完了（祝福ポップアップ：画面中央にお知らせ風） ──
  if (currentInvite.status === 'completed') {
    return (
      <div className={styles.notificationOverlay} onClick={handleDismiss}>
        <div
          className={styles.notificationCard}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.content}>
            {currentInvite.gameImage && (
              <img
                src={currentInvite.gameImage}
                alt={currentInvite.gameName ?? ''}
                className={styles.gameImage}
              />
            )}
            <p className={styles.gameName}>{currentInvite.gameName}</p>
            <div className={styles.rankBadge}>
              <span className={styles.rankNumber}>{currentInvite.rank}</span>
              <span className={styles.rankLabel}>位</span>
            </div>
            <p className={styles.congratsMessage}>
              対戦を記録しました！
              <br />
              {currentInvite.rank === 1
                ? '1位おめでとう！'
                : `${currentInvite.rank}位 おつかれさま！`}
            </p>
            <div className={styles.actions}>
              <Button variant="secondary" fullWidth onClick={handleDismiss}>
                閉じる
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 通知タイプ別の表示
  if (currentInvite.status === 'removed') {
    return (
      <Modal open={true} onClose={handleDismiss} title="対戦からの除外">
        <div className={styles.content}>
          <p className={styles.message}>
            <strong>{currentInvite.fromName}</strong> さんの対戦から
            <br />
            除外されました。
          </p>
          <div className={styles.actions}>
            <Button variant="primary" fullWidth onClick={handleDismiss}>
              OK
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  if (currentInvite.status === 'cancelled') {
    return (
      <Modal open={true} onClose={handleDismiss} title="対戦記録の中止">
        <div className={styles.content}>
          <p className={styles.message}>
            <strong>{currentInvite.fromName}</strong> さんの
            <br />
            対戦記録が中止されました。
          </p>
          <div className={styles.actions}>
            <Button variant="primary" fullWidth onClick={handleDismiss}>
              OK
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  // pending（通常の招待）
  return (
    <Modal open={true} onClose={handleDecline} title="対戦の招待">
      <div className={styles.content}>
        <p className={styles.message}>
          <strong>{currentInvite.fromName}</strong> さんから
          <br />
          対戦の招待が届きました。参加しますか？
        </p>

        <div className={styles.timer}>
          <div className={styles.countdownCircle}>
            <span className={styles.countdownNumber}>{countdown}</span>
          </div>
          <span className={styles.timerLabel}>秒後に自動辞退</span>
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" fullWidth onClick={handleDecline}>
            辞退する
          </Button>
          <Button variant="primary" fullWidth onClick={handleAccept}>
            参加する
          </Button>
        </div>
      </div>
    </Modal>
  );
}
