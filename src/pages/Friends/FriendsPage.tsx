import { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useFriends } from '../../hooks/useFriends';
import { useFriendRequests } from '../../hooks/useFriendRequests';
import styles from './FriendsPage.module.css';

export function FriendsPage() {
  const { profile } = useAuth();
  const { friends, removeFriend } = useFriends();
  const {
    incomingRequests,
    outgoingRequests,
    sendRequest,
    acceptRequest,
    rejectRequest,
  } = useFriendRequests();

  const [friendCode, setFriendCode] = useState('');
  const [searchMessage, setSearchMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [sending, setSending] = useState(false);

  const handleSearch = async () => {
    if (!friendCode.trim()) return;
    setSending(true);
    setSearchMessage(null);
    const result = await sendRequest(friendCode);
    setSearchMessage({ text: result.message, success: result.success });
    if (result.success) setFriendCode('');
    setSending(false);
  };

  const handleAccept = async (requestId: string, fromUid: string) => {
    await acceptRequest(requestId, fromUid);
  };

  const handleReject = async (requestId: string) => {
    await rejectRequest(requestId);
  };

  const handleRemoveFriend = async (friendDocId: string) => {
    if (confirm('このフレンドを削除しますか？')) {
      await removeFriend(friendDocId);
    }
  };

  return (
    <div>
      <PageHeader title="フレンド" />
      <div className={styles.container}>
        {/* 自分のフレンドコード */}
        {profile && (
          <div className={styles.myCode}>
            <span className={styles.myCodeLabel}>あなたのフレンドコード</span>
            <span className={styles.myCodeValue}>{profile.friendCode}</span>
          </div>
        )}

        {/* フレンドコード検索 */}
        <div className={styles.searchSection}>
          <p className={styles.sectionTitle}>フレンドを追加</p>
          <div className={styles.searchRow}>
            <input
              className={styles.searchInput}
              type="text"
              value={friendCode}
              onChange={(e) => setFriendCode(e.target.value)}
              placeholder="フレンドコードを入力"
              maxLength={10}
            />
            <button
              className={styles.searchBtn}
              onClick={handleSearch}
              disabled={sending || !friendCode.trim()}
            >
              {sending ? '送信中...' : '検索'}
            </button>
          </div>
          {searchMessage && (
            <p className={`${styles.searchMessage} ${searchMessage.success ? styles.searchSuccess : styles.searchError}`}>
              {searchMessage.text}
            </p>
          )}
        </div>

        {/* 受信リクエスト */}
        {incomingRequests.length > 0 && (
          <div className={styles.section}>
            <p className={styles.sectionTitle}>フレンドリクエスト</p>
            {incomingRequests.map((req) => (
              <div key={req.id} className={styles.requestCard}>
                <span className={styles.requestName}>{req.fromName}</span>
                <div className={styles.requestActions}>
                  <button
                    className={styles.acceptBtn}
                    onClick={() => handleAccept(req.id, req.fromUid)}
                  >
                    承認
                  </button>
                  <button
                    className={styles.rejectBtn}
                    onClick={() => handleReject(req.id)}
                  >
                    拒否
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 送信中リクエスト */}
        {outgoingRequests.length > 0 && (
          <div className={styles.section}>
            <p className={styles.sectionTitle}>送信中のリクエスト</p>
            {outgoingRequests.map((req) => (
              <div key={req.id} className={styles.requestCard}>
                <span className={styles.requestName}>{req.fromName}</span>
                <span className={styles.pendingLabel}>承認待ち</span>
              </div>
            ))}
          </div>
        )}

        {/* フレンドリスト */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>フレンド一覧（{friends.length}人）</p>
          {friends.length === 0 ? (
            <p className={styles.emptyText}>
              フレンドコードを交換してフレンドを追加しよう
            </p>
          ) : (
            friends.map((friend) => (
              <div key={friend.id} className={styles.friendCard}>
                <div className={styles.friendInfo}>
                  <div className={styles.friendAvatar}>
                    {friend.name.charAt(0)}
                  </div>
                  <span className={styles.friendName}>{friend.name}</span>
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemoveFriend(friend.friendDocId)}
                >
                  削除
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
