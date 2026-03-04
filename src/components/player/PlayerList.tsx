import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { PlayerForm } from './PlayerForm';
import { EmptyState } from '../ui/EmptyState';
import styles from './PlayerList.module.css';
import type { Player } from '../../types';

interface PlayerListProps {
  players: Player[];
  currentPlayerId?: string | null;
  onSetAsMe?: (id: string) => void;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  getAvatar?: (playerId: string) => string | null;
  onSetAvatar?: (playerId: string, base64: string | null) => void;
}

export function PlayerList({
  players,
  currentPlayerId,
  onSetAsMe,
  onUpdate,
  onDelete,
  getAvatar,
  onSetAvatar,
}: PlayerListProps) {
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (players.length === 0) {
    return <EmptyState message="プレイヤーがいません" description="下のボタンから追加してください" />;
  }

  return (
    <>
      {openMenuId && (
        <div
          className={styles.backdrop}
          onClick={() => setOpenMenuId(null)}
        />
      )}

      <ul className={styles.list}>
        {players.map((player) => {
          const avatarSrc = getAvatar ? getAvatar(player.id) : null;
          const initial = player.name.charAt(0).toUpperCase();
          const isMenuOpen = openMenuId === player.id;

          return (
            <li key={player.id} className={styles.item}>
              {/* 左側: アバター + 名前エリア */}
              <div className={styles.itemLeft}>
                <div className={styles.avatar}>
                  {avatarSrc ? (
                    <img src={avatarSrc} alt={player.name} className={styles.avatarImg} />
                  ) : (
                    <span className={styles.avatarInitial}>{initial}</span>
                  )}
                </div>
                <div className={styles.nameArea}>
                  <span className={styles.name}>{player.name}</span>
                  {currentPlayerId === player.id && (
                    <span className={styles.meBadge}>自分</span>
                  )}
                </div>
              </div>

              {/* 右側: Ellipsis ボタン + Overflow Menu */}
              <div className={styles.menuWrapper}>
                <button
                  className={styles.menuBtn}
                  onClick={() => setOpenMenuId(isMenuOpen ? null : player.id)}
                  aria-label="メニューを開く"
                >
                  ···
                </button>

                {isMenuOpen && (
                  <div className={styles.overflowMenu}>
                    {onSetAsMe && currentPlayerId !== player.id && (
                      <button
                        className={styles.menuItem}
                        onClick={() => {
                          onSetAsMe(player.id);
                          setOpenMenuId(null);
                        }}
                      >
                        自分として設定
                      </button>
                    )}
                    <button
                      className={styles.menuItem}
                      onClick={() => {
                        setEditingPlayer(player);
                        setOpenMenuId(null);
                      }}
                    >
                      編集
                    </button>
                    <button
                      className={`${styles.menuItem} ${styles.menuItemDanger}`}
                      onClick={() => {
                        setOpenMenuId(null);
                        if (confirm(`「${player.name}」を削除しますか？`)) {
                          onDelete(player.id);
                        }
                      }}
                    >
                      削除
                    </button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <Modal
        open={!!editingPlayer}
        onClose={() => setEditingPlayer(null)}
        title="プレイヤーを編集"
      >
        {editingPlayer && (
          <PlayerForm
            initialName={editingPlayer.name}
            initialAvatarSrc={getAvatar ? getAvatar(editingPlayer.id) : null}
            submitLabel="保存"
            onSubmit={(name, avatarBase64) => {
              onUpdate(editingPlayer.id, name);
              if (avatarBase64 !== undefined && onSetAvatar) {
                onSetAvatar(editingPlayer.id, avatarBase64);
              }
              setEditingPlayer(null);
            }}
            onCancel={() => setEditingPlayer(null)}
          />
        )}
      </Modal>
    </>
  );
}
