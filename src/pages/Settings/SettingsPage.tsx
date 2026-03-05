import { useState, useRef } from 'react';
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

const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB

const TABS = [
  { key: 'friends', label: 'フレンド' },
  { key: 'games', label: 'ゲーム' },
] as const;

type TabKey = typeof TABS[number]['key'];

export function SettingsPage() {
  const navigate = useNavigate();
  const { profile, signOut, saveProfile } = useAuth();
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

  // コピー通知
  const [copied, setCopied] = useState(false);

  // アカウント情報メニュー
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  // フレンドカードメニュー
  const [openFriendMenuId, setOpenFriendMenuId] = useState<string | null>(null);

  // プロフィール編集モーダル
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState<string | null>(null);
  const [editError, setEditError] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const editFileRef = useRef<HTMLInputElement>(null);

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

  // フレンドコードをコピー
  const handleCopyCode = async () => {
    if (!profile?.friendCode) return;
    try {
      await navigator.clipboard.writeText(profile.friendCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing
    }
  };

  // プロフィール編集を開く
  const openEditProfile = () => {
    setEditName(profile?.displayName ?? '');
    setEditAvatar(profile?.avatarBase64 ?? null);
    setEditError('');
    setShowAccountMenu(false);
    setShowEditProfile(true);
  };

  // アバター画像選択
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_AVATAR_SIZE) {
      setEditError('画像は2MB以下にしてください');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setEditAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  // プロフィール保存
  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      setEditError('名前を入力してください');
      return;
    }
    setEditError('');
    setEditSaving(true);
    try {
      await saveProfile({ displayName: editName.trim(), avatarBase64: editAvatar });
      setShowEditProfile(false);
    } catch {
      setEditError('保存に失敗しました');
    } finally {
      setEditSaving(false);
    }
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
              <div className={styles.accountHeader}>
                <p className={styles.sectionTitle}>アカウント情報</p>
                <div className={styles.menuWrapper}>
                  <button
                    className={styles.menuBtn}
                    onClick={() => setShowAccountMenu((v) => !v)}
                    aria-label="メニューを開く"
                  >
                    ···
                  </button>
                  {showAccountMenu && (
                    <div className={styles.overflowMenu}>
                      <button
                        className={styles.menuItem}
                        onClick={openEditProfile}
                      >
                        編集
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {showAccountMenu && (
                <div
                  className={styles.backdrop}
                  onClick={() => setShowAccountMenu(false)}
                />
              )}
              {profile && (
                <>
                  <div className={styles.myPlayerRow}>
                    <span className={styles.myPlayerName}>{profile.displayName}</span>
                  </div>
                  <div className={styles.myPlayerRow}>
                    <span className={styles.myPlayerHint}>フレンドコード</span>
                    <div className={styles.friendCodeRow}>
                      <span className={styles.myPlayerName}>{profile.friendCode}</span>
                      <button
                        className={styles.copyBtn}
                        onClick={handleCopyCode}
                        aria-label="フレンドコードをコピー"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      </button>
                      {copied && <span className={styles.copiedToast}>コピー!</span>}
                    </div>
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
                friends.map((friend) => {
                  const isMenuOpen = openFriendMenuId === friend.id;
                  return (
                    <div key={friend.id} className={friendStyles.friendCard}>
                      <div className={friendStyles.friendInfo}>
                        <div className={friendStyles.friendAvatar}>
                          {friend.avatarBase64
                            ? <img src={friend.avatarBase64} alt={friend.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                            : friend.name.charAt(0)
                          }
                        </div>
                        <span className={friendStyles.friendName}>{friend.name}</span>
                      </div>
                      <div className={friendStyles.friendMenuWrapper}>
                        <button
                          className={friendStyles.friendMenuBtn}
                          onClick={() => setOpenFriendMenuId(isMenuOpen ? null : friend.id)}
                          aria-label="メニューを開く"
                        >
                          ···
                        </button>
                        {isMenuOpen && (
                          <div className={friendStyles.friendOverflowMenu}>
                            <button
                              className={friendStyles.friendMenuItem}
                              onClick={() => {
                                setOpenFriendMenuId(null);
                                navigate(`/players/${friend.id}`);
                              }}
                            >
                              詳細
                            </button>
                            <button
                              className={`${friendStyles.friendMenuItem} ${friendStyles.friendMenuItemDanger}`}
                              onClick={() => {
                                setOpenFriendMenuId(null);
                                handleRemoveFriend(friend.friendDocId);
                              }}
                            >
                              削除
                            </button>
                          </div>
                        )}
                      </div>
                      {isMenuOpen && (
                        <div
                          className={friendStyles.friendBackdrop}
                          onClick={() => setOpenFriendMenuId(null)}
                        />
                      )}
                    </div>
                  );
                })
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

      {/* プロフィール編集モーダル */}
      <Modal open={showEditProfile} onClose={() => setShowEditProfile(false)} title="プロフィール編集">
        <div className={styles.editForm}>
          <div className={styles.avatarEdit}>
            <div className={styles.avatarPreview}>
              {editAvatar
                ? <img src={editAvatar} alt="avatar" />
                : profile?.displayName?.charAt(0) ?? '🎮'
              }
            </div>
            <button
              className={styles.avatarUploadBtn}
              type="button"
              onClick={() => editFileRef.current?.click()}
            >
              画像を変更
            </button>
            <input
              ref={editFileRef}
              type="file"
              accept="image/*"
              onChange={handleEditFileChange}
              style={{ display: 'none' }}
            />
          </div>

          <Input
            id="edit-name"
            label="表示名"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="名前を入力"
            maxLength={20}
          />

          {editError && <p className={styles.editError}>{editError}</p>}

          <Button fullWidth onClick={handleSaveProfile} disabled={editSaving}>
            {editSaving ? '保存中...' : '保存'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
