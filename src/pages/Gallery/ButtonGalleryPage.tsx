import styles from './ButtonGalleryPage.module.css';

export function ButtonGalleryPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Button Gallery</h1>

      {/* ── 現在のスタイル ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Current（現在）</h2>
        <p className={styles.sectionDesc}>
          現在のプライマリボタン — シンプルなグラデーション
        </p>

        <div className={styles.rowLabel}>サイズ: sm / md / lg</div>
        <div className={styles.row}>
          <button className={`${styles.currentBtn} ${styles.sm}`}>Small</button>
          <button className={`${styles.currentBtn} ${styles.md}`}>Medium</button>
          <button className={`${styles.currentBtn} ${styles.lg}`}>Large</button>
        </div>

        <div className={styles.rowLabel}>fullWidth</div>
        <button className={`${styles.currentBtn} ${styles.md} ${styles.fullWidth}`}>
          記録する
        </button>
      </section>

      {/* ── Pattern 1: Glow ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Pattern 1: Glow（グロー効果）</h2>
        <p className={styles.sectionDesc}>
          ゴールドの発光 + グラデーションスライドアニメーション
        </p>

        <div className={styles.rowLabel}>サイズ: sm / md / lg</div>
        <div className={styles.row}>
          <button className={`${styles.glowBtn} ${styles.sm}`}>Small</button>
          <button className={`${styles.glowBtn} ${styles.md}`}>Medium</button>
          <button className={`${styles.glowBtn} ${styles.lg}`}>Large</button>
        </div>

        <div className={styles.rowLabel}>fullWidth</div>
        <button className={`${styles.glowBtn} ${styles.md} ${styles.fullWidth}`}>
          記録する
        </button>
      </section>

      {/* ── Pattern 2: Layered ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Pattern 2: Layered（二重レイヤー）</h2>
        <p className={styles.sectionDesc}>
          外枠と内側の二重グラデーション + プレス感
        </p>

        <div className={styles.rowLabel}>サイズ: sm / md / lg</div>
        <div className={styles.row}>
          <button className={styles.layeredWrap}>
            <span className={`${styles.layeredInner} ${styles.smInner}`}>
              Small
            </span>
          </button>
          <button className={styles.layeredWrap}>
            <span className={`${styles.layeredInner} ${styles.mdInner}`}>Medium</span>
          </button>
          <button className={styles.layeredWrap}>
            <span className={`${styles.layeredInner} ${styles.lgInner}`}>
              Large
            </span>
          </button>
        </div>

        <div className={styles.rowLabel}>fullWidth</div>
        <button className={`${styles.layeredWrap} ${styles.fullWidthWrap}`}>
          <span className={`${styles.layeredInner} ${styles.fullWidthInner}`}>
            記録する
          </span>
        </button>
      </section>

      {/* ── Pattern 3: Depth ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Pattern 3: Depth（立体感）</h2>
        <p className={styles.sectionDesc}>
          立体的な外枠 + 内側グラデーション + 押し込みエフェクト
        </p>

        <div className={styles.rowLabel}>サイズ: sm / md / lg</div>
        <div className={styles.row}>
          <div className={styles.depthOuter}>
            <button className={styles.depthBtn}>
              <span className={`${styles.depthInner} ${styles.smInner}`}>
                Small
              </span>
            </button>
          </div>
          <div className={styles.depthOuter}>
            <button className={styles.depthBtn}>
              <span className={`${styles.depthInner} ${styles.mdInner}`}>Medium</span>
            </button>
          </div>
          <div className={styles.depthOuter}>
            <button className={styles.depthBtn}>
              <span className={`${styles.depthInner} ${styles.lgInner}`}>
                Large
              </span>
            </button>
          </div>
        </div>

        <div className={styles.rowLabel}>fullWidth</div>
        <div className={`${styles.depthOuter} ${styles.fullWidth}`}>
          <button className={`${styles.depthBtn} ${styles.fullWidth}`}>
            <span className={`${styles.depthInner} ${styles.fullWidthInner}`}>
              記録する
            </span>
          </button>
        </div>
      </section>
      {/* ── Pattern 4: Border Frame ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Pattern 4: Border Frame（枠グラデーション）</h2>
        <p className={styles.sectionDesc}>
          ゴールド枠のグラデーションスライド + ダーク内側
        </p>

        <div className={styles.rowLabel}>サイズ: sm / md / lg</div>
        <div className={styles.row}>
          <button className={`${styles.frameBtn} ${styles.sm}`}>
            <span className={styles.frameBtnText}>Small</span>
          </button>
          <button className={`${styles.frameBtn} ${styles.md}`}>
            <span className={styles.frameBtnText}>Medium</span>
          </button>
          <button className={`${styles.frameBtn} ${styles.lg}`}>
            <span className={styles.frameBtnText}>Large</span>
          </button>
        </div>

        <div className={styles.rowLabel}>fullWidth</div>
        <button className={`${styles.frameBtn} ${styles.md} ${styles.fullWidth}`}>
          <span className={styles.frameBtnText}>記録する</span>
        </button>
      </section>

      {/* ── Pattern 5: Slide Text ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Pattern 5: Slide Text（テキストスライド）</h2>
        <p className={styles.sectionDesc}>
          ホバー時にテキストが下から上へスライドするアニメーション
        </p>

        <div className={styles.rowLabel}>サイズ: sm / md / lg</div>
        <div className={styles.row}>
          <button className={`${styles.slideBtn} ${styles.sm}`}>
            <div className={styles.slideTextWrap}>
              <span className={styles.slideText}>Small</span>
              <span className={styles.slideTextClone}>Small</span>
            </div>
          </button>
          <button className={`${styles.slideBtn} ${styles.md}`}>
            <div className={styles.slideTextWrap}>
              <span className={styles.slideText}>Medium</span>
              <span className={styles.slideTextClone}>Medium</span>
            </div>
          </button>
          <button className={`${styles.slideBtn} ${styles.lg}`}>
            <div className={styles.slideTextWrap}>
              <span className={styles.slideText}>Large</span>
              <span className={styles.slideTextClone}>Large</span>
            </div>
          </button>
        </div>

        <div className={styles.rowLabel}>fullWidth</div>
        <button className={`${styles.slideBtn} ${styles.md} ${styles.fullWidth}`}>
          <div className={styles.slideTextWrap}>
            <span className={styles.slideText}>記録する</span>
            <span className={styles.slideTextClone}>記録する</span>
          </div>
        </button>
      </section>

      {/* ── Pattern 6: Pill Glow ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Pattern 6: Pill Glow（ピル型グロー）</h2>
        <p className={styles.sectionDesc}>
          丸角ピル型 + ゴールドボーダー + グロー発光
        </p>

        <div className={styles.rowLabel}>サイズ: sm / md / lg</div>
        <div className={styles.row}>
          <button className={`${styles.pillBtn} ${styles.sm}`}>Small</button>
          <button className={`${styles.pillBtn} ${styles.md}`}>Medium</button>
          <button className={`${styles.pillBtn} ${styles.lg}`}>Large</button>
        </div>

        <div className={styles.rowLabel}>fullWidth</div>
        <button className={`${styles.pillBtn} ${styles.md} ${styles.fullWidth}`}>
          記録する
        </button>
      </section>

      {/* ── Pattern 7: Glossy 3D ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Pattern 7: Glossy 3D（グロッシー立体）</h2>
        <p className={styles.sectionDesc}>
          多層構造の3D光沢ボタン + ホバーで浮き上がり + 押し込み
        </p>

        <div className={styles.rowLabel}>サイズ: sm / md / lg</div>
        <div className={styles.row}>
          <div className={`${styles.glossyWrap} ${styles.glossySm}`}>
            <button className={styles.glossyBtn}>
              <span className={styles.glossyBtnText}>Small</span>
            </button>
          </div>
          <div className={`${styles.glossyWrap} ${styles.glossyMd}`}>
            <button className={styles.glossyBtn}>
              <span className={styles.glossyBtnText}>Medium</span>
            </button>
          </div>
          <div className={`${styles.glossyWrap} ${styles.glossyLg}`}>
            <button className={styles.glossyBtn}>
              <span className={styles.glossyBtnText}>Large</span>
            </button>
          </div>
        </div>

        <div className={styles.rowLabel}>fullWidth</div>
        <div className={`${styles.glossyWrap} ${styles.glossyMd} ${styles.glossyFull}`}>
          <button className={styles.glossyBtn}>
            <span className={styles.glossyBtnText}>記録する</span>
          </button>
        </div>
      </section>
    </div>
  );
}
