import { PageHeader } from '../../components/layout/PageHeader';
import styles from './PrivacyPolicyPage.module.css';

export function PrivacyPolicyPage() {
  return (
    <div>
      <PageHeader title="プライバシーポリシー" showBack />
      <div className={styles.container}>
        <p className={styles.updated}>最終更新日：2026年3月</p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>はじめに</h2>
          <p className={styles.body}>
            本アプリ（以下「当アプリ」）は、ボードゲームの対戦記録を管理するためのアプリです。
            当アプリのご利用にあたり、以下のプライバシーポリシーをご確認ください。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>収集する情報</h2>
          <p className={styles.body}>
            当アプリは、個人情報を一切収集しません。
            プレイヤー名・ゲーム記録・設定などのデータはすべてお使いのデバイス内にのみ保存され、
            外部サーバーへの送信は行いません。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>データの保存場所</h2>
          <p className={styles.body}>
            入力されたすべてのデータ（プレイヤー情報・対戦記録・ゲーム設定など）は、
            お使いのデバイスのローカルストレージにのみ保存されます。
            アプリを削除するとデータも削除されますのでご注意ください。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第三者への提供</h2>
          <p className={styles.body}>
            当アプリはいかなる第三者に対しても、利用者のデータを提供・販売・共有しません。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>広告・解析ツール</h2>
          <p className={styles.body}>
            当アプリは広告を表示しません。また、Google Analytics などの外部解析ツールも使用しておりません。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>外部サービスへのアクセス</h2>
          <p className={styles.body}>
            ルールブック画面の「YouTubeで解説動画を見る」リンクをタップした場合、
            YouTubeアプリまたはブラウザが起動します。その際の通信はYouTube（Google）の
            プライバシーポリシーに従います。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>ポリシーの変更</h2>
          <p className={styles.body}>
            本ポリシーは必要に応じて変更されることがあります。
            変更後はアプリのアップデートとともに反映されます。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>お問い合わせ</h2>
          <p className={styles.body}>
            本ポリシーに関するご質問は、App Store のサポートページよりお問い合わせください。
          </p>
        </section>
      </div>
    </div>
  );
}
