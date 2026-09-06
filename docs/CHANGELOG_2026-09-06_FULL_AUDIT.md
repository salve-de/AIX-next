# Rovan 2026-09-06 全体監査・修正・検証記録

## この記録の目的

この文書は、Rovanの現行実装について行った「不自然な表示、根拠のない表現、ハードコードされた見本データ、公開情報の境界、ページ移管、決済導線」の監査と修正を、後から追跡できる形で残すための記録である。

対象ブランチは `feature/positioning-autopilot`。この記録を含む変更は、対象ブランチにコミットしてGitHubへ同期する。`main`へのマージ、デプロイ、本番設定変更はこの記録の対象外であり、別途確認が必要である。

なお、途中で提示されたスクリーンショットに対する「表示をデカデカにしない」という指示は撤回されたため、表示を小さくすること自体を目的にしていない。実装の基準は、利用者が判断に必要な事実を理解できる情報設計、根拠の明示、誤認防止、業界標準のアクセシビリティとした。

## 1. そもそも何をしていたか

最初の目的は、画面を見栄えだけで調整することではない。Rovanが実際に提供できるものと、画面・公開ページ・通知・ドキュメントが主張していることを突き合わせ、次の誤りを除くことだった。

1. AIの回答ログを、AI内部の順位・推薦・顧客流出・売上と誤って説明している箇所。
2. 公開ページに、取得できていない事実、競合の変化、因果効果、実績を生成してしまう箇所。
3. 架空の企業・URL・数値を、実在データや本番機能に見せる箇所。
4. 公開プロフィールのURL、slug、旧名称、旧JSON/Markdownが移管後に不整合になる箇所。
5. 料金・紹介報酬・クーポン・決済準備状態が、画面とAPIで食い違う箇所。
6. 利用者に見せる文章へ、内部用語、軍事的な比喩、過剰な保証表現が残る箇所。

修正後のプロダクト契約は、次の一文に集約する。

> 指定した会社・商品・サービス名またはURLについて、指定条件で取得できたAI回答と公開情報を参照元付きで整理し、同じ条件での再測定を可能にする。AIの順位、推薦、問い合わせ、売上、因果効果は保証しない。

## 2. 実施した作業

### 2.1 3つの独立レーンをサブエージェントで処理

- **公開プロフィール・見本データ**: 実行時の架空企業フォールバックを除去し、設計見本だけを明示的なfixtureとして残した。未知のslugは404にし、公開JSON/Markdownは許可項目から再生成する方式へ変更した。
- **Watch・通知・自動処理**: AI候補の変化だけから競合Webの変更や因果効果を推測しないようにした。前後クロール差分が保存されている場合だけ客観的な差分として扱い、公開・反映は承認前提にした。
- **料金・決済・公開表現**: 紹介報酬・クーポン・値引き導線を除去し、料金を共有定数へ統一した。販売者情報が未設定なら、UIだけでなくCheckout APIでも有料開始を停止するようにした。

その後、メイン作業で各レーンを統合し、ページの文言、metadata、空入力状態、404、表の意味付け、利用規約・プライバシー表現、テストを整合させた。

### 2.2 公開情報とデータ境界

- `lib/public-profile.ts`で、保存済みの古い公開成果物をそのまま返さず、公開許可項目からJSON-LD、JSON、Markdownを再構成するようにした。
- 秘密トークン、内部メモ、競合分析の内部情報、壊れたURL、URLの認証情報、クエリ・フラグメント付きの不要なURLを公開成果物から除外するテストを追加した。
- `lib/public-profile-path.ts`で、Rovan内の直接プロフィールはホスト名ではなく公開パスからslugを導出するようにした。外部プロフィールは従来どおりホストベースとした。
- `app/ai/company/[slug]`の未知のslugは、見つからない企業を推測して表示せず404を返すようにした。
- JSON-LDはSchema.org `Organization`として、画面で確認できる情報と整合する範囲だけを出力するようにした。

### 2.3 AI回答・Watch・表現

- 「AIが推薦した」「顧客を奪われた」「売上が増えた」「競合が動いた」といった、測定ログだけでは導けない表現を削除した。
- 「AI回答の測定」「候補入り状況」「参照元URL」「同じ質問での再測定」「観測された差分」へ用語を統一した。
- 数値の近くに質問数、成功した回答数、測定日時、測定条件、未取得理由を置いた。
- 「推論根拠」「出展」「AIクローラー巡回」など、実際の実装より強く見える語を「判定根拠」「参照元」「AI回答の測定」へ変更した。
- 架空の結果・Watch画面は「設計見本（架空データ）」と表示し、`example`ドメインを使用した。
- 公開プロフィールとChange Packは下書きとして扱い、人間の確認・承認なしに対象サイトへ書き込まないことを画面とコードで統一した。

### 2.4 ページ・導線・移管

- `/scan`の空入力状態を、診断対象を入力すべきことが明確な表示へ変更した。
- `/result`、`/watch`、`/ai/company/[slug]`の見本画面を再読込し、タイトル、見本表示、参照元、母数、非保証表現を確認した。
- 料金、パートナー、方法、規約、プライバシー、特商法、お問い合わせのmetadataを追加・整理した。
- `/result`、`/watch`、`/scan`など利用者固有・測定固有の画面にはnoindex系metadataを付けた。
- 公開プロフィールの旧名称を現行の「公開情報参照ページ」へ移行する互換処理を追加した。
- パートナーページを静的Server Componentとして成立させ、Server Componentで使用できないstyled-jsx依存を除去した。
- 表形式の情報には見出しとscopeを付け、キーボード操作と読み上げで意味を追える構造にした。

### 2.5 料金・決済・コンプライアンス

- 料金表示を `lib/pricing.ts` の共有定数へ統一した。
- 紹介報酬、クーポン、値引き、紹介リンクを料金・Checkout導線から除去した。
- 販売者情報が未設定の場合、`/api/billing/checkout`は有料契約を開始しない。
- Stripeがカード情報を管理することを画面上で説明し、Rovanがカード情報を保持するような表現を避けた。
- Google Maps評価の転載、公式台帳・公認推薦・順位保証・成果保証を採用しない境界を維持した。

## 3. 外部調査をどう実装へ反映したか

独自の「それっぽい」デザイン基準を作らず、2026-09-06に公式資料を確認した。

- [GOV.UK Data dashboards](https://brand.design-system.service.gov.uk/data/dashboards/): ダッシュボードは概要と高位の指標を示し、階層と簡潔な説明を持たせるという基準。結果・Watch画面の主役を測定事実へ寄せた。
- [Carbon accessibility guidance](https://v10.carbondesignsystem.com/guidelines/accessibility/developers/): セマンティックHTML、明確なラベル、キーボード順序、表の見出し・scope、データ可視化の代替説明を確認。表と見出しの構造へ反映した。
- [Schema.org Organization](https://schema.org/Organization): 公開プロフィールの構造化データの型として使用した。
- [Google structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies): 構造化データを画面上の内容と一致させ、誤解を招くマークアップにしない基準として使用した。
- [Google AI features documentation](https://developers.google.com/search/docs/appearance/ai-features): AI機能での表示を順位・掲載・成果の保証へ言い換えず、通常の公開情報と検索向けの基礎を分けて扱う基準として確認した。

これらはUI・公開データ・表現の作法を決める根拠であり、RovanがAIの推薦順位や売上を改善した証拠ではない。

## 4. 実際に確認したもの

### ブラウザでの表示確認

ローカルの実ページを開いて再読込し、次を確認した。

- `/pricing`: 料金、税込表示、解約表現、クーポン表現。
- `/partners`: 準備中表示、紹介報酬・フォーム・未実装ポータルの不在。
- `/scan`: 空入力メッセージ、診断対象の案内、戻る操作のラベル。
- `/result?sample=1`: 架空見本表示、母数、測定条件、参照元、非保証表現。
- `/watch?sample=1`: 再測定、次回測定、差分、候補回復率の分母、公開前確認。
- `/ai/company/aoba-souzoku?sample=1`: 架空見本、公開情報参照ページ、表、JSON-LD/Markdownリンク。
- `/ai/company/no-such-company?sample=1`: 404境界。

クリック操作の全組み合わせ、実アカウントの認証後画面、実AIの回答取得、Stripeの実決済まではこの確認に含めていない。

### HTTP確認

- 主要HTMLルート、公開ページ、robots、sitemap: 200。
- 未知の公開プロフィール: 404。
- 公開JSON、公開Markdown、AIサイトマップ、`/api/health`: 200。
- 認証情報なしでのCheckout開始: 400。

## 5. 自動検証

- `npm test`: **55 tests passed / 0 failed**。
- `npm run lint`: 成功。
- `npm run typecheck`: 成功。
- `npm run build`: 成功。Next.js 16.3.4で26静的ページを生成し、動的API・公開プロフィールルートを含む全ルートを生成できた。
- `git diff --check`: 成功。

Build時の警告は、リポジトリ外の `/Users/satoushinya/package-lock.json` をNext.jsが無視したという環境上の注意だけである。

## 6. 未確認・未実施の範囲

次の項目は、コードが存在することやローカルビルド成功だけでは完了と扱わない。

- 本番環境へのデプロイ、DNS、TLS、Cloud Run、Scheduler、Supabase、Stripe、メール配送。
- 実AIプロバイダー3社を使った本番相当の測定と、実際のAI製品画面との一致。
- 認証済みユーザーの作成、Watch登録、Webhook、解約、データ削除・エクスポートの全E2E。
- 実顧客サイトへの公開・GitHub/CMSへの書き込み。現行実装では承認なしに書き込まない。
- 利用者による理解・継続利用・支払いの受容。ローカルブラウザ確認やテストだけでは証明できない。
- `NEXT_PUBLIC_SITE_URL`。本番では必ず実ドメインを設定する。未設定時のローカル既定値は `http://localhost:3000`。

## 7. GitHub同期状態

- リモート: `https://github.com/salve-de/AIX-next.git`
- ブランチ: `feature/positioning-autopilot`
- この記録作成前のGitHub先端: `8d679aa6932b302174099eec6381c99515137167`
- 今回の変更は、本文書と変更ファイルをまとめた新規コミットとしてこのブランチへpushする。
- `main`へのマージ、強制push、デプロイは行わない。

## 8. 変更パス一覧

### 既存ファイルの変更・削除

```text
AGENTS.md
PROJECT_RULES.md
README.md
app/ai/company/[slug]/json/route.ts
app/ai/company/[slug]/md/route.ts
app/ai/company/[slug]/page.tsx
app/api/ai-profile/route.ts
app/api/billing/checkout/route.ts
app/api/scan/route.ts
app/commerce/page.tsx
app/globals.css
app/layout.tsx
app/methodology/page.tsx
app/page.tsx
app/partners/page.tsx
app/pricing/page.tsx
app/privacy/page.tsx
app/result/page.tsx
app/scan/page.tsx
app/setup/page.tsx
app/support/page.tsx
app/terms/page.tsx
app/watch/page.tsx
components/ai-readable-client.tsx
components/billing-client.tsx
components/brand.tsx
components/citation-map.tsx
components/executive-diagnostic-summary.tsx
components/executive-referral-card.tsx (deleted)
components/google-decline-problem-section.tsx
components/insight-panels.tsx
components/live-activity-ticker.tsx
components/positioning-panel.tsx
components/product-visuals.tsx
components/public-profile-actions.tsx
components/question-list.tsx
components/report-actions.tsx
components/result-client.tsx
components/scan-form.tsx
components/scan-progress.tsx
components/site-footer.tsx
components/site-header.tsx
components/structured-data.tsx
components/verified-companies-gallery.tsx
components/watch-client.tsx
components/zero-effort-promise-section.tsx
docs/ARCHITECTURE.md
docs/CHAT_HANDOFF_2026-09-02_VALUE_PASS.md
docs/COMPLIANCE_AND_POSITIONING_POLICY.md
docs/CONTINUOUS_VALUE_RETENTION.md
docs/CORE_PRODUCT_STRATEGY.md
docs/LAUNCH_CHECKLIST.md
docs/OWNER_VISION_AND_PHILOSOPHY.md
docs/PRODUCT_STRATEGY.md
docs/PROJECT_MASTER_HISTORY_AND_STRATEGY.md
docs/REVENUE_AUTOPILOT_RESEARCH_2026-09-03.md
docs/UX_RATIONALE.md
docs/VALUE_PROPOSITION_RESEARCH_2026-09-02.md
docs/report-source.md
lib/ai-readable.ts
lib/autonomous-watch.ts
lib/brand-compatibility.ts
lib/change-pack.ts
lib/company-knowledge.ts
lib/demand-proxy.ts
lib/discovery.ts
lib/env.ts
lib/measurement.ts
lib/positioning.ts
lib/providers/common.ts
lib/providers/index.ts
lib/public-dto.ts
lib/public-profile.ts
lib/sample-data.ts
lib/scan-result.ts
lib/scan-runner.ts
lib/storage.ts
lib/types.ts
lib/watch-email.ts
lib/watch-measurement.ts
public/ai-index.json
public/llms.txt
tests/autonomous-watch.test.ts
tests/brand.test.ts
tests/market-map.test.ts
tests/positioning.test.ts
tests/public-profile.test.ts
tests/sample-data.test.ts
```

### 新規ファイル

```text
lib/pricing.ts
lib/prompt-panels.ts
lib/public-profile-path.ts
lib/sample-profiles.ts
tests/public-profile-path.test.ts
docs/CHANGELOG_2026-09-06_FULL_AUDIT.md
```
