import { useState, useRef, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import styles from './ProfileSetupPage.module.css';

const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB

export function ProfileSetupPage() {
  const { user, loading, profile, saveProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Not logged in → go to login
  if (!loading && !user) return <Navigate to="/login" replace />;
  // Already has profile → go to dashboard
  if (!loading && profile) return <Navigate to="/" replace />;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_AVATAR_SIZE) {
      setError('画像は2MB以下にしてください');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatarBase64(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError('名前を入力してください');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await saveProfile({ displayName: displayName.trim(), avatarBase64 });
    } catch {
      setError('保存に失敗しました。もう一度お試しください');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p style={{ color: 'var(--color-text-muted)' }}>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>プロフィール設定</h1>
      <p className={styles.subtitle}>名前とアイコンを登録して始めましょう</p>

      <div className={styles.card}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarPreview}>
            {avatarBase64
              ? <img src={avatarBase64} alt="avatar" />
              : '🎮'
            }
          </div>
          <button
            className={styles.avatarUploadBtn}
            type="button"
            onClick={() => fileRef.current?.click()}
          >
            画像を選択
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>表示名</label>
            <input
              className={styles.input}
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="ボドゲ太郎"
              required
              maxLength={20}
              autoFocus
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <Button variant="primary" fullWidth type="submit" disabled={submitting}>
            {submitting ? '保存中...' : 'はじめる'}
          </Button>
        </form>
      </div>
    </div>
  );
}
