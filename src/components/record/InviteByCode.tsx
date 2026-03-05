import { useState } from 'react';
import styles from './InviteByCode.module.css';

interface InviteByCodeProps {
  onSendInvite: (friendCode: string) => Promise<{ success: boolean; message: string }>;
}

export function InviteByCode({ onSendInvite }: InviteByCodeProps) {
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
    </div>
  );
}
