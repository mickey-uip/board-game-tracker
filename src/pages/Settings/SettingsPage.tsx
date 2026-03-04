import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { TabBar } from '../../components/ui/TabBar';
import { PlayerList } from '../../components/player/PlayerList';
import { PlayerForm } from '../../components/player/PlayerForm';
import { GameList } from '../../components/game/GameList';
import { GameForm } from '../../components/game/GameForm';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { usePlayers } from '../../hooks/usePlayers';
import { useGames } from '../../hooks/useGames';
import { useCurrentPlayer } from '../../hooks/useCurrentPlayer';
import { usePlayerAvatars } from '../../hooks/usePlayerAvatars';
import { useGameImages } from '../../hooks/useGameImages';
import { useGameFavorites } from '../../hooks/useGameFavorites';
import styles from './SettingsPage.module.css';
import type { Genre } from '../../types';

const TABS = [
  { key: 'players', label: 'プレイヤー' },
  { key: 'games', label: 'ゲーム' },
] as const;

type TabKey = typeof TABS[number]['key'];

export function SettingsPage() {
  const navigate = useNavigate();
  const { players, addPlayer, updatePlayer, deletePlayer } = usePlayers();
  const { games, addGame, deleteGame } = useGames();
  const { currentPlayerId, currentPlayer, setCurrentPlayerId, clearCurrentPlayer } = useCurrentPlayer();
  const { getAvatar, setAvatar } = usePlayerAvatars();
  const { getGameImage, setGameImage } = useGameImages();
  const { isFavorite, toggleFavorite } = useGameFavorites();
  const [activeTab, setActiveTab] = useState<TabKey>('players');
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [showGameForm, setShowGameForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = searchQuery.trim()
    ? games.filter((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : games;

  const handleAddPlayer = (name: string, avatarBase64: string | null | undefined) => {
    const newPlayer = addPlayer(name);
    if (avatarBase64 != null) setAvatar(newPlayer.id, avatarBase64);
    setShowPlayerForm(false);
  };

  const handleAddGame = (name: string, genres: Genre[], imageBase64: string | null) => {
    const newGame = addGame(name, genres);
    if (imageBase64) setGameImage(newGame.id, imageBase64);
    setShowGameForm(false);
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
        {activeTab === 'players' && (
          <section className={styles.section}>
            {/* 自分のプレイヤー設定セクション */}
            <div className={styles.myPlayerSection}>
              <p className={styles.sectionTitle}>自分のプレイヤー</p>
              {currentPlayer ? (
                <div className={styles.myPlayerRow}>
                  <span className={styles.myPlayerName}>{currentPlayer.name}</span>
                  <button className={styles.clearBtn} onClick={clearCurrentPlayer}>
                    解除
                  </button>
                </div>
              ) : (
                <p className={styles.myPlayerHint}>
                  下のリストから「自分として設定」を選んでください
                </p>
              )}

            </div>

            <Button variant="primary" fullWidth onClick={() => setShowPlayerForm(true)}>
              + プレイヤーを追加
            </Button>
            <PlayerList
              players={players}
              currentPlayerId={currentPlayerId}
              onSetAsMe={setCurrentPlayerId}
              onUpdate={updatePlayer}
              onDelete={deletePlayer}
              getAvatar={getAvatar}
              onSetAvatar={setAvatar}
            />
          </section>
        )}
        {activeTab === 'games' && (
          <section className={styles.section}>
            <Button variant="primary" fullWidth onClick={() => setShowGameForm(true)}>
              + ゲームを追加
            </Button>

            {/* 検索欄 */}
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

      {/* アプリ情報 */}
      <div className={styles.appInfo}>
        <p className={styles.appInfoTitle}>アプリ情報</p>
        <button
          className={styles.appInfoLink}
          onClick={() => navigate('/privacy-policy')}
        >
          <span>プライバシーポリシー</span>
          <span className={styles.appInfoArrow}>›</span>
        </button>
      </div>

      <Modal open={showPlayerForm} onClose={() => setShowPlayerForm(false)} title="プレイヤーを追加">
        <PlayerForm
          onSubmit={handleAddPlayer}
          onCancel={() => setShowPlayerForm(false)}
        />
      </Modal>

      <Modal open={showGameForm} onClose={() => setShowGameForm(false)} title="ゲームを追加">
        <GameForm onSubmit={handleAddGame} onCancel={() => setShowGameForm(false)} />
      </Modal>
    </div>
  );
}
