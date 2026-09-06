# AIに選ばれやすくするための調査とRovanの提供範囲

調査日: 2026-09-03 (JST)\
対象: 日本のB2B企業が、購入前のAI検索で候補に入り、引用され、比較材料として扱われるまでの公開Web・測定・改善の流れ\
前提: AIの内部ランキングは取得できない。Rovanは公開情報と宣言した観測パネルを扱い、推薦や売上を保証しない。

## 直接の答え

「Rovanを一度使うだけで、すべてのAIが必ず自社を推薦する」仕組みは、公開されている仕様にも、Rovanが操作できる権限にも存在しない。Rovanが提供できる最大の価値は、次のループを会社ごとに実行できるようにすること。

```text
公開ページを読む
→ 購入前の質問で実際の候補入り・引用を測る
→ 競合が先に選ばれた理由を公開情報の差に分解する
→ 事実確認済みのページ案・AI-readable下書きを作る
→ 人が公開する
→ 同じ質問・同じ条件で取り返せたか測る
```

## 一次資料から確定できること

### 1. いちばん効くのは、AI専用ファイルではなく、役に立つ公開情報

Googleの生成AI検索向けガイドは、独自の経験・分析を含む非コモディティな内容、読みやすい見出しと構成、必要に応じた画像・動画、公開クロール可能な技術構造を重視している。大量の類似ページ、検索用だけの書き換え、偽の言及は長期的な方法ではない。

- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content

### 2. クロール・インデックスの入口は必要だが、掲載順位を直接動かさない

Googleは、ページが検索に登録され、スニペット対象であること、クロール可能であることを生成AI検索の前提としている。ただし、条件を満たしてもクロール・インデックス・表示は保証されない。sitemapはURLを知らせるヒントであり、反映の保証ではない。

- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

### 3. 構造化データは意味を明示する補助で、隠し情報の抜け道ではない

JSON-LDはGoogleが推奨する形式だが、表示や順位は保証されない。見える本文と一致しない情報、偽レビュー、誤解を招く情報は使えない。Organization、WebSiteなどの適切な型は、会社やページの同定を助ける。

- https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- https://developers.google.com/search/docs/appearance/structured-data/organization

### 4. `llms.txt`は補助的な配布物であり、Googleの特別なランキング信号ではない

Googleは、`llms.txt`やAI専用Markdown、コンテンツの細切れ化を生成AI検索の必須条件としていない。作ること自体は他サービスのために許容されるが、Google検索の可視性や順位を上げるものではない。Rovanでは主役にせず、公開情報の下書きと確認用の補助ファイルとして扱う。

- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

### 5. 各AI検索は、それぞれの公開クローラーと通常のWebが入口

OpenAIは、ChatGPT検索の要約・スニペットに含めたい公開者へ、`OAI-SearchBot`をrobots.txtで拒否しないよう案内している。GPTBotの許可は学習利用の設定と別である。Perplexityは検索掲載用の`PerplexityBot`を、Anthropicはユーザー起点の取得を制御する`Claude-User`を案内している。Google SearchとBing / Copilotは、それぞれの通常検索インデックスを入口にする。ChatGPTからの流入は`utm_source=chatgpt.com`で計測できる。ブラウザ操作型エージェントには、ARIAの役割・ラベル・状態などアクセシブルな構造が役立つ。

- https://help.openai.com/en/articles/12627856-publishers-and-developers-faq
- https://docs.perplexity.ai/docs/resources/perplexity-crawlers
- https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler

### 6. 引用を追うことはできるが、引用数は順位や因果効果ではない

Bing Webmaster ToolsのAI Performanceは、AI回答で引用されたページ、関連するgrounding query、時系列、Citation Shareなどを示す。Bing自身が、これは引用活動であってランキング・権威・流入・重要度を測るものではなく、変化の原因も単独では証明しないと説明している。推奨されている改善は、意図に合う構成、深さ、明確さ、根拠、正確さ、鮮度である。

- https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c
- https://www.bing.com/webmasters/help/recommendations-55a30304

### 7. 更新通知は自動化できるが、登録や推薦の保証ではない

検証済みドメインをSearch Consoleに接続すれば、インデックス状態・URL検査・sitemap送信をAPIで扱える。BingのIndexNowは更新・追加・削除URLを通知できるが、検索エンジンが採用・掲載する保証ではない。

- https://developers.google.com/webmaster-tools
- https://developers.google.com/search/docs/monitor-debug/search-console-start
- https://www.bing.com/indexnow/getstarted
- https://www.bing.com/webmasters/help/URL-Submission-62f2860b

## 価値を生む要素の分解

| 層 | ユーザーが得るもの | Rovanが観測・生成できるもの | 自動化の限界 |
|---|---|---|---|
| 読める | クローラーが重要ページを取得できる | OAI-SearchBot、Googlebot、Bingbot、PerplexityBot、Claude-Userのrobots、noindex、sitemap、canonical、タイトル・見出し・JSON-LD監査 | Search Console/Bingの所有権確認は利用者の権限が必要 |
| 分かる | 誰向けで何ができ、いくらで、どう始めるかが伝わる | 公開ページの購入前情報、不足項目、ページ案 | 事実・料金・効果を推測できない |
| 信じられる | 選ぶ理由を第三者が確認できる | AI回答の引用、競合が引用されたページ、導入実績などの不足 | 偽レビュー・不自然な言及・無許諾掲載は作れない |
| 選ばれる | 同じ質問で候補に入る・引用される | OpenAI/Gemini/Perplexityの宣言パネル、質問別の勝敗 | AIの内部ランキング・全ユーザーの会話は取得できない |
| 変化が分かる | 直したあとに改善したか判断できる | Watch、同一質問の再測定、変化した質問と引用 | 一回の前後差から因果効果は断定できない |
| 反映される | 公開・再クロール・流入を確認できる | 下書き、公開前チェック、将来の所有権付き連携の設計 | 顧客サイトへの無断書き込み・掲載保証は不可 |

## 競合サービスから確認できた設計パターン

既存サービスの実画面調査（`outputs/reference-research/AIX_REFERENCE_RESEARCH_2026-09-02.md`）と公式機能説明を照合した。

- Ahrefs: AIの言及・引用・トピック・引用ドメインを広いプロンプト母集団で見る。まず現状を見せ、詳細へ降ろす。
- Semrush: 可視性、競合差、プロンプト差、技術監査、コンテンツ改善、定期レポートを一つの流れにする。
- Profound/Scrunch: 引用元・質問・クロール状態・流入をつなぎ、処理中の進捗と結果の具体性を見せる。
- Bing Webmaster Tools: 自社ページがどのgrounding queryで引用されたかを所有者向けに返す。
- これらは測定、監査、改善、反映、再測定を分けずに見せる点が共通する。一方、AI内部順位へのアクセスや推薦保証を主張する一次資料は確認できない。

## Rovanに実装した範囲

### すでに実行されるもの

1. 会社名・商品名・サービス名または会社URLから診断対象を確定し、公開ページを取得して会社・市場・競合・購入前質問を作る。
2. 複数AI面で同じ質問を測り、候補外、先に選ばれた会社、引用ページを残す。
3. 公開ページで確認できない購入材料を、根拠の差として表示する。
4. ChatGPT Search、Google、Bing、Perplexity、Claudeの公開クローラー、index設定、sitemap、canonical、JSON-LD、タイトル・見出し・説明、購入前情報、第三者の根拠、測定完全性を「整っている / 確認が必要 / 止まっている」に分ける。
5. 実際に取得した公開ページだけから、人が確認して公開するAI-readable下書き（JSON-LD / `llms.txt`）を作る。
6. Watchで同じ質問を再測定し、取り返せた質問だけを追う。

### 今回の実装ファイル

- `lib/visibility-audit.ts`: 4層の可視性監査と優先項目。
- `lib/crawler.ts`: ページごとのnoindex、canonical、JSON-LD、見出し、X-Robots-Tagと主要AIクローラーのrobots判定を取得。
- `lib/scan-result.ts` / `lib/watch-measurement.ts`: ScanとWatch結果へ監査を保存。
- `components/result-client.tsx` / `app/globals.css`: 結果画面に「AIに読まれる準備」と次の一手を表示。
- `lib/ai-readable.ts` / `components/watch-client.tsx`: 公開前のAI-readable下書きと取得ボタン。

## まだ自動化していないもの

### 実装候補（権限と同意が必要）

- Google Search Consoleの所有権確認後のURL検査・sitemap送信・生成AIパフォーマンス取込。
- Bing Webmaster Toolsの所有権確認後のAI Performance / IndexNow連携。
- GitHubのブランチ・Pull Request、WordPressのDraftなど、公開せずレビュー待ちにする連携。
- GA4などの流入・問い合わせイベントとの相関表示。ChatGPT流入のUTMを含むが、AI推薦との因果とは分ける。
- 顧客が許可した第三者プロフィール・レビュー・事例の確認台帳。自動生成・自作レビュー・有償の不自然な言及は対象外。

これらは、ドメイン所有権、最小権限、プレビュー、監査ログ、撤回・削除、料金・規約確認が揃ってから追加する。Rovanが顧客サイトへ勝手に公開する設計にはしない。

## 成功の測り方

「Rovanを使った会社の順位が上がった」という一つの数字では判定しない。最低限、次を同じパネル・地域・言語・AI面・期間で追う。

- 候補入り率 / First Choice Rate
- 自社ドメインのCitation Coverage
- 質問・トピックごとの候補外数
- 引用された自社ページ数と、引用された外部ページの種類
- 測定完全性と繰り返し一致度
- 公開した変更と再測定の時系列
- Search Console / Bing / GA4で確認できる表示・引用・流入・問い合わせ（接続した場合のみ）

変化があっても、競合の更新、検索結果、モデル更新、地域、非決定性の影響を含む。Rovanは「観測された変化」と「原因が確定した効果」を分ける。

## 判断

「AIに読ませるファイルを作る」だけでは弱い。Rovanの差別化は、会社名・商品名・サービス名またはURL一つから、購入前の質問、競合との差、公開情報の不足、合法的に確認できる根拠、公開前の下書き、同じ質問での再測定までを一続きにすることにある。

最優先の次段は、顧客が許可したドメインに対して、生成下書きをレビュー待ちのPull Request / CMS Draftへ渡し、公開後にSearch Console・Bing・GA4の実データとRovanの同一パネルを横並びにすること。その段階でも、提供価値は「推薦を買う」ではなく、「どこを直し、何が変わったかを証拠付きで判断できる」に置く。

## 調査の停止理由

Google、OpenAI、Bingの一次資料で、クロール可能性、役に立つ公開内容、根拠・鮮度、所有者向け引用計測、アクセス解析、掲載非保証の要件が収束した。既存AEO製品の公式機能と実画面も確認し、残る差分は機能の追加ではなく、所有権付き公開連携と実データ接続である。これ以上、同じ「専用ファイルで順位が上がる」という主張を追うより、公式資料と矛盾しない実装境界を維持する方が意思決定価値が高い。
