import { useState, useEffect, useRef, useCallback } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useGameInvites } from '../../hooks/useGameInvites';
import styles from './InviteDialog.module.css';

/**
 * グローバル招待ダイアログ（受信側）
 * AppShell に配置し、どの画面でも招待を受け取れるようにする
 * 10秒のカウントダウン後に自動辞退
 */
export function InviteDialog() {
  const { incomingInvites, acceptInvite, declineInvite } = useGameInvites();
  const [countdown, setCountdown] = useState(10);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentInviteIdRef = useRef<string | null>(null);

  // 最初の pending 招待を表示
  const currentInvite = incomingInvites[0] ?? null;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 新しい招待が来たらタイマーを開始
  useEffect(() => {
    if (!currentInvite) {
      clearTimer();
      currentInviteIdRef.current = null;
      return;
    }

    // 同じ招待なら何もしない
    if (currentInviteIdRef.current === currentInvite.id) return;

    // 新しい招待 → タイマーリセット
    currentInviteIdRef.current = currentInvite.id;
    setCountdown(10);
    clearTimer();

    const inviteId = currentInvite.id;
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // タイムアウト → 自動辞退
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
