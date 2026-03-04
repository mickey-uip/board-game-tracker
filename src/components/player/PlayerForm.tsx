import { useState, useRef } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import styles from './PlayerForm.module.css';

interface PlayerFormProps {
  initialName?: string;
  /** 編集時に渡す現在のアバター画像（base64 or null） */
  initialAvatarSrc?: string | null;
  /**
   * avatarBase64:
   *   string    → 新しい画像を設定
   *   null      → 画像を削除
   *   undefined → 変更なし（既存を維持）
   */
  onSubmit: (name: string, avatarBase64: string | null | undefined) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB

export function PlayerForm({
  initialName = '',
  initialAvatarSrc = null,
  onSubmit,
  onCancel,
  submitLabel = '追加',
}: PlayerFormProps) {
  const [name, setName] = useState(initialName);
  /**
   * avatarState:
   *   { changed: false }                   → 未変更
   *   { changed: true, value: string }     → 新画像
   *   { changed: true, value: null }       → 削除
   */
  const [avatarState, setAvatarState] = useState<
    { changed: false } | { changed: true; value: string | null }
  >({ changed: false });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 現在プレビューに表示する src
  const previewSrc = avatarState.changed
    ? avatarState.value
    : initialAvatarSrc;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      alert('画像のファイルサイズが大きすぎます。\n2MB以下の画像を選択してください。');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarState({ changed: true, value: reader.result as string });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveAvatar = () => {
    setAvatarState({ changed: true, value: null });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const avatarArg = avatarState.changed ? avatarState.value : undefined;
    onSubmit(name.trim(), avatarArg);
  };

  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* アバター設定エリア */}
      <div className={styles.avatarSection}>
        <p className={styles.avatarLabel}>プロフィール画像（任意）</p>
        <div className={styles.avatarRow}>
          {/* プレビュー */}
          <div className={styles.avatarPreview}>
            {previewSrc ? (
              <img src={previewSrc} alt="プレビュー" className={styles.avatarImg} />
            ) : (
              <span className={styles.avatarInitial}>{initial}</span>
            )}
          </div>
          {/* ボタン群 */}
          <div className={styles.avatarActions}>
            <button
              type="button"
              className={styles.avatarBtn}
              onClick={() => fileInputRef.current?.click()}
            >
              {previewSrc ? '変更' : '選択'}
            </button>
            {previewSrc && (
              <button
                type="button"
                className={`${styles.avatarBtn} ${styles.avatarBtnDanger}`}
                onClick={handleRemoveAvatar}
              >
                削除
              </button>
            )}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className={styles.hiddenInput}
          onChange={handleFileChange}
        />
      </div>

      <Input
        label="プレイヤー名"
        id="player-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="名前を入力"
        autoFocus
      />
      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          キャンセル
        </Button>
        <Button type="submit" disabled={!name.trim()}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
