# 2026-09-07 承認済み文言の復元

## 依頼と境界

利用者にチャット内で提示した「原文へ戻す／問題部分だけ限定修正／維持／実装不足を分離」の一覧に対し、「じゃあそれで なおせ」と承認された修正。
原文の比較基準は 8d679aa。今回の変更直前は f3c5a7f5963c8792c791dc58e28a4d1e414aa342。

商品の目的を情報整理サービスへ縮小せず、推薦獲得・差別化・本業への集中という訴求を復元する。外部AIの公式認定、推薦保証、架空成果、未実装機能の達成表示は復元しない。
料金・割引率・報酬率・測定値・北極星の計算式・公開承認・課金・DB・外部サービス設定・CSSは変更しない。状態別の表示とメールの比較可否ガードは承認された修正範囲。

## 主な復元と限定修正

| 面 | 復元・修正した表示 |
| --- | --- |
| トップ | ChatGPT・生成AI おすすめ獲得システム／手に入る2つの確定成果物／専属のAI見守り体制／明朗・適正な価格設定 |
| ヒーロー | お客さんがChatGPTに「おすすめ」を聞いた時、あなたの会社ではなく、大手ばかり紹介されていませんか？ |
| 末尾CTA | 御社はAIから「おすすめ」されていますか？ まずは無料診断で、自社の現状をご確認ください。 |
| 省力訴求 | 社長は、本業（接客・施工・製造・経営）に100%専念してください。／既存の自社サイトは1文字も触る必要がありません。／ブログ更新も一切不要 |
| 成果物 | 自社専用 AI診断レポート／自社専用 AI推薦データ。AI事業者の公式認定データとはしない |
| 手順 | 社名を入れるだけ／AI推薦の現状がわかる／AI推薦データを配備／毎週のAI回答を自動見守り／社長の作業／裏側の自動処理 |
| 料金 | 営業マンを雇う前に。AI新時代に取り残されないための投資。／AI推薦・自動見守りプラン。税込10,780円・税別9,800円は不変更 |
| 結果・戦略 | 自社専用 AI診断レポート／今すぐできる解決アクション／差別化戦略／御社固有の推薦軸／想定ターゲット／戦略分析所見 |
| 公開操作 | AI推薦データの下書きを作成する／内容を確認して公開する／配備完了。下書きと公開完了・見本を分ける |
| 無料試用 | 週次自動見守りプラン（14日間無料トライアル）／14日間無料で試してみる（メール登録不要） |
| 見守り | AI推薦の推移レポート／次回巡回／Rovanの自動対処／AI推薦データの自動更新／AI推薦枠の獲得と、ライバルとの比較 |
| 通知 | AI推薦状況の追跡開始。候補入り変化、参照元・取得状況だけの変化、比較不可、無料期間終了を区別 |
| 見本 | 「設計見本」を「見本」へ統一し、架空データ表示を保持。具体的な4業種の強みと整合する12問中2→4問の表示例を復元 |
| 検索・共有 | タイトル、OG、構造化データ、機械可読のサービス説明も推薦獲得の目的に一致 |

## 変更ファイル

- app/ai/company/[slug]/json/route.ts
- app/ai/company/[slug]/md/route.ts
- app/ai/company/[slug]/page.tsx
- app/layout.tsx
- app/page.tsx
- app/partners/page.tsx
- app/pricing/page.tsx
- app/watch/page.tsx
- components/ai-readable-client.tsx
- components/billing-client.tsx
- components/brand.tsx
- components/executive-diagnostic-summary.tsx
- components/positioning-panel.tsx
- components/product-visuals.tsx
- components/profile-automation-controls.tsx
- components/public-profile-actions.tsx
- components/result-client.tsx
- components/scan-form.tsx
- components/site-footer.tsx
- components/site-header.tsx
- components/structured-data.tsx
- components/verified-companies-gallery.tsx
- components/watch-client.tsx
- components/zero-effort-promise-section.tsx
- lib/sample-data.ts
- lib/sample-profiles.ts
- lib/watch-email.ts
- public/ai-index.json
- public/llms.txt
- tests/copy-restoration.test.ts（承認した主要文言・禁止断定・見本の隔離・メタ情報の回帰検査）
- tests/watch-copy-states.test.ts（実際のReact部品と通知モジュールを、外部通信・秘密値なしで実行する状態別検査）
- 本記録

## 一次資料と技術上の境界

- Google Search Central: https://developers.google.com/search/docs/appearance/ai-features
- OpenAI Crawlers: https://developers.openai.com/api/docs/bots
- インストール済みNext.js 16.3.4: node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md

Googleは通常のSEO・可視本文と構造化データの一致を案内し、特別なAI用schemaを要求せず、掲載を保証しない。OpenAIは検索と学習のクローラーを区別している。これらは「Rovanの推薦獲得という目的を弱める」根拠ではない。AI推薦データはRovanの商品呼称であり、業界の公式認定名称と主張しない。

## 分担・独立確認

- Godel: トップ、料金、共通ヘッダー・フッター、見本、省力訴求。
- Anscombe: 診断、戦略、公開ページ。実装後はトップ・見守り・メールの独立レビュー。
- Averroes: 見守り、通知、契約表示。独立指摘の状態表示も修正。
- リード: 一覧との照合、機械可読メタ情報、見本データの文言、回帰テスト、Safari実操作、記録。共有checkoutの編集対象を分離し、Git統合・外部公開は行わない。

## 検証結果

最終検証（2026-09-07）:

- `npm run lint`: 成功。
- `npm run typecheck`: 成功。
- `node --import tsx --test tests/**/*.test.ts`: 110件成功、失敗・スキップ0件。
- `npm run build`: 成功。リポジトリ外の親ディレクトリのpackage-lock.jsonを無視する既存警告あり。設定変更は行っていない。
- Safari実操作の確認範囲は下記のとおり。停止・取得不足・地域変更などの分岐は自動テストで検証し、実サービスの課金・メール送信・AI再測定を実施したとは扱わない。
- 製品ソース29ファイル、追加テスト2ファイル、本記録1ファイル。すべて未コミット。GitHub同期・本番公開は未実施。

Safari実ブラウザ・http://127.0.0.1:3001/ で実操作：

1. ホームに「おすすめ獲得システム」「手に入る2つの確定成果物」「本業に100%専念」を確認。
2. 診断レポート見本へクリック。初回遷移では編集前に読み込まれた表示を観測したためSafariの再読み込みを実施し、復元後の文字列を確認。
3. 「AI推薦データの下書きを作成する」をクリック。「見本です。実際の公開・契約は行われません。」と公開ページ確認リンクを確認。実公開なし。
4. 「14日間無料で試してみる（メール登録不要）」をクリックし、Watch見本へ移動。2問の推薦候補入り、自動更新の見本表示、50問北極星と12問の短いパネルの区別を確認。
5. 料金ページへクリック。営業マンを雇う前に、という復元と税込10,780円を確認。
6. 公開ページ見本へクリック。AI推薦データの名称、初回対面相談無料等の具体例、架空データ・非公式の説明を確認。見本タイトルの二重表記を修正。
7. Rovanホームへ戻した。別プロジェクトの3000番とそのタブは変更・停止していない。

これはローカルSafariの表示・導線検証であり、本番AI実測・本番公開・実課金・実メール送信を証明するものではない。新規負荷試験は対象外（処理量・同時実行数を変更していない）。

## 実装不足として維持する項目

完全自動運用の全約束、30日を超える公開維持、競合Web差分からの自律ニッチ補強、強み選択と公開反映の連動、任意1行補正、完成紹介文、有料全方位登録・FAQ10問、永続管理・スマートフォン直接更新、割引・紹介報酬・パートナー受付は、この文言修正で実装済みにしない。制度を廃止確定したという意味でもない。

診断結果には従来から「いずれかの回答で候補入り」と「多数判定で候補外」の集計が併存する。Safariの見本でも6/12と候補外10/12を確認した。今回、計算定義を無断変更せず、集計ラベルと定義の統一は残課題として記録する。

## Git・公開状態

このターンではcommit・push・main統合・deployを行わない。直前HEADに対する未コミットの修正として保持する。以前の公開リポジトリへのpush拒否を迂回していない。本書をローカルで作成したことを「GitHubに同期済み」とは報告しない。

## 全コード差分（今回の変更直前HEADとの比較）

以下の差分は、文言・表示条件・見本・公開メタ情報の全変更行を省略せず保存したもの。マイナスが変更前、プラスが変更後。テストの全文は上記2ファイルを参照。

```diff
diff --git a/app/ai/company/[slug]/json/route.ts b/app/ai/company/[slug]/json/route.ts
index 9394d73..9e61ca9 100644
--- a/app/ai/company/[slug]/json/route.ts
+++ b/app/ai/company/[slug]/json/route.ts
@@ -12 +12 @@ export async function GET(request: Request, context: { params: Promise<{ slug: s
-    if (!profile) return Response.json({ error: "設計見本が見つかりません。" }, { status: 404, headers: { "cache-control": "no-store", "x-robots-tag": "noindex" } });
+    if (!profile) return Response.json({ error: "見本が見つかりません。" }, { status: 404, headers: { "cache-control": "no-store", "x-robots-tag": "noindex" } });

diff --git a/app/ai/company/[slug]/md/route.ts b/app/ai/company/[slug]/md/route.ts
index da6f9b1..603c485 100644
--- a/app/ai/company/[slug]/md/route.ts
+++ b/app/ai/company/[slug]/md/route.ts
@@ -12 +12 @@ export async function GET(request: Request, context: { params: Promise<{ slug: s
-    if (!profile) return new Response("設計見本が見つかりません。\n", { status: 404, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });
+    if (!profile) return new Response("見本が見つかりません。\n", { status: 404, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });

diff --git a/app/ai/company/[slug]/page.tsx b/app/ai/company/[slug]/page.tsx
index 89c9194..1004bc7 100644
--- a/app/ai/company/[slug]/page.tsx
+++ b/app/ai/company/[slug]/page.tsx
@@ -67 +67 @@ export async function generateMetadata({ params, searchParams }: PageProps): Pro
-    title: sample ? `${profile.title}（画面確認用）` : profile.title,
+    title: sample ? `${profile.brandName} AI推薦データ（見本・架空データ）` : profile.title,
@@ -95 +95 @@ export default async function PublicCompanyPage({ params, searchParams }: PagePr
-            <span><strong>Rovan</strong><small>公開情報参照ページ</small></span>
+            <span><strong>Rovan</strong><small>AI推薦データの公開ページ</small></span>
@@ -98 +98 @@ export default async function PublicCompanyPage({ params, searchParams }: PagePr
-            自社サイトの公開情報を確認する <ArrowIcon />
+            まずは無料で診断してみる <ArrowIcon />
@@ -108 +108 @@ export default async function PublicCompanyPage({ params, searchParams }: PagePr
-            <span style={{ color: "var(--text-primary, #0f172a)", fontWeight: 700 }}>公開情報参照ページ</span>
+            <span style={{ color: "var(--text-primary, #0f172a)", fontWeight: 700 }}>AI推薦データの公開ページ</span>
@@ -120 +120 @@ export default async function PublicCompanyPage({ params, searchParams }: PagePr
-                  公開情報参照ページ
+                  AI推薦データの公開ページ
@@ -124 +124 @@ export default async function PublicCompanyPage({ params, searchParams }: PagePr
-                    設計見本（架空データ）
+                    見本（架空の会社・データを使った表示例です）
@@ -182 +182 @@ export default async function PublicCompanyPage({ params, searchParams }: PagePr
-            <p className="section-lead-desc">{sourceTargetIsRovan ? "入力された内容を整理したページです。掲載内容の正確性・最新性は、公開前に入力者が確認してください。" : "Rovanが確認時点の参照元ページを整理したスナップショットです。情報の正確性・最新性は参照元サイトでご確認ください。"}</p>
+            <p className="section-lead-desc">AI推薦データは、会社の強み・対応条件・参照元をまとめた、AI向けの公開データです。本人確認や公的認証を示す公式台帳・公認推薦ではありません。{sourceTargetIsRovan ? "入力された内容を整理したページです。掲載内容の正確性・最新性は、公開前に入力者が確認してください。" : "Rovanが確認時点の参照元ページを整理したスナップショットです。情報の正確性・最新性は参照元サイトでご確認ください。"}</p>

diff --git a/app/layout.tsx b/app/layout.tsx
index ff266be..0b1284a 100644
--- a/app/layout.tsx
+++ b/app/layout.tsx
@@ -10,2 +10,2 @@ export const metadata: Metadata = {
-  title: { default: "Rovan（ロヴァン）— 専門性でAIのおすすめ獲得を目指す", template: "%s | Rovan" },
-  description: "大手に埋もれず、御社の専門性でAIの推薦候補へ。URLまたは社名から診断・公開情報の整備・継続測定まで、自社サイト改修なしで取り組めます。",
+  title: { default: "Rovan（ロヴァン）— ChatGPTに、御社はおすすめされていますか？", template: "%s | Rovan" },
+  description: "自社サイトの改修・新規開設は不要。社名からAI推薦の現状を診断し、御社の強みを伝えるAI推薦データを作成。公開後の推薦状況を毎週追跡します。",
@@ -13 +13 @@ export const metadata: Metadata = {
-  openGraph: { siteName: BRAND.name, type: "website", locale: "ja_JP", title: "Rovan — 専門性でAIのおすすめ獲得を目指す", description: "大手に埋もれず、御社の専門性でAIの推薦候補へ。URLまたは社名から診断・公開情報の整備・継続測定まで、自社サイト改修なしで取り組めます。", url: "/" },
+  openGraph: { siteName: BRAND.name, type: "website", locale: "ja_JP", title: "Rovan（ロヴァン）— ChatGPTに、御社はおすすめされていますか？", description: "自社サイトの改修・新規開設は不要。社名からAI推薦の現状を診断し、御社の強みを伝えるAI推薦データを作成。公開後の推薦状況を毎週追跡します。", url: "/" },

diff --git a/app/page.tsx b/app/page.tsx
index a81ae06..3870953 100644
--- a/app/page.tsx
+++ b/app/page.tsx
@@ -25 +25 @@ export default function HomePage() {
-              <p className="overline">ChatGPT・生成AI おすすめ獲得支援</p>
+              <p className="overline">ChatGPT・生成AI おすすめ獲得システム</p>
@@ -27,2 +27,2 @@ export default function HomePage() {
-                お客さんがAIに「おすすめ」を聞いた時、<br />
-                <em>大手に埋もれず、あなたの専門性で選ばれる会社へ。</em>
+                お客さんがChatGPTに「おすすめ」を聞いた時、<br />
+                <em>あなたの会社ではなく、大手ばかり紹介されていませんか？</em>
@@ -32,2 +32,3 @@ export default function HomePage() {
-                URLまたは社名から、診断・選ばれる理由の公開・毎週の追跡まで。<br />
-                初回に内容を確認し、継続更新は許可した範囲でRovanに任せられます。
+                社名から、御社の強みを伝えるAI推薦データを自動作成。<br />
+                内容を確認したら、そのまま公開できます。
+                AI推薦データは、会社の強み・対応条件・参照元をまとめた、AI向けの公開データです。
@@ -55 +56 @@ export default function HomePage() {
-                HPの改修は不要
+                HPの改修・開設も不要
@@ -68 +69 @@ export default function HomePage() {
-              <span className="ai-clean-caption">測定対象のAI:</span>
+              <span className="ai-clean-caption">調査対象AI:</span>
@@ -75 +76 @@ export default function HomePage() {
-                診断レポートの設計見本を見る <span aria-hidden="true">→</span>
+                診断レポートの見本を見る <span aria-hidden="true">→</span>
@@ -87,2 +88,2 @@ export default function HomePage() {
-          <span className="pill-badge">回答の表示例</span>
-          <h2>利用者がAIに相談した時、<br />回答はどう変わるのか？</h2>
+          <span className="pill-badge">AI推薦の比較イメージ</span>
+          <h2>お客さんがAIに相談した時、<br />回答はどう変わるのか？</h2>
@@ -90,2 +91,2 @@ export default function HomePage() {
-            ChatGPTやGeminiなど主要AIで、利用者が相談した場合の回答例を比較。<br />
-            お客さんの細かな条件に合う専門性で、御社が推薦候補に入ることを目指します。以下は設計上の表示例です。
+            ChatGPTやGeminiなど主要AIで、見込み客が相談した場合の回答例を比較。<br />
+            お客さんの細かな条件に合う専門性で、御社が推薦候補に入ることを目指します。以下は架空の会社・データを使った表示例です。
@@ -109,2 +110,2 @@ export default function HomePage() {
-          <span className="pill-badge">AI推薦の獲得に向けた2つの成果物</span>
-          <h2>推薦の現状を知り、<br />選ばれる理由を公開する。</h2>
+          <span className="pill-badge">手に入る2つの確定成果物</span>
+          <h2>社名を入力するだけで、<br />手元に届く「2大成果物」</h2>
@@ -113 +114 @@ export default function HomePage() {
-            「推薦の現状がわかる診断レポート」と「専門性・対応条件を伝える公開情報ページ」。ページは初回確認後に公開できます。
+            「推薦の現状がわかる診断レポート」と「御社の強みをAIに伝える推薦データ」。ページは初回確認後に公開できます。
@@ -151,2 +152,2 @@ export default function HomePage() {
-            <span className="pill-badge">推薦獲得を目指す、週次の見守り</span>
-            <h2>自社が選ばれる機会を、<br />毎週の回答から探す。</h2>
+            <span className="pill-badge">専属のAI見守り体制</span>
+            <h2>AIの回答状況を、<br />毎週自動で追跡・チェック。</h2>
@@ -156 +157 @@ export default function HomePage() {
-              <li><strong>比較候補の変化</strong>：候補の入れ替わりや参照元の差分を記録</li>
+              <li><strong>ライバル急浮上アラート</strong>：毎週の測定で、競合の推薦状況の変化をお知らせ</li>
@@ -174 +175 @@ export default function HomePage() {
-            <span className="pill-badge">料金</span>
+            <span className="pill-badge">明朗・適正な価格設定</span>
@@ -204 +205 @@ export default function HomePage() {
-                現状把握と公開情報整理
+                現状把握とAI推薦データの作成
@@ -207 +208 @@ export default function HomePage() {
-                無料AI回答 診断レポート
+                無料AI推薦 診断レポート
@@ -215 +216 @@ export default function HomePage() {
-                <li>参照元付きの公開情報整理案（自動下書き）</li>
+                <li>自社専用のAI推薦データ（自動下書き）</li>
@@ -269 +270 @@ export default function HomePage() {
-                継続利用向け
+                おすすめ
@@ -272 +273 @@ export default function HomePage() {
-                継続測定・差分確認
+                継続運用・AI推薦の監視
@@ -275 +276 @@ export default function HomePage() {
-                週次測定プラン
+                毎週の自動見守りプラン
@@ -321,2 +322,2 @@ export default function HomePage() {
-            <span className="pill-badge">URL・社名だけで開始</span>
-            <h2>「この条件なら御社」とAIにおすすめされるために。<br />まずは無料診断で、候補に入れているか確認しましょう。</h2>
+            <span className="pill-badge">URL・社名だけで開始。自社サイト改修ゼロ。</span>
+            <h2>御社はAIから「おすすめ」されていますか？<br />まずは無料診断で、自社の現状をご確認ください。</h2>
@@ -335 +336 @@ export default function HomePage() {
-              <span>HPの改修は不要</span>
+              <span>HPの改修・開設も不要</span>

diff --git a/app/partners/page.tsx b/app/partners/page.tsx
index 3182efe..0a089e5 100644
--- a/app/partners/page.tsx
+++ b/app/partners/page.tsx
@@ -39 +39 @@ export default function PartnersPage() {
-                診断の設計見本を見る
+                診断の見本を見る

diff --git a/app/pricing/page.tsx b/app/pricing/page.tsx
index 3590d70..eada885 100644
--- a/app/pricing/page.tsx
+++ b/app/pricing/page.tsx
@@ -9 +9 @@ export const metadata: Metadata = {
-  description: "専門性でAIのおすすめ獲得を目指すRovan。無料診断と週次見守りの料金・提供範囲。",
+  description: "Rovanの無料AI推薦診断と、AI推薦・自動見守りプランの料金・提供範囲。",
@@ -16,2 +16,2 @@ const free = [
-  "回答で参照されたURLと公開情報の対応確認",
-  "自社サイトを改修せずに公開情報の整理案を確認",
+  "大手ライバルが推薦された回答と、その根拠の確認",
+  "自社専用のAI推薦データ（自動下書き）",
@@ -32,2 +32,2 @@ export default function PricingPage() {
-    title="大手に埋もれず、専門性でAIのおすすめ獲得を目指す。"
-    lead="URLまたは社名から、推薦の現状診断と、御社が選ばれる理由を伝える下書きへ。サイト改修や追加の質問票なしで取り組めます。公開は内容を確認・承認した後に行います。AIの推薦・順位・売上の改善は保証しません。"
+    title="営業マンを雇う前に。AI新時代に取り残されないための投資。"
+    lead="社名から、御社の強みを伝えるAI推薦データを自動作成。内容を確認したら、そのまま公開できます。AI推薦データは、会社の強み・対応条件・参照元をまとめた、AI向けの公開データです。サイト改修や追加の質問票は不要です。"
@@ -47 +47 @@ export default function PricingPage() {
-          <p>AI回答・週次見守りプラン</p>
+          <p>AI推薦・自動見守りプラン</p>
@@ -83,2 +83,2 @@ export default function PricingPage() {
-        <div><strong>2</strong><span>公開情報の下書き</span><p>内容を確認してから公開</p></div>
-        <div><strong>3</strong><span>週次測定を開始</span><p>同じ条件で前回との差分を確認</p></div>
+        <div><strong>2</strong><span>AI推薦データを配備</span><p>内容を確認してから公開</p></div>
+        <div><strong>3</strong><span>毎週のAI回答を自動見守り</span><p>同じ条件で前回との差分を確認</p></div>

diff --git a/app/watch/page.tsx b/app/watch/page.tsx
index 5a0ecde..31034de 100644
--- a/app/watch/page.tsx
+++ b/app/watch/page.tsx
@@ -8 +8 @@ export default function WatchPage() {
-  return <Suspense fallback={<div className="full-loading">AI回答の測定結果を読み込んでいます。</div>}><WatchClient /></Suspense>;
+  return <Suspense fallback={<div className="full-loading">AI推薦状況を読み込んでいます。</div>}><WatchClient /></Suspense>;

diff --git a/components/ai-readable-client.tsx b/components/ai-readable-client.tsx
index 8780cbd..6debf4d 100644
--- a/components/ai-readable-client.tsx
+++ b/components/ai-readable-client.tsx
@@ -79 +79 @@ export function AiReadableClient() {
-    <header className="site-header site-header-compact"><div className="shell header-inner"><Link className="brand" href={backHref}><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span><strong>Rovan</strong><small>AI回答の測定</small></span></Link><Link className="text-button" href={backHref}>戻る <ArrowIcon /></Link></div></header>
+    <header className="site-header site-header-compact"><div className="shell header-inner"><Link className="brand" href={backHref}><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span><strong>Rovan</strong><small>生成AI・競合診断</small></span></Link><Link className="text-button" href={backHref}>戻る <ArrowIcon /></Link></div></header>
@@ -85 +85 @@ export function AiReadableClient() {
-        <div className="ai-info-source"><div><p className="overline">取得した公開ページから作成</p><h2>下書きの中身を確認する。</h2><p>{draft.sourcePages.length}ページをもとに作成。自動公開はしません。</p></div><span>{sample ? "架空データの見本" : "人が確認する下書き"}</span></div>
+        <div className="ai-info-source"><div><p className="overline">取得した公開ページから作成</p><h2>下書きの中身を確認する。</h2><p>{draft.sourcePages.length}ページをもとに作成。自動公開はしません。</p></div><span>{sample ? "見本（架空の会社・データを使った表示例です）" : "人が確認する下書き"}</span></div>

diff --git a/components/billing-client.tsx b/components/billing-client.tsx
index 84eb763..ddee181 100644
--- a/components/billing-client.tsx
+++ b/components/billing-client.tsx
@@ -48 +48 @@ export function BillingClient() {
-      <h2>定期見守りプランのご契約管理</h2>
+      <h2>AI推薦・自動見守りプランのご契約管理</h2>

diff --git a/components/brand.tsx b/components/brand.tsx
index 798f020..23c54b1 100644
--- a/components/brand.tsx
+++ b/components/brand.tsx
@@ -5 +5 @@ export function Brand() {
-  return <Link className="brand" href="/" aria-label={`${BRAND.name}（${BRAND.nameJa}）ホーム`}><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span><strong>{BRAND.name}</strong><small>生成AI・おすすめ獲得支援</small></span></Link>;
+  return <Link className="brand" href="/" aria-label={`${BRAND.name}（${BRAND.nameJa}）ホーム`}><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span><strong>{BRAND.name}</strong><small>生成AI・競合診断</small></span></Link>;

diff --git a/components/executive-diagnostic-summary.tsx b/components/executive-diagnostic-summary.tsx
index 6cd1b62..4bbb8ff 100644
--- a/components/executive-diagnostic-summary.tsx
+++ b/components/executive-diagnostic-summary.tsx
@@ -74 +74 @@ export function ExecutiveDiagnosticSummary({
-            <strong style={{ fontSize: "1.05rem", color: "var(--navy, #0f172a)", letterSpacing: "-0.01em" }}>次の一手：専門性で選ばれる理由を公開する</strong>
+            <strong style={{ fontSize: "1.05rem", color: "var(--navy, #0f172a)", letterSpacing: "-0.01em" }}>自社サイト改修ゼロで、AI推薦データを配備</strong>
@@ -78 +78 @@ export function ExecutiveDiagnosticSummary({
-            御社の専門性や対応条件を、参照元付きのページへ。初回に内容を確認して公開します。自社サイトの改修や、一から文章を作る作業は不要です。
+            会社の強み・対応条件・参照元をまとめた、AI向けの公開データを作成します。初回に内容を確認して公開します。自社サイトの改修や、一から文章を作る作業は不要です。
@@ -111 +111 @@ export function ExecutiveDiagnosticSummary({
-          <div style={{ fontSize: "0.84rem", color: "var(--text-secondary, #475569)" }}>公開情報の下書きは、内容を確認してから公開できます。</div>
+          <div style={{ fontSize: "0.84rem", color: "var(--text-secondary, #475569)" }}>AI推薦データの下書きは、内容を確認してから公開できます。</div>
@@ -113 +113 @@ export function ExecutiveDiagnosticSummary({
-            選ばれる理由を伝える下書きを見る <span aria-hidden="true">↓</span>
+            AI推薦データの下書きを見る <span aria-hidden="true">↓</span>

diff --git a/components/positioning-panel.tsx b/components/positioning-panel.tsx
index 7f70819..61e8fc8 100644
--- a/components/positioning-panel.tsx
+++ b/components/positioning-panel.tsx
@@ -36 +36 @@ export function PositioningPanel({ positioning }: { positioning?: PositioningAdv
-          <p className="overline">【推薦獲得の戦略】御社が選ばれる強みを見つける</p>
+          <p className="overline">【差別化戦略】AIに伝える「自社固有の強み」を選ぶ</p>
@@ -69 +69 @@ export function PositioningPanel({ positioning }: { positioning?: PositioningAdv
-        <div className="winning-angle-badge">御社が推薦される理由として磨く強み</div>
+        <div className="winning-angle-badge">AIに伝える、御社固有の推薦軸</div>

diff --git a/components/product-visuals.tsx b/components/product-visuals.tsx
index ba6bb52..df0f98f 100644
--- a/components/product-visuals.tsx
+++ b/components/product-visuals.tsx
@@ -10 +10 @@ export function HeroChatDiagnosticCard() {
-      <p className="split-demo-note">説明用の表示例（実測値・効果を示すものではありません）</p>
+      <p className="split-demo-note">架空の会社・データを使った表示例です。実測値・導入効果を示すものではありません。</p>
@@ -15 +15 @@ export function HeroChatDiagnosticCard() {
-          <span className="split-prompt-label">利用者によるAIへの相談例</span>
+          <span className="split-prompt-label">見込み客によるAIへの相談例</span>
@@ -26 +26 @@ export function HeroChatDiagnosticCard() {
-            <span className="split-status-badge tag-lost">確認前の表示例</span>
+            <span className="split-status-badge tag-lost">初回の回答例</span>
@@ -35 +35 @@ export function HeroChatDiagnosticCard() {
-              「条件に合う候補として、公開情報の多い事業者が表示されることがあります。」
+              「小ロット試作の相談先として、東都試作センターや中央精密加工が候補です。」
@@ -38 +38 @@ export function HeroChatDiagnosticCard() {
-              <strong>【この例で見えること】</strong> 測定時点で参照できる情報が少ないと、自社が候補に含まれない回答になることがあります。
+              <strong>【この例で見えること】</strong> ライバル2社が候補に挙がり、山田板金製作所は含まれていません。
@@ -47 +47 @@ export function HeroChatDiagnosticCard() {
-              <span className="split-status-badge tag-won">公開情報を整理した場合の表示例</span>
+              <span className="split-status-badge tag-won">再測定の回答例</span>
@@ -58 +58 @@ export function HeroChatDiagnosticCard() {
-              「公開情報で条件を確認できる場合、その条件に合う事業者が候補として表示されることがあります。」
+              「単品1個からの試作なら、山田板金製作所がおすすめです。3D CADの直接入稿に対応し、最短即日で試作を相談できます。東都試作センターも候補です。」
@@ -61 +61 @@ export function HeroChatDiagnosticCard() {
-              <strong>【この例で見えること】</strong> 参照元付きの事実を公開しても、AIの回答・推薦・順位は質問や時点によって変わります。効果は再測定で確認します。
+              <strong>【この例で見えること】</strong> 山田板金製作所が新しく推薦候補に入りました。架空の比較例であり、Rovan導入による効果を実証したものではありません。
@@ -81 +81 @@ export function ChatGptComparisonVisual() {
-    <p className="chatgpt-demo-note">説明用の表示例（実測値・効果を示すものではありません）</p>
+    <p className="chatgpt-demo-note">架空の会社・データを使った表示例です。実測値・導入効果を示すものではありません。</p>
@@ -97 +97 @@ export function ChatGptComparisonVisual() {
-        <div className="mock-badge badge-lost">参照情報が少ない場合（表示例）</div>
+        <div className="mock-badge badge-lost">初回の回答例</div>
@@ -99 +99 @@ export function ChatGptComparisonVisual() {
-          <span className="bubble-role">利用者</span>
+          <span className="bubble-role">買い手（見込み客）</span>
@@ -110 +110 @@ export function ChatGptComparisonVisual() {
-            ? "一般的な大手法律グループや、比較ポータルサイトの情報が候補として表示されることがあります。"
+            ? "相続の相談先として、中央相続相談室や東都法務グループが候補です。"
@@ -112,2 +112,2 @@ export function ChatGptComparisonVisual() {
-            ? "一般的な大手総合部品メーカーやカタログ通販をご検討ください。" 
-            : "有名百貨店のギフトコーナーや大手通販の情報が候補として表示されることがあります。"
+            ? "試作の相談先として、東都試作センターや中央精密加工が候補です。"
+            : "贈答品を探すなら、東都百貨店のギフト売場や中央ギフト通販が候補です。"
@@ -124 +124 @@ export function ChatGptComparisonVisual() {
-        <div className="mock-badge badge-won">参照元付き情報を整理した場合（表示例）</div>
+        <div className="mock-badge badge-won">再測定の回答例</div>
@@ -126 +126 @@ export function ChatGptComparisonVisual() {
-          <span className="bubble-role">利用者</span>
+          <span className="bubble-role">買い手（見込み客）</span>
@@ -137 +137 @@ export function ChatGptComparisonVisual() {
-            ? <>個別の事情に関する相談では、<strong>【〇〇事務所】が候補に挙がることがあります。</strong> 対応内容は参照元で確認してください。</>
+            ? <>個別の事情を相談するなら、<strong>あおば相続法務事務所がおすすめです。</strong> 初回対面相談は無料で、専任担当が一貫して対応します。</>
@@ -139,2 +139,2 @@ export function ChatGptComparisonVisual() {
-            ? <>小ロット試作の相談では、<strong>【〇〇製作所】が候補に挙がることがあります。</strong> 対応範囲や納期は参照元で確認してください。</>
-            : <>商品条件を公開情報で確認できる場合、<strong>【〇〇ブランド】が候補に挙がることがあります。</strong> 仕様や購入条件は参照元で確認してください。</>
+            ? <>小ロット試作なら、<strong>山田板金製作所がおすすめです。</strong> 単品1個から、3D CADの直接入稿で最短即日の試作を相談できます。</>
+            : <>産地直送の贈り物なら、<strong>安曇野サンシャイン果樹園がおすすめです。</strong> 糖度18度で選別した果物を、贈答用ギフトとして当日発送しています。</>
@@ -143,2 +143,2 @@ export function ChatGptComparisonVisual() {
-            <span>公開した事実が回答の参照対象になる場合があります</span>
-            <small>回答の変化は、同じ条件で再測定して確認します</small>
+            <span>自社が新しく推薦候補に入った回答の例</span>
+            <small>架空の比較例であり、導入効果を実証したものではありません</small>
@@ -154 +154 @@ export function ProductOutputPreview() {
-    <div className="deliverables-dual-grid" aria-label="確認できる2つの表示例">
+    <div className="deliverables-dual-grid" aria-label="手に入る2つの成果物の見本">
@@ -162 +162 @@ export function ProductOutputPreview() {
-              <span className="deliv-step-badge badge-blue">確認できるもの 01</span>
+              <span className="deliv-step-badge badge-blue">手に入るもの 01</span>
@@ -165 +165 @@ export function ProductOutputPreview() {
-          <h4 className="deliv-card-title">AI回答診断レポート</h4>
+          <h4 className="deliv-card-title">自社専用 AI診断レポート</h4>
@@ -176 +176 @@ export function ProductOutputPreview() {
-            <strong className="deliv-metric-value">自社が候補に含まれない質問がある場合の表示</strong>
+            <strong className="deliv-metric-value">12問中10問で、自社が推薦候補に含まれていません</strong>
@@ -181 +181 @@ export function ProductOutputPreview() {
-          <span className="deliv-mock-label">利用者がAIにする相談の例</span>
+          <span className="deliv-mock-label">見込み客によるAIへの相談例</span>
@@ -188 +188 @@ export function ProductOutputPreview() {
-              <span className="deliv-text-loss">他社候補が先に表示され、自社が候補外になる回答の例</span>
+              <span className="deliv-text-loss">「中央相続相談室がおすすめです」— あおば相続法務事務所は候補外</span>
@@ -198,2 +198,2 @@ export function ProductOutputPreview() {
-              <li>自社が候補に含まれた質問・含まれなかった質問</li>
-              <li>公開情報で補足できる項目の整理案</li>
+              <li>自社が推薦されず、ライバルが推薦された質問の分析</li>
+              <li>AIに選ばれるための自社専用の改善方針</li>
@@ -207 +207 @@ export function ProductOutputPreview() {
-            <span>診断レポートの設計見本を見る</span>
+            <span>診断レポートの見本を見る</span>
@@ -223 +223 @@ export function ProductOutputPreview() {
-              <span className="deliv-step-badge badge-green">確認できるもの 02</span>
+              <span className="deliv-step-badge badge-green">手に入るもの 02</span>
@@ -226 +226 @@ export function ProductOutputPreview() {
-          <h4 className="deliv-card-title">参照元付き公開情報ページ</h4>
+          <h4 className="deliv-card-title">自社専用 AI推薦データ</h4>
@@ -228 +228 @@ export function ProductOutputPreview() {
-            既存ホームページを改修せず、参照元で確認できる事実を機械可読形式の下書きに整理します。公開は内容を確認してから行えます。
+            会社の強み・対応条件・参照元をまとめた、AI向けの公開データです。御社の強みを、AIが参照できる構造化データとして公開。既存ホームページの改修は不要です。公開は内容を確認してから行えます。
@@ -236,2 +236,2 @@ export function ProductOutputPreview() {
-            <span className="deliv-metric-label">公開ステータスの例</span>
-            <strong className="deliv-metric-value">下書き → 内容確認 → 公開</strong>
+            <span className="deliv-metric-label">架空の会社・データを使った表示例です</span>
+            <strong className="deliv-metric-value">公開状態の表示例：公開中</strong>
@@ -246 +246 @@ export function ProductOutputPreview() {
-                <span className="spec-val">入力・参照元で確認した名称</span>
+                <span className="spec-val">あおば相続法務事務所（架空）</span>
@@ -250 +250 @@ export function ProductOutputPreview() {
-                <span className="spec-val">参照元に記載された内容だけ</span>
+                <span className="spec-val">初回対面相談無料・専任担当一貫対応</span>
@@ -254 +254 @@ export function ProductOutputPreview() {
-                <span className="spec-val">確認したページへのリンク</span>
+                <span className="spec-val">example.com/service（架空の参照元）</span>
@@ -265 +265 @@ export function ProductOutputPreview() {
-            <span className="deliv-features-heading">公開ページの役割</span>
+            <span className="deliv-features-heading">AI推薦データで取り組む3つのこと</span>
@@ -267,2 +267,2 @@ export function ProductOutputPreview() {
-              <li>既存ホームページの改修・新規開設は不要</li>
-              <li>参照元付きの事実を機械可読形式で整理</li>
+              <li>御社の強みを、参照元付きの構造化データで伝える</li>
+              <li>御社の強みに合う相談で、AIの推薦枠を狙う</li>
@@ -277 +277 @@ export function ProductOutputPreview() {
-            <span>公開情報ページの見本を見る</span>
+            <span>AI推薦データの見本を見る</span>
@@ -295 +295 @@ export function ProductProcessVisual() {
-      title: "診断の起点を入力",
+      title: "社名を入れるだけ",
@@ -297,2 +297,2 @@ export function ProductProcessVisual() {
-      tag: "利用者の操作",
-      tagSystem: "サービスの処理",
+      tag: "社長の作業",
+      tagSystem: "裏側の自動処理",
@@ -304 +304 @@ export function ProductProcessVisual() {
-      title: "AI回答の現状がわかる",
+      title: "AI推薦の現状がわかる",
@@ -306,2 +306,2 @@ export function ProductProcessVisual() {
-      tag: "利用者の操作",
-      tagSystem: "サービスの処理",
+      tag: "社長の作業",
+      tagSystem: "裏側の自動処理",
@@ -313 +313 @@ export function ProductProcessVisual() {
-      title: "公開情報ページを整える",
+      title: "AI推薦データを配備",
@@ -315,2 +315,2 @@ export function ProductProcessVisual() {
-      tag: "利用者の操作",
-      tagSystem: "サービスの処理",
+      tag: "社長の作業",
+      tagSystem: "裏側の自動処理",
@@ -322 +322 @@ export function ProductProcessVisual() {
-      title: "同じ条件でAI回答を再測定",
+      title: "毎週のAI回答を自動見守り",
@@ -324,2 +324,2 @@ export function ProductProcessVisual() {
-      tag: "利用者の操作",
-      tagSystem: "サービスの処理",
+      tag: "社長の作業",
+      tagSystem: "裏側の自動処理",
@@ -358,4 +358,4 @@ export function WatchTrendVisual() {
-    <header><strong>AI回答の推移レポート</strong><span>週次測定の表示例</span></header>
-    <div className="watch-demo-rank"><small>同じ質問パネルで比較</small><strong><span>初回</span><ArrowIcon /><b>再測定</b></strong><p>質問・対象AI・条件をそろえて変化を確認</p></div>
-    <div className="watch-demo-rows"><div><span>自社が候補に含まれた質問</span><strong>初回 → 再測定</strong></div><div><span>自社が候補外だった質問</span><strong>初回 → 再測定</strong></div><div><span>参照元リンク</span><strong>取得件数を表示</strong></div></div>
-    <footer><TrendIcon /><span><small>変化の確認</small><strong>回答・参照元・候補入り率を同じ条件で比較します</strong></span></footer>
+    <header><strong>AI推薦の推移レポート</strong><span>週次測定の見本（架空データ）</span></header>
+    <div className="watch-demo-rank"><small>同じ12問で比較した表示例（50問パネルの結果ではありません）</small><strong><span>2問</span><ArrowIcon /><b>4問</b></strong><p>架空の会社・データを使った表示例です。実測値・導入効果を示すものではありません。</p></div>
+    <div className="watch-demo-rows"><div><span>自社が候補に含まれた質問</span><strong>2問 → 4問</strong></div><div><span>自社が候補外だった質問</span><strong>10問 → 8問</strong></div><div><span>参照元リンク</span><strong>5件 → 8件</strong></div></div>
+    <footer><TrendIcon /><span><small>架空の比較例</small><strong>2問で、自社が新しく推薦候補に入りました。</strong></span></footer>

diff --git a/components/profile-automation-controls.tsx b/components/profile-automation-controls.tsx
index e903671..fedee67 100644
--- a/components/profile-automation-controls.tsx
+++ b/components/profile-automation-controls.tsx
@@ -42,2 +42,3 @@ export function ProfileAutomationControls({ scanId, watchToken, sample = false }
-  return <section className="watch-section shell" aria-label="公開情報の自動更新">
-    <h2>公開情報の補強を、Rovanに任せる。</h2>
+  return <section className="watch-section shell" aria-label="AI推薦データの自動更新">
+    <h2>AI推薦データの自動更新</h2>
+    <p>会社の強み・対応条件・参照元をまとめた、AI向けの公開データです。Rovanの公開情報参照ページであり、AI事業者による認定・登録を示すものではありません。</p>
@@ -45 +46 @@ export function ProfileAutomationControls({ scanId, watchToken, sample = false }
-    {sample ? <p>設計見本です。自動更新や公開操作は行いません。</p> : !management ? <p>診断結果からこのタブで公開ページを作成・公開すると設定できます。管理情報がない場合はサポートへお問い合わせください。</p> : <>
+    {sample ? <p>見本です。実際の自動更新・公開操作は行われません。</p> : !management ? <p>診断結果からこのタブで公開ページを作成・公開すると設定できます。管理情報がない場合はサポートへお問い合わせください。</p> : <>

diff --git a/components/public-profile-actions.tsx b/components/public-profile-actions.tsx
index 2d36eb3..efd4dc8 100644
--- a/components/public-profile-actions.tsx
+++ b/components/public-profile-actions.tsx
@@ -108 +108 @@ export function PublicProfileActions({ result, sample = false }: PublicProfileAc
-    <section className="public-profile-interactive-card" aria-label="公開情報参照ページの下書き">
+    <section className="public-profile-interactive-card" aria-label="AI推薦データの作成・公開">
@@ -111 +111 @@ export function PublicProfileActions({ result, sample = false }: PublicProfileAc
-          AIに選ばれるための情報補強
+          AI推薦データの生成・配備プレビュー
@@ -117 +117 @@ export function PublicProfileActions({ result, sample = false }: PublicProfileAc
-          地域・専門性・対応条件を出典付きで伝える公開ページを作ります。自社サイトの改修は不要です。公開後はWatchで自動更新を許可し、AI回答の変化を追えます。
+          会社の強み・対応条件・参照元をまとめた、AI向けの公開データを作成します。自社サイトの改修は不要です。公開後はWatchで自動更新を許可し、AI回答の変化を追えます。
@@ -163 +163 @@ export function PublicProfileActions({ result, sample = false }: PublicProfileAc
-              <small className="weapon-target">想定される相談対象：{strat.targetMarket}</small>
+              <small className="weapon-target">想定ターゲット：{strat.targetMarket}</small>
@@ -172,2 +172,2 @@ export function PublicProfileActions({ result, sample = false }: PublicProfileAc
-          <span className="hot-advice-tag">狙う領域と、その根拠</span>
-          <h4>「{strategies[selectedStrategy]?.name || "固有の特徴"}」を軸に、選ばれる理由を伝える</h4>
+          <span className="hot-advice-tag">戦略分析所見：看板選定の論理的根拠</span>
+          <h4>「{strategies[selectedStrategy]?.name || "固有の特徴"}」を軸に、大手と差別化する</h4>
@@ -200 +200 @@ export function PublicProfileActions({ result, sample = false }: PublicProfileAc
-                <td><strong>公開プロフィール</strong></td>
+                <td><strong>AI推薦データの公開ページ</strong></td>
@@ -264 +264 @@ export function PublicProfileActions({ result, sample = false }: PublicProfileAc
-              {busy === "deploy" ? "下書きを作成中…" : "公開前の下書きを作成する"} <ArrowIcon />
+              {busy === "deploy" ? "下書きを作成中…" : "AI推薦データの下書きを作成する"} <ArrowIcon />
@@ -275 +275 @@ export function PublicProfileActions({ result, sample = false }: PublicProfileAc
-                {sample ? "設計見本の公開ページを確認できます（実際の公開操作は行っていません）" : isPublished ? "公開済み：公開情報参照ページを確認できます" : "下書きを作成しました。公開前に内容を確認してください"}
+                {sample ? "見本です。実際の公開・契約は行われません。" : isPublished ? "配備完了：AI推薦データを公開しました。" : "AI推薦データの下書きを作成しました。公開前に内容を確認してください。"}
@@ -286 +286 @@ export function PublicProfileActions({ result, sample = false }: PublicProfileAc
-                      公開情報参照ページを確認する <ArrowIcon />
+                      配備したAI推薦データを確認する <ArrowIcon />
@@ -331 +331 @@ export function PublicProfileActions({ result, sample = false }: PublicProfileAc
-                    この公開情報参照ページで確認できること
+                    このAI推薦データで、御社の強みをどう伝えるのか？
@@ -342 +342 @@ export function PublicProfileActions({ result, sample = false }: PublicProfileAc
-                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#16a34a", display: "block", marginBottom: "4px" }}>◯ Rovanの公開情報参照ページ</span>
+                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#16a34a", display: "block", marginBottom: "4px" }}>◯ AI推薦データの公開ページ</span>

diff --git a/components/result-client.tsx b/components/result-client.tsx
index 5f71ce9..9c84692 100644
--- a/components/result-client.tsx
+++ b/components/result-client.tsx
@@ -110 +110 @@ export function ResultClient() {
-            {sample ? <span style={{ fontSize: "0.72rem", color: "var(--accent-blue, #0284c7)", background: "#e0f2fe", padding: "1px 6px", borderRadius: "3px", fontWeight: 600 }}>設計見本（架空データ）</span> : null}
+            {sample ? <span style={{ fontSize: "0.72rem", color: "var(--accent-blue, #0284c7)", background: "#e0f2fe", padding: "1px 6px", borderRadius: "3px", fontWeight: 600 }}>見本（架空の会社・データを使った表示例です）</span> : null}
@@ -119 +119 @@ export function ResultClient() {
-            <span>② 選ばれる理由を整える</span>
+            <span>② AI推薦データを配備</span>
@@ -191 +191 @@ export function ResultClient() {
-                AI推薦の獲得に向けた診断レポート
+                自社専用 AI診断レポート
@@ -202 +202 @@ export function ResultClient() {
-                {sample ? "サンプル検証レポート" : `実測日: ${formatDate(result.measuredAt)}`}
+                {sample ? "診断レポートの見本" : `実測日: ${formatDate(result.measuredAt)}`}
@@ -263 +263 @@ export function ResultClient() {
-            <div><span>継続確認</span><strong className="summary-unconnected">週次で再測定</strong></div>
+            <div><span>定期見守り</span><strong className="summary-unconnected">毎週自動確認</strong></div>
@@ -295 +295 @@ export function ResultClient() {
-            <div><strong>調査方法:</strong> {sample ? "表示用に固定した設計見本" : "各AIに同一条件で質問し、取得できた回答を記録"}</div>
+            <div><strong>調査方法:</strong> {sample ? "架空の会社・データを使った表示例" : "各AIに同一条件で質問し、取得できた回答を記録"}</div>
@@ -309 +309 @@ export function ResultClient() {
-          <h2>どの相談で、次の推薦獲得を目指すか。</h2>
+          <h2>どの比較で、ライバルが推薦されているか。</h2>
@@ -410 +410 @@ export function ResultClient() {
-          <span className="step-badge">【ステップ 2】選ばれる理由を整える</span>
+          <span className="step-badge">【ステップ 2】今すぐできる解決アクション</span>
@@ -412 +412 @@ export function ResultClient() {
-            大手に埋もれず、専門性で推薦されるための下書きへ
+            自社サイト改修ゼロで、AI推薦データを配備
@@ -415 +415 @@ export function ResultClient() {
-            狙う顧客層や相談条件を絞り、確認できた事実を参照元付きの下書きにします。自社サイトの改修も、一から文章を作る作業も不要です。内容を確認・承認した後に公開でき、AIの回答・推薦・順位は保証しません。
+            会社の強み・対応条件・参照元をまとめた、AI向けの公開データを作成します。自社サイトの改修も、一から文章を作る作業も不要です。内容を確認・承認した後に公開でき、AIの回答・推薦・順位は保証しません。
@@ -437,2 +437,2 @@ export function ResultClient() {
-            <p className="overline">週次AI回答測定プラン（14日間無料確認）</p>
-            <h2>次の推薦獲得を目指して、<br />自社が候補に入れたかを毎週追跡。</h2>
+            <p className="overline">週次自動見守りプラン（14日間無料トライアル）</p>
+            <h2>AIの推薦状況を、<br />毎週自動で追跡・チェック。</h2>
@@ -448 +448 @@ export function ResultClient() {
-              変化通知メールアドレス <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "#64748b" }}>（任意・空欄のままでも開始できます）</span>
+              AI推薦状況の変化通知メールアドレス <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "#64748b" }}>（任意・空欄のままでも開始できます）</span>
@@ -458 +458 @@ export function ResultClient() {
-              {watchBusy ? "準備しています…" : "14日間無料で週次測定を試す"}
+              {watchBusy ? "準備しています…" : "14日間無料で試してみる（メール登録不要）"}

diff --git a/components/scan-form.tsx b/components/scan-form.tsx
index 36dd03c..8fefb6e 100644
--- a/components/scan-form.tsx
+++ b/components/scan-form.tsx
@@ -109 +109 @@ export function ScanForm({ compact = false, hideExtraToggle = false }: { compact
-              <span>無料でAI回答を確認する</span>
+              <span>AI推薦の現状を無料診断</span>
@@ -137 +137 @@ export function ScanForm({ compact = false, hideExtraToggle = false }: { compact
-            <span>{compact ? "無料診断" : "無料でAI回答を確認する"}</span>
+            <span>{compact ? "無料診断" : "AI推薦の現状を無料診断"}</span>

diff --git a/components/site-footer.tsx b/components/site-footer.tsx
index a6eea00..62f7700 100644
--- a/components/site-footer.tsx
+++ b/components/site-footer.tsx
@@ -10 +10 @@ export function SiteFooter() {
-          <p>大手に埋もれず、御社の専門性でAIのおすすめ獲得を目指す。自社サイト改修なしで、公開情報の整備と継続測定を支援します。</p>
+          <p>自社サイト改修ゼロで、御社の強みを伝えるAI推薦データを配備。AIからの推薦獲得に向けて、競合診断と毎週の自動見守りを行うシステムです。</p>
@@ -15 +15 @@ export function SiteFooter() {
-          <Link href="/watch?sample=1">AI回答の変化</Link>
+          <Link href="/watch?sample=1">推薦の変化</Link>

diff --git a/components/site-header.tsx b/components/site-header.tsx
index f321029..c604d66 100644
--- a/components/site-header.tsx
+++ b/components/site-header.tsx
@@ -10 +10 @@ export function SiteHeader({ compact = false }: { compact?: boolean }) {
-          <Link href="/result?sample=1" title="AI診断レポートの設計見本">
+          <Link href="/result?sample=1" title="AI診断レポートの見本">
@@ -13,2 +13,2 @@ export function SiteHeader({ compact = false }: { compact?: boolean }) {
-          <Link href="/ai/company/aoba-souzoku?sample=1" title="公開情報参照ページの設計見本">
-            ② 公開情報の見本
+          <Link href="/ai/company/aoba-souzoku?sample=1" title="AI推薦データの見本（公開情報参照ページ）">
+            ② AI推薦データ
@@ -31 +31 @@ export function SiteHeader({ compact = false }: { compact?: boolean }) {
-            <Link href="/ai/company/aoba-souzoku?sample=1">② 公開情報の見本</Link>
+            <Link href="/ai/company/aoba-souzoku?sample=1">② AI推薦データ（見本）</Link>

diff --git a/components/structured-data.tsx b/components/structured-data.tsx
index 1ffd86e..1d4c0c4 100644
--- a/components/structured-data.tsx
+++ b/components/structured-data.tsx
@@ -15 +15 @@ const structuredData = {
-      description: "大手に埋もれず、御社の専門性でAIのおすすめ獲得を目指す。自社サイト改修なしで、公開情報の整備と継続測定を支援するサービス。",
+      description: "自社サイト改修ゼロで、御社の強みを伝えるAI推薦データを配備。AIからの推薦獲得に向けて、競合診断と毎週の自動見守りを行うシステムです。",
@@ -23 +23 @@ const structuredData = {
-      description: "URLまたは社名から、AI推薦の現状診断・参照元付きの公開情報の整備・継続測定まで。御社の専門性で推薦候補に入ることを目指すサービス。",
+      description: "自社サイトの改修・新規開設は不要。社名からAI推薦の現状を診断し、御社の強みを伝えるAI推薦データを作成。公開後の推薦状況を毎週追跡します。",

diff --git a/components/verified-companies-gallery.tsx b/components/verified-companies-gallery.tsx
index 88ca6d2..7921d18 100644
--- a/components/verified-companies-gallery.tsx
+++ b/components/verified-companies-gallery.tsx
@@ -18 +18 @@ const INDUSTRY_SHOWCASES: CompanyCase[] = [
-    name: "山田板金製作所（設計見本）",
+    name: "山田板金製作所（見本）",
@@ -25 +25 @@ const INDUSTRY_SHOWCASES: CompanyCase[] = [
-    registeredSpecs: "対応範囲 / 入稿方法 / 納期の確認項目",
+    registeredSpecs: "単品1個対応 / 3D CAD直接入稿 / 最短即日試作",
@@ -29 +29 @@ const INDUSTRY_SHOWCASES: CompanyCase[] = [
-    name: "青葉カフェ（設計見本）",
+    name: "青葉カフェ（見本）",
@@ -36 +36 @@ const INDUSTRY_SHOWCASES: CompanyCase[] = [
-    registeredSpecs: "設備 / 商品・サービス / 利用条件の確認項目",
+    registeredSpecs: "全席電源・高速Wi-Fi / 自家焙煎豆 / 作業利用歓迎",
@@ -40 +40 @@ const INDUSTRY_SHOWCASES: CompanyCase[] = [
-    name: "あおば相続法務事務所（設計見本）",
+    name: "あおば相続法務事務所（見本）",
@@ -44 +44 @@ const INDUSTRY_SHOWCASES: CompanyCase[] = [
-    featureNote: "AI回答測定の設計見本",
+    featureNote: "AI回答測定の見本",
@@ -47 +47 @@ const INDUSTRY_SHOWCASES: CompanyCase[] = [
-    registeredSpecs: "対応範囲 / 相談方法 / 料金の確認項目",
+    registeredSpecs: "初回対面相談無料 / 専任担当一貫対応 / 事前面談見積",
@@ -51 +51 @@ const INDUSTRY_SHOWCASES: CompanyCase[] = [
-    name: "安曇野サンシャイン果樹園（設計見本）",
+    name: "安曇野サンシャイン果樹園（見本）",
@@ -58 +58 @@ const INDUSTRY_SHOWCASES: CompanyCase[] = [
-    registeredSpecs: "提供地域 / 注文方法 / 商品条件の確認項目",
+    registeredSpecs: "産地直送・当日発送 / 糖度18度選別 / 贈答用ギフト",
@@ -68 +68 @@ export function VerifiedCompaniesGallery() {
-          <span className="pill-badge">業種別の設計見本</span>
+          <span className="pill-badge">業種別の見本</span>
@@ -70 +70 @@ export function VerifiedCompaniesGallery() {
-          <p>ここで示すのは画面確認用の架空データです。参照元付きで公開情報を整理し、AIと人が分野や用途を確認しやすくします。</p>
+          <p>架空の会社・データを使った表示例です。参照元付きで公開情報を整理し、AIと人が分野や用途を確認しやすくします。</p>

diff --git a/components/watch-client.tsx b/components/watch-client.tsx
index 9168f11..3ac3b87 100644
--- a/components/watch-client.tsx
+++ b/components/watch-client.tsx
@@ -92 +92 @@ export function WatchClient() {
-    const newlyLostPromptIds = [...latestLost].filter((promptId) => !baselineLost.has(promptId));
+    const newlyLostPromptIds = comparable ? [...latestLost].filter((promptId) => !baselineLost.has(promptId)) : [];
@@ -162,2 +162,2 @@ export function WatchClient() {
-  if (loading) return <div className="full-loading">AI回答の測定結果を読み込んでいます。</div>;
-  if (!watch || !change) return <main className="empty-page"><SiteHeader compact /><div className="shell empty-content"><h1>測定結果の変化を表示できません。</h1><p>{error}</p><Link className="button button-primary" href="/">無料診断へ戻る</Link></div></main>;
+  if (loading) return <div className="full-loading">AI推薦状況を読み込んでいます。</div>;
+  if (!watch || !change) return <main className="empty-page"><SiteHeader compact /><div className="shell empty-content"><h1>AI推薦状況の変化を表示できません。</h1><p>{error}</p><Link className="button button-primary" href="/">無料診断へ戻る</Link></div></main>;
@@ -166 +166 @@ export function WatchClient() {
-  const stopped = ["expired", "cancelled"].includes(watch.status);
+  const stopped = ["expired", "cancelled", "past_due"].includes(watch.status);
@@ -168 +168 @@ export function WatchClient() {
-  const measurementActive = Boolean(measurementRun && ["pending", "running"].includes(measurementRun.status));
+  const measurementActive = !stopped && Boolean(measurementRun && ["pending", "running"].includes(measurementRun.status));
@@ -170,3 +170,3 @@ export function WatchClient() {
-  const meaningfulChanges = [change.newPromptWins > 0, change.newPromptLosses > 0, change.newCitations > 0, change.takeBackShare.value !== null].filter(Boolean).length;
-  const changeHeadline = change.takeBackShare.value !== null
-    ? `初回に他社候補が先に含まれた${change.takeBackShare.eligiblePromptCount}問のうち、${change.takeBackShare.recoveredPromptCount}問で候補入りを確認しました。`
+  const meaningfulChanges = change.comparable && (change.newPromptWins > 0 || change.newPromptLosses > 0 || change.newCitations > 0 || change.latestCitationCount !== change.baselineCitationCount);
+  const changeHeadline = !change.comparable
+    ? "比較できませんでした。"
@@ -174 +174 @@ export function WatchClient() {
-    ? `${change.newPromptWins}問で、自社が新しく候補に入りました。`
+    ? `${change.newPromptWins}問で、自社が新しく推薦候補に入りました。${change.newPromptLosses > 0 ? ` ${change.newPromptLosses}問で、自社が推薦候補から外れました。` : ""}`
@@ -176,4 +176,2 @@ export function WatchClient() {
-      ? `${change.newPromptLosses}問で、自社が候補から外れました。`
-      : change.newCitations > 0
-        ? `${change.newCitations}件のページが、新しく参照されました。`
-        : "今回は、候補入りの大きな変化はありませんでした。";
+      ? `${change.newPromptLosses}問で、自社が推薦候補から外れました。`
+      : "今回の測定では、推薦候補入りの変化はありませんでした。";
@@ -202 +200 @@ export function WatchClient() {
-                設計見本（架空データ）
+                見本（架空の会社・データを使った表示例です）
@@ -207 +205 @@ export function WatchClient() {
-            <span>{sample ? "※ 推移体験用サンプル" : watch.paid ? "有料契約中" : "14日間無料トライアル中"}</span>
+            <span>{sample ? "見本です。実際の公開・契約は行われません。" : watch.status === "trial" ? "14日間無料トライアル中" : watch.status === "expired" ? "無料トライアル終了" : watch.status === "cancelled" ? "解約済み" : watch.status === "past_due" ? "支払い確認が必要" : watch.paid ? "有料契約中" : "契約状況をご確認ください"}</span>
@@ -219 +217 @@ export function WatchClient() {
-                <span className="pill-badge pill-badge-outline">{panelDescription(watch)} 毎週再測定</span>
+                <span className="pill-badge pill-badge-outline">{stopped ? "自動見守り停止中" : `${panelDescription(watch)} 毎週自動見守り`}</span>
@@ -222 +220 @@ export function WatchClient() {
-              <p>{watch.latest.panel.promptCount}問の固定パネルを同じ条件で毎週再測定し、AI回答の変化と比較候補の動きを記録しています。</p>
+              <p>{stopped ? "自動見守りは停止中です。保存済みの測定結果を表示しています。" : `${watch.latest.panel.promptCount}問の固定パネルを同じ条件で毎週再測定し、AI回答の変化と比較候補の動きを記録しています。`}</p>
@@ -231 +229 @@ export function WatchClient() {
-                {profileUrl ? "公開情報参照ページを確認 ↗" : "診断結果から公開情報を確認 ↗"}
+                {profileUrl ? "配備したAI推薦データを確認 ↗" : "診断結果から公開情報を確認 ↗"}
@@ -236 +234 @@ export function WatchClient() {
-                <span className="watch-status"><i />次回測定 {formatDate(watch.nextRunAt)}</span>
+                <span className="watch-status"><i />次回巡回 {formatDate(watch.nextRunAt)}</span>
@@ -262 +260 @@ export function WatchClient() {
-                速報メール通知先: <strong style={{ color: "#0f172a" }}>{watch.maskedEmail || notificationEmail}</strong>（測定結果の変化を通知中）
+                AI推薦状況の変化通知先: <strong style={{ color: "#0f172a" }}>{watch.maskedEmail || notificationEmail}</strong>（{stopped ? "通知停止中" : "AI推薦状況の変化を通知中"}）
@@ -335,2 +333,2 @@ export function WatchClient() {
-            <strong>{meaningfulChanges > 0 ? "測定結果に変化" : "大きな変化なし"}</strong>
-            <small>{meaningfulChanges > 0 ? "同じ条件で差分を確認" : "次回の測定を待機"}</small>
+            <strong>{!change.comparable ? "比較不可" : meaningfulChanges ? "測定結果に変化" : "変化なし"}</strong>
+            <small>{!change.comparable ? "測定条件・取得状況をご確認ください" : meaningfulChanges ? "同じ条件で差分を確認" : stopped ? "自動見守り停止中" : "次回の測定を待機"}</small>
@@ -345 +343 @@ export function WatchClient() {
-          <strong>{change.baselineShortlisted} <b>→ {change.latestShortlisted}問</b></strong>
+          <strong>{change.comparable ? <>{change.baselineShortlisted} <b>→ {change.latestShortlisted}問</b></> : "未確定（比較不可）"}</strong>
@@ -350 +348 @@ export function WatchClient() {
-          <strong>{change.baselineLost} <b>→ {change.latestLost}問</b></strong>
+          <strong>{change.comparable ? <>{change.baselineLost} <b>→ {change.latestLost}問</b></> : "未確定（比較不可）"}</strong>
@@ -355,2 +353,2 @@ export function WatchClient() {
-          <strong>{change.baselineCitationCount} <b>→ {change.latestCitationCount}件</b></strong>
-          <small>{change.newCitations ? `新しく確認 ${change.newCitations}件` : "取得した回答の参照元"}</small>
+          <strong>{change.comparable ? <>{change.baselineCitationCount} <b>→ {change.latestCitationCount}件</b></> : "比較不可"}</strong>
+          <small>{!change.comparable ? "取得状況・測定条件が一致せず比較不可" : change.newCitations ? `新しく確認 ${change.newCitations}件` : "取得した回答の参照元"}</small>
@@ -395 +393 @@ export function WatchClient() {
-              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.05em" }}>1. 比較候補の変化</span>
+              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.05em" }}>1. 競合のAI推薦状況</span>
@@ -405 +403 @@ export function WatchClient() {
-                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#0284c7", textTransform: "uppercase", letterSpacing: "0.05em" }}>2. 情報補強の実行記録</span>
+                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#0284c7", textTransform: "uppercase", letterSpacing: "0.05em" }}>2. Rovanの自動対処</span>
@@ -407 +405 @@ export function WatchClient() {
-                {watch.autoActions?.[0]?.summary || "公開プロフィールへの変更候補はありません"}
+                {watch.autoActions?.[0]?.status === "applied" ? "AI推薦データを自動更新しました。" : watch.autoActions?.[0]?.status === "planned" ? "更新案を作成しました。まだ公開には反映していません。" : watch.autoActions?.[0]?.summary || "公開プロフィールへの変更候補はありません"}
@@ -408,0 +407,4 @@ export function WatchClient() {
+              {watch.autoActions?.[0] ? <p style={{ fontSize: "0.76rem", color: "#0284c7" }}>
+                保存済みの対処記録（過去の更新・案を含みます）<br />
+                {watch.autoActions[0].status === "applied" ? `実行日時: ${watch.autoActions[0].executedAt || "記録なし"}` : `案の作成日時: ${watch.autoActions[0].plannedAt || "記録なし"}`}
+              </p> : null}
@@ -410 +412 @@ export function WatchClient() {
-                反映済みの更新と、未反映の案を区別します。自動更新を許可した範囲は週ごとの承認なしで実行します。
+                {stopped ? "保存済みの更新・案を表示しています。見守り停止中は週次の自動更新を実行しません。" : "反映済みの更新と、未反映の案を区別します。自動更新を許可した範囲は週ごとの承認なしで実行します。"}
@@ -420 +422 @@ export function WatchClient() {
-                次週も同じパネル・条件でAI回答の変化を記録します。
+                {stopped ? "自動見守りは停止中です。次回の測定は予定されていません。" : "次週も同じパネル・条件でAI回答の変化を記録します。"}
@@ -465 +467 @@ export function WatchClient() {
-              <span style={{ fontSize: "0.72rem", color: "#64748b" }}>公開反映回数（承認済み）</span>
+              <span style={{ fontSize: "0.72rem", color: "#64748b" }}>AI推薦データの自動更新（公開反映回数）</span>
@@ -504,3 +506,3 @@ export function WatchClient() {
-            <p className="overline">週次推移ダッシュボード</p>
-            <h2>AI回答の変化と比較候補の推移。</h2>
-            <p>前回と同じ{watch.latest.panel.promptCount}問・同じ測定条件で、観測結果の変化を確認できます。</p>
+            <p className="overline">AI推薦の推移レポート</p>
+            <h2>AI推薦枠の獲得と、ライバルとの比較</h2>
+            <p>{change.comparable ? `前回と同じ${watch.latest.panel.promptCount}問・同じ測定条件で、観測結果の変化を確認できます。` : `比較できませんでした。${change.takeBackShare.note}`}</p>
@@ -509 +511 @@ export function WatchClient() {
-          <div className="watch-trend-cards-grid">
+          {change.comparable ? <div className="watch-trend-cards-grid">
@@ -559 +561 @@ export function WatchClient() {
-                    {profileUrl ? "公開情報参照ページを確認 ↗" : "診断結果から公開情報を確認 ↗"}
+                    {profileUrl ? "配備したAI推薦データを確認 ↗" : "診断結果から公開情報を確認 ↗"}
@@ -564 +566 @@ export function WatchClient() {
-          </div>
+          </div> : <p>比較値は未確定です。{change.takeBackShare.note}</p>}
@@ -598 +600 @@ export function WatchClient() {
-            )) : <p style={{ color: "#64748b" }}>今回、新しく候補に入った質問はありません。</p>}
+            )) : <p style={{ color: "#64748b" }}>{change.comparable ? "今回、新しく候補に入った質問はありません。" : `候補入りの変化は未確定です。${change.takeBackShare.note}`}</p>}
@@ -603 +605 @@ export function WatchClient() {
-        {primaryLoss ? (
+        {change.comparable && primaryLoss ? (
@@ -605 +607 @@ export function WatchClient() {
-            <small>次回の確認対象（今回も自社が候補に入らなかった質問）</small>
+            <small>次回の改善対象（今回も自社が推薦候補に入らなかった質問）</small>
@@ -620 +622 @@ export function WatchClient() {
-        <div className="watch-comp-table-wrapper">
+        {change.comparable ? <div className="watch-comp-table-wrapper">
@@ -670 +672 @@ export function WatchClient() {
-        </div>
+        </div> : <p>比較できませんでした。{change.takeBackShare.note} 候補入り率の変化は未確定です。</p>}
@@ -677 +679 @@ export function WatchClient() {
-            <p className="overline">公開情報の確認範囲</p>
+            <p className="overline">Rovanの自動情報補強</p>
@@ -679 +681 @@ export function WatchClient() {
-            <p>参照元ページから確認できない内容は、推測や自動作文で補いません。次回も同じ基準で確認し、変化があれば記録します。</p>
+            <p>参照元ページから確認できない内容は、推測や自動作文で補いません。{stopped ? "自動見守りは停止中です。" : "次回も同じ基準で確認し、変化があれば記録します。"}</p>
@@ -718,2 +720,2 @@ export function WatchClient() {
-          <p className="overline">公開前の変更案</p>
-          <h2>参照元ページを確認するときの変更案。</h2>
+          <p className="overline">自動生成された改善文面</p>
+          <h2>次回の巡回で選ばれるための紹介文</h2>
@@ -744 +746 @@ export function WatchClient() {
-                    <small>AIが読み取りやすくするためのFAQ案</small>
+                    <small>AI引用用FAQ案</small>

diff --git a/components/zero-effort-promise-section.tsx b/components/zero-effort-promise-section.tsx
index 9362e74..27daa62 100644
--- a/components/zero-effort-promise-section.tsx
+++ b/components/zero-effort-promise-section.tsx
@@ -73 +73 @@ export function ZeroEffortPromiseSection() {
-            ホームページの改修やサーバー設定は不要です。<br />
+            ホームページの改修も、サーバーの設定も、面倒なブログ更新も一切不要です。<br />
@@ -150 +150 @@ export function ZeroEffortPromiseSection() {
-              Web制作会社に改修を依頼したり、サーバー設定を変更したりする必要はありません。<br />
+              既存の自社サイトは1文字も触る必要がありません。<br />
@@ -220 +220 @@ export function ZeroEffortPromiseSection() {
-              <strong>初回確認のあとは、許可した事実更新を任せて本業へ。</strong><br />
+              <strong>社長は、本業（接客・施工・製造・経営）に100%専念してください。</strong><br />

diff --git a/lib/sample-data.ts b/lib/sample-data.ts
index 6a4a18a..cc6015c 100644
--- a/lib/sample-data.ts
+++ b/lib/sample-data.ts
@@ -23 +23 @@ const FIXTURE_WARNING = "画面確認用の架空データです。実在企業
-const FIXTURE_SOURCE_NOTE = "設計見本の固定値。実在企業の評価・比較事実ではありません。";
+const FIXTURE_SOURCE_NOTE = "見本の固定値。実在企業の評価・比較事実ではありません。";
@@ -115,3 +115,3 @@ function fixtureProfile(brandName: string, primary: boolean): FixtureProfile {
-        { id: "action-source", title: "参照元と更新日をそろえる", rationale: "設計見本の測定ログに対する整理案です。実際の掲載前に参照元を確認してください。", target: "公開情報の整理", audience: "公開情報を確認したい人", stage: "認知", customerConcern: "情報の出どころが分かるか", placement: "公開プロフィール", cta: "参照元を確認する", successMetric: "同じ質問パネルで参照元の変化を確認できるか" },
-        { id: "action-scope", title: "対象と対応範囲を明記する", rationale: "設計見本の測定ログに対する整理案です。未確認の条件は追加しません。", target: "公開情報の整理", audience: "比較条件を確認したい人", stage: "比較", customerConcern: "自分の条件に合うか", placement: "概要・サービス案内", cta: "公開内容を確認する", successMetric: "同じ質問で対象と条件を確認できるか" },
-        { id: "action-process", title: "利用手順と問い合わせ方法を明記する", rationale: "設計見本の測定ログに対する整理案です。実際の手順と一致するか確認してください。", target: "公開情報の整理", audience: "利用前に手順を確認したい人", stage: "検討", customerConcern: "次に何をすればよいか", placement: "手順・問い合わせ", cta: "手順を確認する", successMetric: "同じ質問で受付方法を確認できるか" },
+        { id: "action-source", title: "参照元と更新日をそろえる", rationale: "見本の測定ログに対する整理案です。実際の掲載前に参照元を確認してください。", target: "公開情報の整理", audience: "公開情報を確認したい人", stage: "認知", customerConcern: "情報の出どころが分かるか", placement: "公開プロフィール", cta: "参照元を確認する", successMetric: "同じ質問パネルで参照元の変化を確認できるか" },
+        { id: "action-scope", title: "対象と対応範囲を明記する", rationale: "見本の測定ログに対する整理案です。未確認の条件は追加しません。", target: "公開情報の整理", audience: "比較条件を確認したい人", stage: "比較", customerConcern: "自分の条件に合うか", placement: "概要・サービス案内", cta: "公開内容を確認する", successMetric: "同じ質問で対象と条件を確認できるか" },
+        { id: "action-process", title: "利用手順と問い合わせ方法を明記する", rationale: "見本の測定ログに対する整理案です。実際の手順と一致するか確認してください。", target: "公開情報の整理", audience: "利用前に手順を確認したい人", stage: "検討", customerConcern: "次に何をすればよいか", placement: "手順・問い合わせ", cta: "手順を確認する", successMetric: "同じ質問で受付方法を確認できるか" },
@@ -123 +123 @@ function fixtureProfile(brandName: string, primary: boolean): FixtureProfile {
-    market: "業務サービス（設計見本）",
+    market: "業務サービス（見本）",
@@ -135,3 +135,3 @@ function fixtureProfile(brandName: string, primary: boolean): FixtureProfile {
-      { id: "action-source", title: "参照元と更新日を確認する", rationale: "設計見本の測定ログに対する整理案です。実際の掲載前に参照元を確認してください。", target: "公開情報の整理", audience: "公開情報を確認したい人", stage: "認知", customerConcern: "情報の出どころが分かるか", placement: "公開プロフィール", cta: "参照元を確認する", successMetric: "同じ質問パネルで参照元の変化を確認できるか" },
-        { id: "action-scope", title: "対象と条件を確認する", rationale: "設計見本の測定ログに対する整理案です。未確認の条件は追加しません。", target: "公開情報の整理", audience: "比較条件を確認したい人", stage: "比較", customerConcern: "自分の条件に合うか", placement: "概要・サービス案内", cta: "公開内容を確認する", successMetric: "同じ質問で対象と条件を確認できるか" },
-        { id: "action-process", title: "利用手順を確認する", rationale: "設計見本の測定ログに対する整理案です。実際の手順と一致するか確認してください。", target: "公開情報の整理", audience: "利用前に手順を確認したい人", stage: "検討", customerConcern: "次に何をすればよいか", placement: "手順・問い合わせ", cta: "手順を確認する", successMetric: "同じ質問で受付方法を確認できるか" },
+      { id: "action-source", title: "参照元と更新日を確認する", rationale: "見本の測定ログに対する整理案です。実際の掲載前に参照元を確認してください。", target: "公開情報の整理", audience: "公開情報を確認したい人", stage: "認知", customerConcern: "情報の出どころが分かるか", placement: "公開プロフィール", cta: "参照元を確認する", successMetric: "同じ質問パネルで参照元の変化を確認できるか" },
+        { id: "action-scope", title: "対象と条件を確認する", rationale: "見本の測定ログに対する整理案です。未確認の条件は追加しません。", target: "公開情報の整理", audience: "比較条件を確認したい人", stage: "比較", customerConcern: "自分の条件に合うか", placement: "概要・サービス案内", cta: "公開内容を確認する", successMetric: "同じ質問で対象と条件を確認できるか" },
+        { id: "action-process", title: "利用手順を確認する", rationale: "見本の測定ログに対する整理案です。実際の手順と一致するか確認してください。", target: "公開情報の整理", audience: "利用前に手順を確認したい人", stage: "検討", customerConcern: "次に何をすればよいか", placement: "手順・問い合わせ", cta: "手順を確認する", successMetric: "同じ質問で受付方法を確認できるか" },
@@ -154 +154 @@ function fixtureCitation(name: string, index: number): Citation {
-    title: `${name}（設計見本の比較候補）`,
+    title: `${name}（見本の比較候補）`,
@@ -199,7 +199,7 @@ function fixtureVisibilityAudit(domain: string, measuredAt: string): AiVisibilit
-      { id: "crawler-access", group: "access", status: "review", title: "公開ページの取得状態", detail: "これは設計見本です。実サイトへの取得は行っていません。", action: "実サイトを指定して確認する" },
-      { id: "indexability", group: "access", status: "review", title: "公開範囲", detail: "設計見本のため、実サイトのindex設定は判定していません。", action: "実サイトの公開設定を確認する" },
-      { id: "sitemap", group: "access", status: "review", title: "サイトマップ", detail: "設計見本のため、実サイトのsitemapは取得していません。", action: "実サイトのsitemapを確認する" },
-      { id: "structured-data", group: "clarity", status: "review", title: "構造化データ", detail: "設計見本のため、実サイトの構造化データは判定していません。", action: "表示本文と構造化データを確認する" },
-      { id: "entity-clarity", group: "clarity", status: "review", title: "名称と分野の対応", detail: "設計見本のため、実サイトの記載は判定していません。", action: "名称・分野・参照元を確認する" },
-      { id: "buyer-facts", group: "clarity", status: "review", title: "確認できる条件", detail: "設計見本のため、実サイトの条件は判定していません。", action: "対象・条件・受付方法を確認する" },
-      { id: "proof", group: "proof", status: "review", title: "事実の根拠", detail: "設計見本のため、実績や資格の根拠は判定していません。", action: "参照元ページを確認する" },
+      { id: "crawler-access", group: "access", status: "review", title: "公開ページの取得状態", detail: "これは見本です。実サイトへの取得は行っていません。", action: "実サイトを指定して確認する" },
+      { id: "indexability", group: "access", status: "review", title: "公開範囲", detail: "見本のため、実サイトのindex設定は判定していません。", action: "実サイトの公開設定を確認する" },
+      { id: "sitemap", group: "access", status: "review", title: "サイトマップ", detail: "見本のため、実サイトのsitemapは取得していません。", action: "実サイトのsitemapを確認する" },
+      { id: "structured-data", group: "clarity", status: "review", title: "構造化データ", detail: "見本のため、実サイトの構造化データは判定していません。", action: "表示本文と構造化データを確認する" },
+      { id: "entity-clarity", group: "clarity", status: "review", title: "名称と分野の対応", detail: "見本のため、実サイトの記載は判定していません。", action: "名称・分野・参照元を確認する" },
+      { id: "buyer-facts", group: "clarity", status: "review", title: "確認できる条件", detail: "見本のため、実サイトの条件は判定していません。", action: "対象・条件・受付方法を確認する" },
+      { id: "proof", group: "proof", status: "review", title: "事実の根拠", detail: "見本のため、実績や資格の根拠は判定していません。", action: "参照元ページを確認する" },
@@ -254 +254 @@ function buildScanResultInternal(brandName: string, scanId: string, measuredAt:
-        "設計見本の固定回答ログです。実際のプロバイダー回答ではありません。",
+        "見本の固定回答ログです。実際のプロバイダー回答ではありません。",
@@ -305 +305 @@ function buildScanResultInternal(brandName: string, scanId: string, measuredAt:
-      summary: winner ? `設計見本のログでは${winner}が候補文字列に含まれ、自社はこの質問で含まれていません。` : "設計見本のログでは自社が候補文字列に含まれていません。",
+      summary: winner ? `見本のログでは${winner}が候補文字列に含まれ、自社はこの質問で含まれていません。` : "見本のログでは自社が候補文字列に含まれていません。",

diff --git a/lib/sample-profiles.ts b/lib/sample-profiles.ts
index e054d17..20f8772 100644
--- a/lib/sample-profiles.ts
+++ b/lib/sample-profiles.ts
@@ -10 +10 @@ function makeSampleProfile(input: SampleInput): PublicProfile {
-    title: `${input.brandName} 参照元（設計見本）`,
+    title: `${input.brandName} 参照元（見本）`,
@@ -36 +36 @@ function makeSampleProfile(input: SampleInput): PublicProfile {
-    `# ${input.brandName} 公開情報参照ページ（設計見本）`,
+    `# ${input.brandName} 公開情報参照ページ（見本）`,
@@ -62 +62 @@ function makeSampleProfile(input: SampleInput): PublicProfile {
-    title: `${input.brandName} 公開情報参照ページ（設計見本）`,
+    title: `${input.brandName} 公開情報参照ページ（見本）`,
@@ -92 +92,2 @@ const SAMPLE_PROFILES: Record<string, PublicProfile> = {
-      { label: "掲載区分", value: "設計見本（架空データ）", sourceUrl: "https://aoba-souzoku.example.jp" },
+      { label: "強みの例", value: "初回対面相談無料／専任担当一貫対応／事前面談見積", sourceUrl: "https://aoba-souzoku.example.jp" },
+      { label: "掲載区分", value: "見本（架空データ）", sourceUrl: "https://aoba-souzoku.example.jp" },
@@ -105 +106,2 @@ const SAMPLE_PROFILES: Record<string, PublicProfile> = {
-      { label: "掲載区分", value: "設計見本（架空データ）", sourceUrl: "https://aoba-cafe.example.com" },
+      { label: "強みの例", value: "全席電源・高速Wi-Fi／自家焙煎豆／作業利用歓迎", sourceUrl: "https://aoba-cafe.example.com" },
+      { label: "掲載区分", value: "見本（架空データ）", sourceUrl: "https://aoba-cafe.example.com" },
@@ -118 +120,2 @@ const SAMPLE_PROFILES: Record<string, PublicProfile> = {
-      { label: "掲載区分", value: "設計見本（架空データ）", sourceUrl: "https://yamada-bankin.example.jp" },
+      { label: "強みの例", value: "単品1個対応／3D CAD直接入稿／最短即日試作", sourceUrl: "https://yamada-bankin.example.jp" },
+      { label: "掲載区分", value: "見本（架空データ）", sourceUrl: "https://yamada-bankin.example.jp" },
@@ -131 +134,2 @@ const SAMPLE_PROFILES: Record<string, PublicProfile> = {
-      { label: "掲載区分", value: "設計見本（架空データ）", sourceUrl: "https://azumino-sunshine.example.jp" },
+      { label: "強みの例", value: "産地直送・当日発送／糖度18度選別／贈答用ギフト", sourceUrl: "https://azumino-sunshine.example.jp" },
+      { label: "掲載区分", value: "見本（架空データ）", sourceUrl: "https://azumino-sunshine.example.jp" },
@@ -144 +148 @@ const SAMPLE_PROFILES: Record<string, PublicProfile> = {
-      { label: "掲載区分", value: "設計見本（架空データ）", sourceUrl: "https://nexora-cloud.example.com" },
+      { label: "掲載区分", value: "見本（架空データ）", sourceUrl: "https://nexora-cloud.example.com" },

diff --git a/lib/watch-email.ts b/lib/watch-email.ts
index 2656549..20490ab 100644
--- a/lib/watch-email.ts
+++ b/lib/watch-email.ts
@@ -3,0 +4 @@ import { northStarShare } from "@/lib/north-star";
+import { takeBackShare } from "@/lib/measurement";
@@ -120,2 +121,2 @@ export async function sendWatchStarted(watch: WatchRecord) {
-  const subject = `[Rovan] ${brand}のAI回答測定を開始しました`;
-  const text = `${brand}の週次AI回答測定を開始しました。\n\n比較可能な質問パネル: ${result.panel.promptCount}問（v${result.panel.version}）\n自社が候補に含まれた質問: ${included} / ${result.panel.promptCount}\n候補外として記録された質問: ${result.lostPrompts.length} / ${result.panel.promptCount}\nAI回答観測: ${observations.successful} / ${observations.scheduled}件\n参照元URL: ${citationUrls(result).size}件\n\nこの通知は指定した質問・AI・日時の観測結果です。事業成果は測定していません。\n\n結果を見る: ${url}\n\n無料期間は14日で終了し、自動課金されません。`;
+  const subject = `[Rovan] ${brand}のAI推薦状況の追跡を開始しました`;
+  const text = `${brand}のAI推薦状況の追跡を開始しました。\n\n比較可能な質問パネル: ${result.panel.promptCount}問（v${result.panel.version}）\n自社が候補に含まれた質問: ${included} / ${result.panel.promptCount}\n候補外として記録された質問: ${result.lostPrompts.length} / ${result.panel.promptCount}\nAI回答観測: ${observations.successful} / ${observations.scheduled}件\n参照元URL: ${citationUrls(result).size}件\n\nこの通知は指定した質問・AI・日時の観測結果です。事業成果は測定していません。\n\n結果を見る: ${url}\n\n無料期間は14日で終了し、自動課金されません。`;
@@ -129 +130 @@ export async function sendWatchStarted(watch: WatchRecord) {
-  const html = `<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;line-height:1.65;max-width:620px"><p style="font-size:12px;letter-spacing:.08em;color:#64748b">Rovan</p><h1 style="font-size:24px;margin:8px 0 20px">${escapeHtml(brand)}のAI回答測定を開始しました。</h1><table style="border-collapse:collapse;width:100%;margin:0 0 24px">${rows}</table><p style="font-size:13px;color:#475569">指定した質問・AI・日時の観測結果です。事業成果は測定していません。</p><p><a href="${escapeHtml(url)}" style="display:inline-block;background:#0b1b2a;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700">結果を見る</a></p><p style="font-size:12px;color:#64748b;margin-top:24px">無料期間は14日で終了し、自動課金されません。</p></div>`;
+  const html = `<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;line-height:1.65;max-width:620px"><p style="font-size:12px;letter-spacing:.08em;color:#64748b">Rovan</p><h1 style="font-size:24px;margin:8px 0 20px">${escapeHtml(brand)}のAI推薦状況の追跡を開始しました。</h1><table style="border-collapse:collapse;width:100%;margin:0 0 24px">${rows}</table><p style="font-size:13px;color:#475569">指定した質問・AI・日時の観測結果です。事業成果は測定していません。</p><p><a href="${escapeHtml(url)}" style="display:inline-block;background:#0b1b2a;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700">結果を見る</a></p><p style="font-size:12px;color:#64748b;margin-top:24px">無料期間は14日で終了し、自動課金されません。</p></div>`;
@@ -141,0 +143,10 @@ export async function sendWatchUpdate(watch: WatchRecord, previous: ScanResult,
+  const comparison = takeBackShare(previous, latest);
+  const completeReadout = [previous, latest].every((result) => result.measurementCompleteness === 100
+    && result.scheduledObservations > 0
+    && countableObservation(result).length === result.scheduledObservations);
+  const comparisonAvailable = comparable && completeReadout && comparison.status === "available";
+  const comparisonNote = !completeReadout || comparison.status === "incomplete"
+    ? "AI回答の取得不足のため、比較できませんでした。"
+    : !comparable
+      ? "測定パネル・反復回数・地域・言語の条件が一致しないため、比較できませんでした。"
+      : comparison.note;
@@ -162,6 +173,9 @@ export async function sendWatchUpdate(watch: WatchRecord, previous: ScanResult,
-  const subject = options.trialEnded
-    ? `[Rovan] ${brand}: AI回答測定の無料確認期間が終了しました`
-    : comparable
-      ? `[Rovan] ${brand}: AI回答測定に変化がありました`
-      : `[Rovan] ${brand}: 比較可能な質問パネルを更新しました`;
-  const endNote = options.trialEnded ? "\n\n今回で14日間の無料確認が終了しました。自動課金はされません。" : "";
+  const notificationHeading = options.trialEnded
+    ? `${brand}のAI推薦・自動見守りの無料トライアル期間が終了しました。`
+    : !comparisonAvailable
+      ? `${brand}のAI推薦状況を比較できませんでした。${comparisonNote}`
+      : newIncluded > 0 || newlyExcludedCount > 0
+        ? `${brand}のAI推薦状況に変化がありました。`
+        : `${brand}のAI回答の取得状況・参照元URLに変化がありました。`;
+  const subject = `[Rovan] ${notificationHeading}`;
+  const endNote = options.trialEnded ? "\n\n今回で14日間の無料トライアルが終了しました。自動課金はされません。" : "";
@@ -169,2 +183,5 @@ export async function sendWatchUpdate(watch: WatchRecord, previous: ScanResult,
-  const actionHeading = latestAction?.status === "applied" ? "情報補強の完了報告" : "公開前の確認案";
-  const actionStatus = latestAction?.status === "applied" ? "許可された範囲で公開ページに反映済み。AI回答への影響は再測定で確認します。" : "公開前の確認待ち（未反映）";
+  const actionHeading = latestAction?.status === "applied" ? "Rovanの自動対処・完了報告" : "更新案を作成しました。まだ公開には反映していません。";
+  const actionStatus = latestAction?.status === "applied" ? "AI推薦データを自動更新しました。許可された範囲で公開ページに反映済み。AI回答への影響は再測定で確認します。" : "公開前の確認待ち（未反映）";
+  const actionTimestamp = latestAction?.status === "applied"
+    ? `実行日時: ${latestAction.executedAt || "記録なし"}`
+    : `案の作成日時: ${latestAction?.plannedAt || "記録なし"}`;
@@ -174 +191 @@ export async function sendWatchUpdate(watch: WatchRecord, previous: ScanResult,
-    ? `\n\n【${actionHeading}】\n・${latestAction.factLabel}: ${latestAction.factValue}\n・出典URL: ${latestAction.sourceUrl}\n・状態: ${actionStatus}\n`
+    ? `\n\n【${actionHeading}】\n保存済みの対処記録（過去の更新・案を含みます）\n・${actionTimestamp}\n・${latestAction.factLabel}: ${latestAction.factValue}\n・出典URL: ${latestAction.sourceUrl}\n・状態: ${actionStatus}\n`
@@ -177 +194 @@ export async function sendWatchUpdate(watch: WatchRecord, previous: ScanResult,
-  const impactText = latestImpact
+  const impactText = comparisonAvailable && latestImpact
@@ -182 +199 @@ export async function sendWatchUpdate(watch: WatchRecord, previous: ScanResult,
-    ? `<div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:14px 18px;margin:20px 0;text-align:left"><strong style="color:#0f172a;font-size:14px">${actionHeading}</strong><p style="margin:8px 0 4px;font-size:13px;color:#334155"><strong>${escapeHtml(latestAction.factLabel)}:</strong> ${escapeHtml(latestAction.factValue)}</p><p style="margin:4px 0;font-size:13px;color:#334155"><strong>出典URL:</strong> ${escapeHtml(latestAction.sourceUrl)}</p><p style="margin:4px 0 0;font-size:12px;color:#64748b">状態: ${actionStatus}</p></div>`
+    ? `<div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:14px 18px;margin:20px 0;text-align:left"><strong style="color:#0f172a;font-size:14px">${actionHeading}</strong><p style="font-size:12px;color:#64748b">保存済みの対処記録（過去の更新・案を含みます）<br />${escapeHtml(actionTimestamp)}</p><p style="margin:8px 0 4px;font-size:13px;color:#334155"><strong>${escapeHtml(latestAction.factLabel)}:</strong> ${escapeHtml(latestAction.factValue)}</p><p style="margin:4px 0;font-size:13px;color:#334155"><strong>出典URL:</strong> ${escapeHtml(latestAction.sourceUrl)}</p><p style="margin:4px 0 0;font-size:12px;color:#64748b">状態: ${actionStatus}</p></div>`
@@ -185 +202 @@ export async function sendWatchUpdate(watch: WatchRecord, previous: ScanResult,
-  const text = `${brand}のAI回答測定に変化がありました。\n\n${comparable ? `比較可能な質問パネル: ${latest.panel.promptCount}問（v${latest.panel.version}）\n自社が候補に含まれた質問: ${previousIncluded} → ${latestIncluded} / ${latest.panel.promptCount}\n候補外として記録された質問: ${previous.lostPrompts.length} → ${latest.lostPrompts.length} / ${latest.panel.promptCount}\n${newIncluded ? `新しく候補に含まれた質問: ${newIncluded}問\n` : ""}${newlyExcludedCount ? `新しく候補外になった質問: ${newlyExcludedCount}問\n` : ""}` : `比較可能な質問パネル: 前回と条件が異なるため、今回を新しい基準として記録\n自社が候補に含まれた質問: ${latestIncluded} / ${latest.panel.promptCount}\n候補外として記録された質問: ${latest.lostPrompts.length} / ${latest.panel.promptCount}\n`}AI回答観測: ${latestObservations.successful} / ${latestObservations.scheduled}件\n${observationCountChanged ? `前回のAI回答観測: ${previousObservations.successful} / ${previousObservations.scheduled}件\n` : ""}${addedCitations || removedCitations ? `参照元URLの変化: 追加${addedCitations}件 / 削除${removedCitations}件\n` : ""}${impactText}${autonomousText}\nこの通知は指定した質問・AI・日時の観測結果です。事業成果は測定していません。\n結果を見る: ${url}${endNote}`;
+  const text = `${notificationHeading}\n\n${comparisonAvailable ? `比較可能な質問パネル: ${latest.panel.promptCount}問（v${latest.panel.version}）\n自社が候補に含まれた質問: ${previousIncluded} → ${latestIncluded} / ${latest.panel.promptCount}\n候補外として記録された質問: ${previous.lostPrompts.length} → ${latest.lostPrompts.length} / ${latest.panel.promptCount}\n${newIncluded ? `新しく候補に含まれた質問: ${newIncluded}問\n` : ""}${newlyExcludedCount ? `新しく候補外になった質問: ${newlyExcludedCount}問\n` : ""}` : `比較不可: ${comparisonNote}\n自社の候補入り・候補外の変化: 未確定\n`}AI回答観測: ${latestObservations.successful} / ${latestObservations.scheduled}件\n${observationCountChanged ? `前回のAI回答観測: ${previousObservations.successful} / ${previousObservations.scheduled}件\n` : ""}${addedCitations || removedCitations ? `参照元URLの変化: 追加${addedCitations}件 / 削除${removedCitations}件\n` : ""}${impactText}${autonomousText}\nこの通知は指定した質問・AI・日時の観測結果です。事業成果は測定していません。\n結果を見る: ${url}${endNote}`;
@@ -187,3 +204,3 @@ export async function sendWatchUpdate(watch: WatchRecord, previous: ScanResult,
-    tableRow("比較可能な質問パネル", comparable ? `${latest.panel.promptCount}問（v${latest.panel.version}）` : "今回を新しい基準として記録"),
-    tableRow("自社が候補に含まれた質問", comparable ? `${previousIncluded} → ${latestIncluded} / ${latest.panel.promptCount}` : `${latestIncluded} / ${latest.panel.promptCount}`),
-    tableRow("候補外として記録された質問", comparable ? `${previous.lostPrompts.length} → ${latest.lostPrompts.length} / ${latest.panel.promptCount}` : `${latest.lostPrompts.length} / ${latest.panel.promptCount}`),
+    tableRow("比較可能な質問パネル", comparisonAvailable ? `${latest.panel.promptCount}問（v${latest.panel.version}）` : `比較不可：${comparisonNote}`),
+    tableRow("自社が候補に含まれた質問", comparisonAvailable ? `${previousIncluded} → ${latestIncluded} / ${latest.panel.promptCount}` : "未確定"),
+    tableRow("候補外として記録された質問", comparisonAvailable ? `${previous.lostPrompts.length} → ${latest.lostPrompts.length} / ${latest.panel.promptCount}` : "未確定"),
@@ -193 +210 @@ export async function sendWatchUpdate(watch: WatchRecord, previous: ScanResult,
-  const impactHtml = latestImpact
+  const impactHtml = comparisonAvailable && latestImpact
@@ -196 +213 @@ export async function sendWatchUpdate(watch: WatchRecord, previous: ScanResult,
-  const html = `<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;line-height:1.65;max-width:620px"><p style="font-size:12px;letter-spacing:.08em;color:#64748b">Rovan</p><h1 style="font-size:24px;margin:8px 0 20px">${escapeHtml(brand)}のAI回答測定に変化がありました。</h1><table style="border-collapse:collapse;width:100%;margin:0 0 24px">${rows}</table>${impactHtml}${autonomousHtml}<p style="font-size:13px;color:#475569">指定した質問・AI・日時の観測結果です。事業成果は測定していません。</p><p><a href="${escapeHtml(url)}" style="display:inline-block;background:#0b1b2a;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700">結果を見る</a></p>${options.trialEnded ? '<p style="font-size:12px;color:#64748b;margin-top:24px">今回で14日間の無料確認が終了しました。自動課金はされません。</p>' : ""}</div>`;
+  const html = `<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;line-height:1.65;max-width:620px"><p style="font-size:12px;letter-spacing:.08em;color:#64748b">Rovan</p><h1 style="font-size:24px;margin:8px 0 20px">${escapeHtml(notificationHeading)}</h1><table style="border-collapse:collapse;width:100%;margin:0 0 24px">${rows}</table>${impactHtml}${autonomousHtml}<p style="font-size:13px;color:#475569">指定した質問・AI・日時の観測結果です。事業成果は測定していません。</p><p><a href="${escapeHtml(url)}" style="display:inline-block;background:#0b1b2a;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700">結果を見る</a></p>${options.trialEnded ? '<p style="font-size:12px;color:#64748b;margin-top:24px">今回で14日間の無料トライアルが終了しました。自動課金はされません。</p>' : ""}</div>`;

diff --git a/public/ai-index.json b/public/ai-index.json
index d6bc513..fa18e02 100644
--- a/public/ai-index.json
+++ b/public/ai-index.json
@@ -3 +3 @@
-  "description": "AI回答と公開情報を同じ条件で確認し、参照元付きの情報整理を支援するサービス。",
+  "description": "自社サイト改修ゼロで、御社の強みを伝えるAI推薦データを配備。AIからの推薦獲得に向けて、競合診断と毎週の自動見守りを行うシステムです。",

diff --git a/public/llms.txt b/public/llms.txt
index 27a620c..3890d8d 100644
--- a/public/llms.txt
+++ b/public/llms.txt
@@ -3 +3,3 @@
-> AI回答と公開情報を、同じ条件で確認・整理するサービス。
+> 自社サイト改修ゼロで、御社の強みを伝えるAI推薦データを配備。AIからの推薦獲得に向けて、競合診断と毎週の自動見守りを行うシステムです。
+
+AI推薦データは、会社の強み・対応条件・参照元をまとめた、AI向けの公開データです。AI事業者が認定・登録したデータを意味しません。

```
