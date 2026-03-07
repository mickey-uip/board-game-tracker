import { PageHeader } from '../../components/layout/PageHeader';
import styles from './TermsPage.module.css';

export function TermsPage() {
  return (
    <div>
      <PageHeader title="利用規約" showBack />
      <div className={styles.container}>
        <p className={styles.updated}>最終更新日：2026年3月</p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>はじめに</h2>
          <p className={styles.body}>
            本利用規約（以下「本規約」）は、ボードゲーム対戦記録管理アプリ「ボドゲレコード」（以下「当アプリ」）の利用条件を定めるものです。
            ユーザーの皆様には、本規約に同意のうえ当アプリをご利用いただきます。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>サービスの内容</h2>
          <p className={styles.body}>
            当アプリは、以下の機能を提供します。
          </p>
          <ul className={styles.list}>
            <li>ボードゲームの対戦記録の作成・管理</li>
            <li>対戦成績の統計表示・タイプ診断</li>
            <li>フレンド機能（フレンド追加・対戦招待）</li>
            <li>ゲーム情報の管理</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>アカウント</h2>
          <p className={styles.body}>
            当アプリの利用にはアカウント登録が必要です。
            ユーザーは自身のアカウント情報（メールアドレス、パスワード等）を適切に管理する責任を負います。
            第三者によるアカウントの不正利用について、当アプリ運営者は一切の責任を負いません。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>禁止事項</h2>
          <p className={styles.body}>
            ユーザーは以下の行為を行ってはなりません。
          </p>
          <ul className={styles.list}>
            <li>不正アクセスやサーバーへの過負荷を与える行為</li>
            <li>他のユーザーへの迷惑行為・嫌がらせ</li>
            <li>虚偽の情報を登録する行為</li>
            <li>当アプリの運営を妨害する行為</li>
            <li>法令または公序良俗に反する行為</li>
            <li>その他、運営者が不適切と判断する行為</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>コンテンツの権利</h2>
          <p className={styles.body}>
            ユーザーが当アプリに登録した対戦記録・プロフィール情報等のデータの所有権は、ユーザー本人に帰属します。
            ただし、サービスの運営・改善に必要な範囲で、匿名化・統計化されたデータを利用する場合があります。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>サービスの変更・終了</h2>
          <p className={styles.body}>
            運営者は、事前の通知なく当アプリの内容を変更、または提供を終了することがあります。
            サービスの変更・終了によりユーザーに損害が生じた場合でも、運営者は一切の責任を負いません。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>免責事項</h2>
          <p className={styles.body}>
            当アプリは現状有姿で提供されます。運営者は、以下について一切の保証を行いません。
          </p>
          <ul className={styles.list}>
            <li>サービスの中断・停止・データの損失が発生しないこと</li>
            <li>サービスがユーザーの特定の目的に適合すること</li>
            <li>サービスにエラーやバグが存在しないこと</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>規約の変更</h2>
          <p className={styles.body}>
            運営者は必要に応じて本規約を変更することがあります。
            変更後の規約はアプリのアップデートとともに反映されます。
            変更後に当アプリを利用した場合、変更後の規約に同意したものとみなします。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>準拠法・管轄</h2>
          <p className={styles.body}>
            本規約の解釈は日本法に準拠します。
            当アプリに関して紛争が生じた場合には、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>お問い合わせ</h2>
          <p className={styles.body}>
            本規約に関するご質問は、App Store のサポートページよりお問い合わせください。
          </p>
        </section>
      </div>
    </div>
  );
}
