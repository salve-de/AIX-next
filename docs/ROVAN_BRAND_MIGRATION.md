# Rovan（ロヴァン）改名記録

決定日: 2026-09-06。正式サービス名は **Rovan**、日本語の読みは **ロヴァン**。

## 変更範囲

画面・ヘッダー・フッター・favicon・メール・診断レポート・データ書き出し名・削除確認表示・紹介文・robotsクローラー名・ページタイトル・OGP・構造化データ・llms.txt・ai-index.json・package名・現行ドキュメントを統一した。ブランドの定義は `lib/brand.ts`。

機能、料金、測定条件、秘密値、決済ID、顧客の原データは変更していない。既存のlintエラー1件は、テストのrequireをES importへ置き換えて修正した。

## 意図して保持する互換性

- Supabaseの `aix_next_*` テーブル・RPCと既存SQL migration。単なる改名でデータへの接続を切らないため。
- プロセス内の `aixNext*` 保存キー。既存状態を引き継ぐため。
- npm依存の `@esbuild/aix-ppc64` とOS指定 `aix`。第三者パッケージの正式名であり本サービスとは無関係。
- 旧クローラー `AIXNextBot` / `AIXBot` の明示的拒否。RovanBotへの改名で既存拒否を回避しない。
- 旧画面の `DELETE AIX DATA` をサーバー側だけ互換受付。新画面は `DELETE ROVAN DATA`。token・メールによる照合は維持。
- 過去のGit履歴、実在GitHub URL、過去ブランチ名、ローカルパス、CI失敗原本。過去の証拠を書き換えない。
- 保存済み企業名・本文・AI回答は原本を維持。公開プロフィールの発行者とシステムが付けた見出しだけを、配信時にRovanへ読み替える。

## 外部設定の境界

リポジトリの実体名は `salve-de/AIX-next`。リポジトリ自体のrenameは管理API権限を要する別操作であり、このコード変更はrename済みと偽らない。clone URLは動作する実在URLを保持する。

公開URLは `NEXT_PUBLIC_SITE_URL`、問い合わせは `SELLER_EMAIL`、送信元は `WATCH_FROM_EMAIL`。未所有のrovanドメイン・メールを作ったことにはしない。資料中の `rovan.example` は例示専用であり稼働URLではない。SELLER_EMAIL未設定時は既存の `/support` に案内する。Stripe管理画面の商品表示・送信ドメイン認証・DNS・外部ホスト設定・本番デプロイはコード変更だけでは完了しない。

## 検証

`npm ci` → `npm run lint` → `npm test` → `npm run typecheck` → `npm run build`。`tests/brand.test.ts` が旧表示の再混入、日英表記、DB互換性、削除確認、新旧robots拒否、保存済み顧客名の保全を検査する。

改名前の基準実行: GitHub Actions run `34007314517`。既存45テスト・型・ビルドは成功し、lintは上記require 1件で失敗。改名後の実行結果はGitHub Actionsの対応コミットを正本とする。成功前に検証済みとは扱わない。

この移行は商標登録・名称の権利調査を含まない。

## 並行開発の保全

Cloud Run Jobs対応を含む最新featureを基点に適用。ジョブ、Scheduler、Artifact Registry、サービスアカウントの既存 `aix-*` リソースIDは接続互換性のため維持し、説明・ログのブランド表記だけ変更した。デプロイスクリプト自体は実行していない。
