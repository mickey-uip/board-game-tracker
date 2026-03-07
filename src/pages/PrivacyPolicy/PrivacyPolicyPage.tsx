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
            本アプリ「ボドゲレコード」（以下「当アプリ」）は、ボードゲームの対戦記録を管理するためのアプリです。
            当アプリのご利用にあたり、以下のプライバシーポリシーをご確認ください。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>収集する情報</h2>
          <p className={styles.body}>
            当アプリでは、サービス提供のために以下の情報を収集・保存します。
          </p>
          <ul className={styles.list}>
            <li>アカウント情報（メールアドレス、またはGoogleアカウントの認証情報）</li>
            <li>プロフィール情報（表示名、アバター画像）</li>
            <li>対戦記録（ゲーム名、対戦日、参加プレイヤー、順位）</li>
            <li>フレンド関係（フレンドコード、フレンドリクエスト）</li>
            <li>ゲーム招待情報</li>
          </ul>
          <p className={styles.body}>
            また、ゲーム設定やお気に入り情報など一部のデータは、お使いのデバイスのローカルストレージにも保存されます。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>データの保存場所</h2>
          <p className={styles.body}>
            収集した情報は、Google が提供するクラウドサービス「Firebase」のサーバー上に安全に保存されます。
            Firebase は Google Cloud のインフラを使用しており、業界標準のセキュリティ対策が施されています。
            一部のデータ（ゲーム設定、画像キャッシュ等）はお使いのデバイスのローカルストレージにも保存されます。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>データの利用目的</h2>
          <p className={styles.body}>
            収集した情報は、以下の目的でのみ使用します。
          </p>
          <ul className={styles.list}>
            <li>対戦記録の保存・表示・統計分析（勝率、タイプ診断等）</li>
            <li>フレンド機能の提供（フレンド検索・追加・招待）</li>
            <li>アカウント管理・認証</li>
          </ul>
          <p className={styles.body}>
            広告配信、マーケティング、プロファイリングなどの目的ではデータを使用しません。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第三者への提供</h2>
          <p className={styles.body}>
            当アプリはいかなる第三者に対しても、利用者のデータを提供・販売・共有しません。
            Firebase はデータのホスティング基盤として利用しており、Google がお客様のデータにアクセスすることはありません。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>広告・解析ツール</h2>
          <p className={styles.body}>
            当アプリは広告を表示しません。また、Google Analytics などの外部解析ツールも使用しておりません。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>外部サービス</h2>
          <p className={styles.body}>
            当アプリでは以下の外部サービスを利用しています。
          </p>
          <ul className={styles.list}>
            <li>Firebase Authentication（ログイン・アカウント管理）</li>
            <li>Cloud Firestore（データの保存・同期）</li>
            <li>YouTube（ルール解説動画へのリンク）</li>
          </ul>
          <p className={styles.body}>
            YouTube リンクをタップした場合、YouTube アプリまたはブラウザが起動します。
            その際の通信は YouTube（Google）のプライバシーポリシーに従います。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>データの削除</h2>
          <p className={styles.body}>
            設定画面の「アカウントを削除」から、アカウントおよび関連データ（プロフィール、フレンド情報等）を
            完全に削除することができます。なお、対戦記録は他の参加者の統計にも影響するため、保持されます。
            アカウント削除後のデータ復元はできませんのでご注意ください。
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
