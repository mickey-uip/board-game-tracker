import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { TabBar } from '../../components/ui/TabBar';
import { GameList } from '../../components/game/GameList';
import { GameForm } from '../../components/game/GameForm';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useGames } from '../../hooks/useGames';
import { useGameImages } from '../../hooks/useGameImages';
import { useGameFavorites } from '../../hooks/useGameFavorites';
import { useFriends } from '../../hooks/useFriends';
import { useFriendRequests } from '../../hooks/useFriendRequests';
import styles from './SettingsPage.module.css';
import friendStyles from '../Friends/FriendsPage.module.css';
import type { Genre } from '../../types';

const TABS = [
  { key: 'friends', label: 'フレンド' },
  { key: 'games', label: 'ゲーム' },
] as const;

type TabKey = typeof TABS[number]['key'];

export function SettingsPage() {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const { games, addGame, deleteGame } = useGames();
  const { getGameImage, setGameImage } = useGameImages();
  const { isFavorite, toggleFavorite } = useGameFavorites();
  const { friends, removeFriend } = useFriends();
  const {
    incomingRequests,
    outgoingRequests,
    sendRequest,
    acceptRequest,
    rejectRequest,
  } = useFriendRequests();

  const [activeTab, setActiveTab] = useState<TabKey>('friends');
  const [showGameForm, setShowGameForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // フレンド検索用state
  const [friendCode, setFriendCode] = useState('');
  const [searchMessage, setSearchMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [sending, setSending] = useState(false);

  const filteredGames = searchQuery.trim()
    ? games.filter((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : games;

  const handleAddGame = (name: string, genres: Genre[], imageBase64: string | null) => {
    const newGame = addGame(name, genres);
    if (imageBase64) setGameImage(newGame.id, imageBase64);
    setShowGameForm(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // フレンド検索
  const handleFriendSearch = async () => {
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
      <PageHeader title="設定" />
      <TabBar
        tabs={[...TABS]}
        activeTab={activeTab}
        onChange={(key) => setActiveTab(key as TabKey)}
      />
      <div className={styles.container}>
        {activeTab === 'friends' && (
          <section className={styles.section}>
            {/* アカウント情報 */}
            <div className={styles.myPlayerSection}>
              <p className={styles.sectionTitle}>アカウント情報</p>
              {profile && (
                <>
                  <div className={styles.myPlayerRow}>
                    <span className={styles.myPlayerName}>{profile.displayName}</span>
                  </div>
                  <div className={styles.myPlayerRow}>
                    <span className={styles.myPlayerHint}>フレンドコード</span>
                    <span className={styles.myPlayerName}>{profile.friendCode}</span>
                  </div>
                </>
              )}
            </div>

            {/* フレンドを追加 */}
            <div className={friendStyles.searchSection}>
              <p className={friendStyles.sectionTitle}>フレンドを追加</p>
              <div className={friendStyles.searchRow}>
                <input
                  className={friendStyles.searchInput}
                  type="text"
                  value={friendCode}
                  onChange={(e) => setFriendCode(e.target.value)}
                  placeholder="フレンドコードを入力"
                  maxLength={10}
                />
                <button
                  className={friendStyles.searchBtn}
                  onClick={handleFriendSearch}
                  disabled={sending || !friendCode.trim()}
                >
                  {sending ? '送信中...' : '検索'}
                </button>
              </div>
              {searchMessage && (
                <p className={`${friendStyles.searchMessage} ${searchMessage.success ? friendStyles.searchSuccess : friendStyles.searchError}`}>
                  {searchMessage.text}
                </p>
              )}
            </div>

            {/* 受信リクエスト */}
            {incomingRequests.length > 0 && (
              <div className={friendStyles.section}>
                <p className={friendStyles.sectionTitle}>フレンドリクエスト</p>
                {incomingRequests.map((req) => (
                  <div key={req.id} className={friendStyles.requestCard}>
                    <span className={friendStyles.requestName}>{req.fromName}</span>
                    <div className={friendStyles.requestActions}>
                      <button
                        className={friendStyles.acceptBtn}
                        onClick={() => handleAccept(req.id, req.fromUid)}
                      >
                        承認
                      </button>
                      <button
                        className={friendStyles.rejectBtn}
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
              <div className={friendStyles.section}>
                <p className={friendStyles.sectionTitle}>送信中のリクエスト</p>
                {outgoingRequests.map((req) => (
                  <div key={req.id} className={friendStyles.requestCard}>
                    <span className={friendStyles.requestName}>{req.fromName}</span>
                    <span className={friendStyles.pendingLabel}>承認待ち</span>
                  </div>
                ))}
              </div>
            )}

            {/* フレンドリスト */}
            <div className={friendStyles.section}>
              <p className={friendStyles.sectionTitle}>フレンド一覧（{friends.length}人）</p>
              {friends.length === 0 ? (
                <p className={friendStyles.emptyText}>
                  フレンドコードを交換してフレンドを追加しよう
                </p>
              ) : (
                friends.map((friend) => (
                  <div key={friend.id} className={friendStyles.friendCard}>
                    <div className={friendStyles.friendInfo}>
                      <div className={friendStyles.friendAvatar}>
                        {friend.name.charAt(0)}
                      </div>
                      <span className={friendStyles.friendName}>{friend.name}</span>
                    </div>
                    <button
                      className={friendStyles.removeBtn}
                      onClick={() => handleRemoveFriend(friend.friendDocId)}
                    >
                      削除
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
        {activeTab === 'games' && (
          <section className={styles.section}>
            <Button variant="primary" fullWidth onClick={() => setShowGameForm(true)}>
              + ゲームを追加
            </Button>

            <div className={styles.searchWrapper}>
              <Input
                id="game-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ゲームを検索..."
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.searchClear}
                  onClick={() => setSearchQuery('')}
                  aria-label="検索をクリア"
                >
                  ✕
                </button>
              )}
            </div>

            <GameList
              games={filteredGames}
              onDelete={deleteGame}
              getGameImage={getGameImage}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
          </section>
        )}
      </div>

      <div className={styles.appInfo}>
        <p className={styles.appInfoTitle}>アプリ情報</p>
        <button
          className={styles.appInfoLink}
          onClick={handleSignOut}
        >
          <span>ログアウト</span>
          <span className={styles.appInfoArrow}>›</span>
        </button>
        <button
          className={styles.appInfoLink}
          onClick={() => navigate('/privacy-policy')}
        >
          <span>プライバシーポリシー</span>
          <span className={styles.appInfoArrow}>›</span>
        </button>
      </div>

      <Modal open={showGameForm} onClose={() => setShowGameForm(false)} title="ゲームを追加">
        <GameForm onSubmit={handleAddGame} onCancel={() => setShowGameForm(false)} />
      </Modal>
    </div>
  );
}
