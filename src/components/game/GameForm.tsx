import { useState, useRef } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { GENRES } from '../../constants/genres';
import styles from './GameForm.module.css';
import type { Genre } from '../../types';

interface GameFormProps {
  onSubmit: (name: string, genres: Genre[], imageBase64: string | null) => void;
  onCancel: () => void;
}

export function GameForm({ onSubmit, onCancel }: GameFormProps) {
  const [name, setName] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const toggleGenre = (genre: Genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_IMAGE_BYTES) {
      alert('画像のファイルサイズが大きすぎます。\n2MB以下の画像を選択してください。');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageBase64(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && selectedGenres.length > 0) {
      onSubmit(name.trim(), selectedGenres, imageBase64);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        label="ゲーム名"
        id="game-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="ゲーム名を入力"
        autoFocus
      />

      {/* 画像アップロード */}
      <div className={styles.imageSection}>
        <p className={styles.genreLabel}>ゲーム画像（任意）</p>
        <div className={styles.imageUpload}>
          {imageBase64 ? (
            <img src={imageBase64} alt="プレビュー" className={styles.imagePreview} />
          ) : (
            <div className={styles.imagePlaceholder}>未設定</div>
          )}
          <div className={styles.imageActions}>
            <button
              type="button"
              className={styles.imageBtn}
              onClick={() => imageInputRef.current?.click()}
            >
              {imageBase64 ? '変更' : '選択'}
            </button>
            {imageBase64 && (
              <button
                type="button"
                className={`${styles.imageBtn} ${styles.imageBtnDanger}`}
                onClick={() => setImageBase64(null)}
              >
                削除
              </button>
            )}
          </div>
        </div>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className={styles.hiddenInput}
          onChange={handleImageChange}
        />
      </div>

      <div className={styles.genreSection}>
        <p className={styles.genreLabel}>ジャンル（1つ以上選択）</p>
        <div className={styles.genreGrid}>
          {GENRES.map(({ value, label }) => (
            <label key={value} className={styles.genreItem}>
              <input
                type="checkbox"
                checked={selectedGenres.includes(value)}
                onChange={() => toggleGenre(value)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          キャンセル
        </Button>
        <Button type="submit" disabled={!name.trim() || selectedGenres.length === 0}>
          追加
        </Button>
      </div>
    </form>
  );
}
