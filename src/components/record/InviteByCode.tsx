import { useState } from 'react';
import type { GameInvite } from '../../types';
import styles from './InviteByCode.module.css';

interface InviteByCodeProps {
  outgoingInvites: GameInvite[];
  onSendInvite: (friendCode: string) => Promise<{ success: boolean; message: string }>;
}

export function InviteByCode({ outgoingInvites, onSendInvite }: InviteByCodeProps) {
  const [friendCode, setFriendCode] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);

  const handleInvite = async () => {
    if (!friendCode.trim()) return;
    setSending(true);
    setMessage(null);
    const result = await onSendInvite(friendCode);
    setMessage({ text: result.message, success: result.success });
    if (result.success) setFriendCode('');
    setSending(false);
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '招待中...';
      case 'accepted': return '参加';
      case 'declined': return '辞退';
      default: return status;
    }
  };

  const statusClass = (status: string) => {
    switch (status) {
      case 'pending': return styles.statusPending;
      case 'accepted': return styles.statusAccepted;
      case 'declined': return styles.statusDeclined;
      default: return '';
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.label}>IDでプレイヤーを招待</p>
      <div className={styles.inputRow}>
        <input
          className={styles.codeInput}
          type="text"
          value={friendCode}
          onChange={(e) => setFriendCode(e.target.value)}
          placeholder="BGT-XXXXXX"
          maxLength={10}
        />
        <button
          className={styles.inviteBtn}
          onClick={handleInvite}
          disabled={sending || !friendCode.trim()}
        >
          {sending ? '送信中...' : '招待'}
        </button>
      </div>
      {message && (
        <p className={`${styles.message} ${message.success ? styles.messageSuccess : styles.messageError}`}>
          {message.text}
        </p>
      )}

      {/* 送信済み招待のステータス一覧（拒否は非表示） */}
      {outgoingInvites.filter((inv) => inv.status !== 'declined').length > 0 && (
        <div className={styles.inviteList}>
          {outgoingInvites
            .filter((inv) => inv.status !== 'declined')
            .map((inv) => (
              <div key={inv.id} className={styles.inviteItem}>
                <span className={styles.inviteName}>{inv.toName}</span>
                <span className={`${styles.inviteStatus} ${statusClass(inv.status)}`}>
                  {statusLabel(inv.status)}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
