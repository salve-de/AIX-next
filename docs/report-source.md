# Rovan — マスター戦略・公開データ・AI可視性調査

調査日: 2026-09-03 (JST)\
対象: Rovanの事業目的、AI検索での発見・引用、Rovan側で公開する機械可読データ、売上につながる測定、既存サービスとの差、法務・運用境界\
読者: Rovanの事業責任者、プロダクト設計・実装担当、将来の顧客説明担当

この文書は、これまでの会話と既存のプロダクト文書を統合した、現在の判断の基準である。外部サービスが公開している機能は、そのサービス自身の説明として扱い、AIの順位や売上への効果が検証済みであるとは扱わない。

## 0. 先に結論

Rovanが作るべきものは、会社の公式サイトをコピーする「会社紹介ページ」でも、Rovanが企業を評価して掲載する「第三者ディレクトリ」でもない。

作るべきものは、会社が確認・承認した公開情報を、Rovanが次の形で整理・配信・更新できる**AI向け公開情報レイヤー**である。

```text
会社の公開情報
  → Rovanが取得・整理・出典付与・版管理
  → 人が読める公開HTML
  → 機械が読めるJSON / JSON-LD / Markdown
  → sitemap・robots・更新通知
  → 外部AIのクロール、検索、引用の候補
  → Rovanの同一Prompt・同一条件での再測定
```

このレイヤーを公開すれば外部AIが読める入口は増やせる。しかし、Google、ChatGPT、Bing、Perplexityなどの推薦・引用・掲載順位は保証できない。GoogleはAI検索でも通常の検索の技術要件と有用な公開情報を使い、特別なAI用ファイルや専用スキーマを必須としていない。[GoogleのAI検索ガイド](https://developers.google.com/search/docs/appearance/ai-features)

Rovanの価値は「使っただけでAI順位が上がる」ではなく、次の判断を短く、出典付きで可能にすることに置く。

> AIが買い手の質問で競合を選ぶ理由、自社に足りない公開根拠、次に確認する一手、変更後に同じ質問で何が変わったかが分かる。

## 1. Rovanがそもそも何をしたいのか

### 1.1 解く問題

B2Bの買い手は、会社サイトへ来る前に「どの会社を比較候補にするか」をAIへ聞ける。候補から外れた会社は、通常のアクセス解析やCRMに痕跡を残さないことがある。

Rovanの対象は、AI全体の神秘的な「順位」ではなく、買い手が実際に聞く比較・選定の質問である。

```text
買い手に課題がある
  → AIに候補・比較・代替を聞く
  → 候補を絞る
  → 検索、レビュー、公式サイト、営業で確認する
  → 問い合わせ・商談・契約
```

### 1.2 Rovanの仕事

1. 会社名・商品名・サービス名またはURL一つから診断対象を確定し、会社、商品・サービス、対象顧客、用途、競合候補を把握する。
2. 購入前のBuyer Promptを作り、OpenAI、Gemini、Perplexityなどで観測する。
3. 自社が候補に入ったか、競合が先に選ばれたか、どの公開根拠が引用されたかを残す。
4. 自社ページで確認できないEvidence Gapを、売上に近い順に一つへ絞る。
5. 事実を創作しないChange Packを作り、顧客が確認・公開できる状態にする。
6. 同じ質問・言語・地域・AI面・条件で再測定し、変化と不確実性を分ける。
7. 顧客が明示的に許可した場合だけ、Rovan側のAI向け公開情報レイヤーを作る。

### 1.3 やらないこと

- 顧客サイト、広告、CRM、GitHub、CMSへ勝手に書き込む。
- Rovanが会社のレビュー、評価、推薦順位を作る。
- 非公開の社内情報、競合観測、プロンプト、Evidenceを公開する。
- AIの内部ランキングや全ユーザーの会話を取得したと称する。
- Buyer Prompt数を「失った顧客数」「失注額」「売上」と換算する。
- `llms.txt`、JSON-LD、Rovan掲載だけでAI推薦を保証する。

## 2. 会話から確定した要求と、これまでの取り違え

### 2.1 ユーザーの本来の要求

- RovanはAI検索での候補外・競合選定を調べるサービス。
- 会社名・商品名・サービス名または会社URLで開始できる。
- 結果は「ふーん」で終わらず、顧客を取り戻すための次の判断につなげる。
- 内部処理の説明、長い専門用語、作業中の演出文は表示しない。
- 顧客サイトをRovanが勝手に変更しない。
- ただし、AIが読み取りやすい公開データをRovan側で作る可能性はある。
- その公開データを外部AIへ届かせる方法、どの程度効くか、どう測るかを調べる。
- 既存サービスの構造・UI・レポート・運用を参考にし、独自性のために分かりにくくしない。

### 2.2 取り違えだった案

以前の「Rovan上に作る会社紹介ページ」は、Rovanのドメインに会社情報を載せる公開ページ案を指していた。顧客サイトを変えない点では要件に近いが、名前と設計が悪かった。

それは次の意味ではない。

- G2やAlternativeToのようなレビュー・比較サイトを作ること。
- Rovanが会社を勝手に推薦・格付けすること。
- 公式サイトの文章を複製して大量のSEOページを作ること。

正しい呼び方は、**AI向け公開情報、AI情報レコード、企業情報フィード**などである。人向けに見えるページを置く場合も、主目的は紹介や広告ではなく、承認済み事実と出典を機械・人の双方が確認できることにする。

### 2.3 「第三者ページを公開」の正確な意味

「第三者」とは、会社自身の公式サイトではなくRovanが発行者になるという意味である。

「公開」とは、Rovanのドメイン上でログインなしに取得でき、クローラーが読めることを意味する。Rovanの管理画面だけに置いたDBや、利用者だけが見られるAPIでは、外部AIの通常のWeb検索には届かない。

ただし、Rovanが企業について発信する以上、Rovanは事実上の第三者データ発行者になる。したがって、所有者の承認、出典、取得日時、修正・削除、期限切れ、広告・スポンサー表示が必要である。

「公開ページを作るだけでAIに選ばれる」という意味ではない。このページが成立するには、単なるコピーではなく、出典を整理した構造、更新履歴、比較に使える独自の検証価値が必要になる。

## 3. 現在のRovan実装の事実

現在のブランチは `codex/aix-next-v2` で、主なコードと文書は `/Users/satoushinya/project/AIX-next` にある。未コミット変更を含むため、既存変更を捨てずに扱う。

### 3.1 すでにあるもの

- URL正規化、SSRF防御、リダイレクト再検証、robots尊重、取得上限。
- 公開サイトのクロール、会社・競合・Buyer Promptの発見。
- OpenAI / Gemini / Perplexityの観測アダプター。
- 生の回答、Citation、推奨エンティティ、測定条件。
- Recommendation Coverage、First Choice Rate、Mention Coverage、Citation Coverage、Repeat Agreement、Measurement Completeness。
- 候補外Prompt、競合Evidence、Evidence Gap、First Action。
- Free Scan、14日Watch、Founder Watchの価値階段。
- Watchの固定Core Promptと同一条件での再測定。
- Change Pack。事実確認前のドラフトとして、見出し・本文・FAQ・利用根拠・公開前チェックを出す。
- AI可読下書き。クロール済み公開ページから`llms.txt`とJSON-LDをダウンロードできる。
- visibility audit。AIクローラー、noindex、sitemap、canonical、JSON-LD、ページの基本情報、購入前情報、第三者根拠、測定完全性を確認する。
- 公開Rovan自身の`robots.txt`、`sitemap.xml`、`llms.txt`、`ai-index.json`。
- 結果・Watch・Evidenceは非公開、noindex、no-storeを基本にする。

### 3.2 まだないもの

- 会社ごとのRovan公開AI情報レコード。
- そのレコードの公開・非公開・削除・期限切れ状態管理。
- statement単位の出典・ハッシュ・取得日時・承認履歴。
- Rovan公開レコード用の動的sitemap。
- Search Console、Bing Webmaster、IndexNow、GA4との所有権付き連携。
- 会社所有ドメインへ接続する読み取り専用MCP Resource / OpenAPIフィード。
- 公開レイヤーの参加前後を比較する実験台帳。

現在のAI可読出力は、[lib/ai-readable.ts](/Users/satoushinya/project/AIX-next/lib/ai-readable.ts)で作る人間レビュー前の下書きであり、[components/watch-client.tsx](/Users/satoushinya/project/AIX-next/components/watch-client.tsx)からダウンロードするだけである。Rovanが会社ごとのページを公開する機能はまだない。

## 4. 外部AI・検索が実際に見る入口

### 4.1 Google Search / AI Overviews / AI Mode

Googleの現行ガイドから確定できること。

- AI OverviewsやAI Modeに追加の専用要件はない。
- Google Searchでインデックスされ、スニペット表示の対象になることが前提。
- クロール可能な公開ページ、内部リンク、ページ体験、テキスト、正確な構造化データが重要。
- GoogleのRAGはSearch indexからページを取得する。
- `llms.txt`、AI専用ファイル、AI専用スキーマ、細かい「チャンク化」はGoogle Searchの特別なランキングレバーではない。
- 満たしていてもクロール、インデックス、表示は保証されない。
- Search ConsoleのGenerative AI performance reportでAI機能内の表示URL・国・端末・期間を確認できる。

出典: [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)、[Generative AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)、[Search Console AI performance report](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports)

### 4.2 ChatGPT Search / OpenAI

- 公開サイトはChatGPT検索に現れ得る。
- 要約・スニペットに含めるには`OAI-SearchBot`をrobots.txtで拒否しないことが入口。
- `GPTBot`は学習利用の制御であり、検索用の`OAI-SearchBot`とは分ける。
- `OAI-SearchBot`を許可したサイトは、ChatGPTからの流入を計測できる。OpenAIは流入URLに`utm_source=chatgpt.com`を自動付与すると説明している。
- 検索掲載、上位表示、推薦、引用は保証されない。

出典: [OpenAI Publishers and Developers FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)

### 4.3 Bing / Copilot

- Bing Webmaster APIで所有サイトの検索・クロール・URL・sitemap関連の情報を取得できる。
- Bing AI Performanceは、Copilot等のAI回答で引用されたページやクエリのサンプルを可視化する。
- AI Performanceは引用活動の観測であり、ランキング、権威、売上を表すものではない。
- IndexNowは更新・追加・削除URLを通知できるが、クロールやインデックスを保証しない。

出典: [Bing Webmaster API](https://learn.microsoft.com/en-us/bingwebmaster/)、[Bing AI Performance](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c)、[IndexNow documentation](https://www.indexnow.org/documentation)

### 4.4 Perplexity / Claude

- Perplexityは`PerplexityBot`の許可をクローラー入口として説明している。
- Anthropic系はサービスごとに取得・利用目的が異なる。Rovanでは「Claudeに必ず引用される」と一般化せず、取得できた事実だけを測る。
- robots.txtはアクセス希望を示すプロトコルであり、認証や秘密保持の代わりではない。[RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html)

出典: [Perplexity crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)、[Anthropic web crawling FAQ](https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)

### 4.5 直接接続するAIエージェント

MCPは、検索エンジンに公開ページを登録する仕組みではない。対応クライアントが接続したときに、Resources（読み取りデータ）、Prompts、Toolsを提供するプロトコルである。Rovanが使うなら、公開情報を返す読み取り専用Resourceから始め、書き込みToolや決済Toolは持たせない。

出典: [MCP Resources specification](https://modelcontextprotocol.io/specification/draft/server/resources)、[MCP server specification](https://modelcontextprotocol.io/specification/2025-06-18/server/index)

## 5. 実現可能な方法・アイデアの全体表

| 方法 | Rovanができること | 外部AIへの作用 | 採用判断 |
|---|---|---|---|
| Rovan公開HTML | 承認済み情報を人にも読めるページで提供 | クローラーが読める入口 | 中核。薄いコピーは禁止 |
| JSON-LD | Organization、WebPage、Service等で意味を明示 | entity理解の補助 | 中核。本文と一致させる |
| `ai-data.json` / API | 会社・サービス・出典を機械取得できる形にする | 対応クライアント、Rovan連携 | 中核。公開範囲を管理 |
| Markdown / `llms.txt` | 重要ページへの短い案内を提供 | 対応するシステムには便利 | 補助。Googleの順位施策ではない |
| sitemap.xml | 公開URLの発見を助ける | Google等が取得候補にできる | 必須。掲載保証なし |
| robots.txt | クローラーごとにアクセス方針を示す | OAI-SearchBot等の入口 | 必須。認証ではない |
| canonical | 重複URLの代表を示す | 重複クラスタの整理 | 必須 |
| IndexNow | 変更・削除URLを参加エンジンに通知 | 反映のきっかけ | 補助。インデックス保証なし |
| Search Console API | 所有サイトのindex、sitemap、検索分析を取得 | Googleの実状態を確認 | 所有権接続後 |
| Bing Webmaster / AI Performance | Bing/Copilotの引用・クロール観測 | AI引用を実測 | 所有権接続後 |
| GA4 / CRM | AI流入・問い合わせ・商談を接続 | 売上に近い実測 | 顧客許可後 |
| `sameAs` / entity ID | 公式サイト、SNS、既知の識別子を関連づける | 同一組織の識別を補助 | 中核。存在しないIDは作らない |
| 署名付きレコード | 出典・更新・改ざん検知を付与 | 信頼・監査の補助 | 将来 |
| MCP Resource | 接続したAIに最新情報を返す | 検索ではなく直接取得 | 将来。読み取り専用 |
| OpenAPI / JSON Feed | 企業データを外部システムから取得 | 連携先のRAG・エージェント | 将来 |
| `agents.txt` / `agents.json` / `ai.txt` | AIエージェントの能力や利用方針を宣言する提案 | 対応したエージェントの発見を補助 | 新興提案。標準・採用を保証しない |
| Google Merchant / UCP | 商品フィードとエージェント購入を接続 | EC・購入行動 | EC企業だけ |
| Google Business Profile | 店舗・地域情報を公式所有で管理 | Maps・検索・AIの地元情報 | 店舗企業だけ |
| 業界団体・G2等 | 実在する第三者根拠を増やす | 独立ソースとして引用される可能性 | Rovanが作らず、取得・提案する |
| デジタルPR・事例 | 実在する導入実績や説明を増やす | 外部Evidenceの厚み | 事実・許諾がある場合だけ |
| Rovan内部ベクトルDB | Rovan内で会社情報を検索しやすくする | 外部AIには届かない | 内部品質用 |

## 6. 機械可読ファイルの正しい位置づけ

### 6.1 JSON-LD

GoogleはJSON-LDを推奨形式の一つとしているが、構造化データは本文の意味を補助する手がかりであり、表示・順位を保証しない。構造化データにだけ存在し、見える本文にない会社情報を入れてはいけない。[Structured data general guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)

会社ページでは`Organization`、サービスページでは適切な`Service`または`Product`、ページとの関係には`mainEntityOfPage`、公式サイトや既知の識別ページには`sameAs`を使う。GoogleのOrganizationガイドは、会社名・公式URL・ロゴ・住所・識別子等が同一組織の理解と曖昧性解消に役立つと説明している。[Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)

### 6.2 `llms.txt`

`llms.txt`はコミュニティ提案で、AIが読むと便利なページ一覧をMarkdownで示す用途はある。しかしGoogleは、Google Searchではこのファイルを特別扱いせず、作成してもGoogleの順位には効かないと明記している。[llms.txt proposal](https://llmstxt.org/)、[Google AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)

Rovanでは、対応するAIや人が情報を見つけやすくする補助ファイルとして使い、売り文句を「これだけでAIに有利」としない。

### 6.4 `agents.txt`、`ai.txt`、その他の新しい提案

robots.txtはアクセス方針、sitemapはページ一覧、llms.txtは人間が選んだ文書案内を主に扱う。これらに加え、エージェントが実行できる能力や利用ポリシーを宣言する`agents.txt` / `agents.json`、AI固有の利用・ライセンス方針を宣言する`ai.txt`などの提案がある。

これらは、現時点でGoogle・OpenAI・Bingの一般検索に採用された順位標準ではない。対応するAIが明示的に読み取る場合の便利なメタデータとして扱い、Rovanの中核公開経路にしない。Rovanで導入する場合は、同じ設定から生成し、内容を人にも見せ、実際の取得ログを測る。

参考: [AGENTS.TXT Internet-Draft](https://www.ietf.org/archive/id/draft-car-agents-txt-wellknown-00.html)、[AI.TXT Internet-Draft](https://www.ietf.org/archive/id/draft-car-ai-txt-wellknown-00.html)

### 6.5 署名・来歴（provenance）

出典URLと取得時刻だけでも監査はできるが、将来は会社またはRovanがレコードにデジタル署名を付け、第三者が改ざん検知できるようにする案がある。W3C Verifiable Credential Data Integrityは、暗号学的証明で文書の作成者・完全性を検証する仕組みを定める。C2PAは主に画像・動画などメディアの来歴を扱う。

どちらも「署名者がそう主張した」「データが改ざんされていない」ことを補助するもので、主張が真実であること、AIが引用すること、順位が上がることを保証しない。Rovanの最初の実装では、署名より先に原典、承認者、取得日時、期限、削除履歴を揃える。

参考: [W3C Verifiable Credential Data Integrity](https://www.w3.org/TR/vc-data-integrity/)、[C2PA Specifications](https://spec.c2pa.org/specifications/)

### 6.3 JSON / API / DataFeed

JSON APIは、Rovanと対応AI・顧客システムが直接データを扱うために有効である。しかし、APIを公開しただけで一般検索インデックスへ登録されるわけではない。人が読めるHTMLページからリンクし、sitemapと出典を持たせる。

`Dataset`や`DataFeed`は、本当にデータセットや商品フィードを提供する場合に使う。単なる会社紹介にDatasetを付けるのは誤用である。GoogleのDataset文書は、再公開・派生・複数原典の関係に`sameAs`や`isBasedOn`を使い、出典・バージョン・更新を示す考え方を説明している。[Dataset structured data](https://developers.google.com/search/docs/appearance/structured-data/dataset)

## 7. 「第三者ページ」が本当に価値を持つ条件

### 7.1 三種類を分ける

| 種類 | 何をするか | Rovanでの扱い |
|---|---|---|
| 第三者ディレクトリ | 複数企業を比較・分類・評価する | Rovanの主目的にしない |
| Rovan公開情報レコード | 会社の承認済み事実と出典を配信する | 任意参加の実験として検討 |
| 外部第三者根拠 | G2、業界団体、事例、報道など独立ソース | Rovanが作らず、存在・許諾・鮮度を確認 |

### 7.2 既存サイトから分かること

- AlternativeToは、ユーザーが実際に使ったソフトの代替・推薦を集めるコミュニティ型で、会社自身の一方的な紹介とは異なる。[AlternativeTo About](https://alternativeto.net/about/)
- G2は、製品プロフィール、検証レビュー、カテゴリ比較、買い手意図などを分けて提供し、企業がプロフィールをClaimする仕組みを持つ。[G2 profile](https://sell.g2.com/create-a-profile)、[G2 documentation](https://documentation.g2.com/docs/)
- Product Huntは、製品ページ、ローンチ、コメント、投票、レビュー、所有者Claimを組み合わせた発見コミュニティである。[Product Hunt definitions](https://www.producthunt.com/launch/definitions)、[Claim Product Page](https://help.producthunt.com/en/articles/6684701-how-do-i-claim-my-product-page)

これらの価値は、URLが増えることではなく、独立した利用者の意見、比較文脈、履歴、運営ルールがあることから生じる。Rovanが会社から受け取った情報を再掲するだけでは、この独立性はない。

### 7.3 Rovan公開レコードを作るなら

- 会社所有者の明示的な参加承認。
- 公開前プレビューと、発行者「Rovan」、データ提供者「会社」の区別。
- 事実ごとの原典URL、取得日時、更新日時、採用理由。
- 会社の主張とRovanの観測結果を別の欄にする。
- 有料参加なら広告・スポンサー表示。掲載順やAI推薦を販売しない。
- 訂正、非公開、削除、所有権取消し、期限切れ。
- 複製ではなく、出典の関係、検証状態、更新履歴という独自価値。
- `noindex`または即時非公開で撤回できる仕組み。

## 8. 推奨するRovanの公開データ設計

### 8.1 公開URL

```text
/ai/company/{stable-slug}
/ai/company/{stable-slug}.json
/ai/company/{stable-slug}.md
/ai/company/{stable-slug}/sources
```

「profile」ではなく「ai/company」または「ai-information」とする。URLは会社名の変更に耐える安定IDを使い、表示名と分ける。

### 8.2 レコードの最小構造

```json
{
  "recordVersion": "1",
  "recordId": "https://rovan.example/ai/company/example",
  "publisher": "Rovan",
  "subject": {
    "name": "Example Corporation",
    "officialUrl": "https://example.co.jp",
    "sameAs": ["https://example.co.jp"]
  },
  "facts": [
    {
      "claim": "法人向け業務ソフトウェアを提供する",
      "sourceUrl": "https://example.co.jp/about",
      "retrievedAt": "2026-09-03T00:00:00Z",
      "ownerApproved": true,
      "expiresAt": null
    }
  ],
  "publishedAt": "2026-09-03T00:00:00Z",
  "updatedAt": "2026-09-03T00:00:00Z",
  "status": "published"
}
```

### 8.3 公開しないデータ

- Evidenceの回答本文、社内担当者、メールアドレス。
- 競合をどのPromptで調べたか、競合の未公開評価。
- APIキー、課金情報、Watch token、内部のモデルプロンプト。
- Rovanが推測した売上・失注・顧客属性。
- 会社が承認していない主張、古い料金、未検証の導入社数。

### 8.4 公開ライフサイクル

```text
draft → owner_review → approved → published
                         ↓
              correction / expire / unpublish / delete
```

自動更新は「公開候補を作る」までにし、公開状態を自動で拡張しない。更新された原典が確認できない場合は、古い主張を消すか期限切れにして、想像で補完しない。

## 9. Rovanの三層アーキテクチャ

```text
公式サイトの公開情報
        │
        ▼
┌─────────────────────────────┐
│ Rovan内部の取得・出典・版管理     │  ← RovanのDB / ベクトル検索
└──────────────┬──────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌──────────────┐  ┌────────────────┐
│ 公開Web層       │  │ 直接接続層       │
│ HTML/JSON/MD  │  │ API/MCP Resource │
│ sitemap/robots│  │ 認証・権限付き     │
└───────┬──────┘  └───────┬────────┘
        │                  │
        ▼                  ▼
  Web検索・AIクローラー       接続したAI・顧客システム
```

- Rovan内部DBはRovan自身の回答品質を上げる。外部AIのインデックスには届かない。
- 公開Web層は外部検索・AIクローラーに見つけてもらうためのもの。ただし掲載・引用は非保証。
- 直接接続層は、対応クライアントが明示的にRovanへ接続する場合のもの。MCPは検索の代替ではない。

## 10. 競合・隣接サービスから学ぶこと

### 10.1 AI可視性測定

Ahrefs Brand Radar、Semrush AI Visibility、Profound、Scrunch、Peec、Otterlyなどは、公式説明上、次を中心にしている。

- Promptまたは検索-backed質問。
- Mention、Citation、Cited Page、Share of Voice。
- 競合との比較。
- モデル・AI面・地域・期間別の推移。
- 出典ドメインとコンテンツ機会。
- 一部はGA4やAPI、レポート、アラート。

市場の差別化が難しいため、Rovanは「別の可視性スコア」を増やすより、会社名・商品名・サービス名またはURL一つからBuyer Prompt、競合が先に選ばれた根拠、Evidence Gap、First Action、再測定をつなぐ。

参照: [Ahrefs Brand Radar](https://help.ahrefs.com/en/articles/11064852-what-is-brand-radar-and-how-to-use-it)、[Ahrefs metrics](https://help.ahrefs.com/en/articles/15501968-ai-visibility-metrics)、[Semrush AI visibility](https://www.semrush.com/solutions/ai-visibility/)、[Otterly AI](https://otterly.ai/)

### 10.2 自動実行サービス

Alli AI、Search Atlas OTTOなどは、サイト変更を自動化・承認制御する方向を取る。Rovanは、顧客サイトへ勝手に書かないことを保護条件にする。将来連携する場合も、ドメイン所有確認、最小権限、プレビュー、Pull RequestまたはCMS Draft、監査ログ、ロールバックを必須にする。

### 10.3 第三者の発見・比較面

G2、AlternativeTo、Product Hunt、業界団体、レビュー、導入事例、報道は、独立した文脈や実利用の根拠を持つ場合に価値がある。Rovan自身がこれを大量生成するのではなく、「どの買い手質問で、どの外部根拠が足りないか」を発見し、実在する掲載先・作るべき事例・確認すべき出典を提案する。

## 11. 売上につなげるための設計

AI可視性を表示するだけだと、顧客は「ふーん」で終わる。結果を売上に近い意思決定へ変換する。

### 11.1 買い手段階

| 段階 | Rovanが見ること | 返すこと |
|---|---|---|
| 認知 | どの問題・カテゴリ質問で名前が出るか | 狙うべき買い手語彙 |
| 比較 | 競合が先に選ばれる質問 | 競合、理由、欠けた根拠 |
| 検討 | 料金、期間、対象、リスク、導入条件 | 不安を解く事実とページ |
| 問い合わせ前 | CTA、フォーム、デモ、資料 | 取りこぼし仮説 |
| 商談 | 営業・CRMでの失注理由 | AI回答と営業資料の差 |
| 受注後 | 実績、継続、紹介 | 次の事例・証拠の候補 |

### 11.2 一回の結果の文章

画面は次の順番で短くする。

1. **いま取られている質問**: 「この質問ではA社が先に選ばれています」
2. **理由**: 「A社には導入期間の公開根拠があり、自社では確認できません」
3. **影響の仮説**: 「比較の最後で不安を解けず、問い合わせ前に外れる可能性があります」
4. **次に確認する一つ**: 「実際の導入期間と対象条件を確認してください」
5. **再測定**: 「同じ質問で候補入りと引用ページをもう一度確認します」

「取り戻しましょう」は感情的な入口として使えるが、本文では「どの質問で、何が根拠不足で、誰に取られているか」を一つにする。AI内部処理のログや「戦略構築中」などは、ユーザーが必要とする結果ではないので表示しない。

### 11.3 価値階段

- 無料Scan: FIND + EXPLAIN。会社名・商品名・サービス名またはURL入力、候補外、競合、Citation、Evidence Gap、First Action。
- 14日Watch: PROVE。固定質問を同じ条件で再測定し、変更後の動きを見る。
- Founder Watch: ACT + PROVE。50問の固定Core、Discovery、Evidence inbox、Change Pack、週次履歴。
- Rovan公開情報レイヤー: 参加企業だけの任意追加。公開前承認、出典、削除、参照・流入計測が条件。

North Starは「Paid Project Activation」。支払い後14日以内に、比較可能な測定、EvidenceまたはChange Packの確認、次の再測定まで進むことを目標にする。

## 12. 測定設計と因果の扱い

### 12.1 Rovanが測れるもの

- exact Prompt、Prompt ID、パネル版、AI面、モデル別名、地域、言語。
- 取得時刻、反復番号、生回答、正規化した候補、Citation。
- 自社の候補入り、First Choice、Mention、Citation。
- 競合の候補入りと第一候補。
- 測定完全性、反復一致度、コスト、失敗理由。
- Search Console、Bing AI Performance、GA4、CRMを接続した場合の所有サイトの表示・流入・問い合わせ。

### 12.2 Rovanが測れないもの

- 全ての個人のChatGPT会話。
- AIプロバイダー内部の順位スコアや推薦モデル。
- 「Rovan公開ページを作ったことだけ」が原因の売上増。
- Citation一件が受注一件につながったこと。

### 12.3 公開レイヤーの実験

任意の公開レイヤーを作る場合は、次の台帳を持つ。

```text
参加企業 / 非参加企業
参加承認日
公開レコード版
公開URL・sitemap通知日
クローラー到達ログ
インデックス確認
同一Promptの公開前後
Citation・候補入り・AI流入
Search Console / Bing / GA4 / CRMの接続状態
訂正・削除履歴
```

参加前後だけの単純な差では、モデル更新、競合更新、季節性、地域、非決定性を分離できない。可能なら同一パネルを固定し、公開レイヤーなしの比較対象、複数期間、同じPrompt・モデル・地域を用いる。結論は「観測された関連」に留め、因果効果とは言わない。

## 13. 法務・信頼・安全

### 13.1 公開情報でも個人情報は残る

日本の個人情報保護委員会は、Web等の不特定多数が取得できる情報は受領者の取得を代行する性質がある一方、公開情報でも個人情報に該当し得るため、他の個人情報保護規定は適用されると説明している。[個人情報保護委員会ガイドライン](https://www.ppc.go.jp/personalinfo/legal/guidelines_thirdparty/)

会社ページに代表者名・個人連絡先・従業員情報を載せる場合は、必要性、目的、削除・訂正、海外提供、保持期間を別途確認する。

### 13.2 著作権とクロール

文化庁は、AIと著作権の関係について、情報解析、生成、利用の段階ごとに権利制限や侵害リスクを判断する必要があると整理している。Rovanは公開ページの全文転載を避け、事実の要約、短い引用、原典リンク、取得時点を基本にする。[文化庁「AIと著作権について」](https://www.bunka.go.jp/seisaku/chosakuken/aiandcopyright.html)

### 13.3 有料掲載と推薦の透明性

Rovanが有料で公開レコードを提供しても、掲載順や推薦を売ると、ディレクトリ・広告・評価の境界が曖昧になる。スポンサー、広告、提供企業の関係は、読者が分かる場所に明示する。海外向けにレビュー・推薦を扱う場合は、金銭・提供関係の明示を求めるFTCのガイダンスも確認する。[FTC Endorsement Guides](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking)

### 13.4 robots.txtは認証ではない

robots.txtはクローラーへのアクセス希望であり、URLを隠す仕組みでも、APIや個人情報を保護する仕組みでもない。非公開情報は認証・認可・サーバー側のアクセス制御で守る。[RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html)

## 14. 実装ロードマップ

### P0 — いまある診断を事業価値へ固定

- 結果を「取られている質問 → 競合の根拠 → 次の一手 → 再測定」にする。
- 測定値・会社入力・仮説・未取得をラベル分けする。
- 現在のvisibility auditとAI-readable下書きを、公開レイヤーと混同しない。
- サンプルは架空と明示し、失敗・未設定プロバイダーを負け扱いしない。

### P1 — AI情報レコードの基盤

- `AiInformationRecord`のレコード契約を作る。
- statement単位のsource URL、retrievedAt、content hash、ownerApproved、expiresAtを持つ。
- `draft / owner_review / approved / published / expired / unpublished / deleted`を持つ。
- プレビュー、承認、訂正、削除、監査ログを作る。

### P1 — Rovan公開Web層

- `/ai/company/{slug}`の人間可読ページ。
- 同じ内容をJSON、Markdownで取得できる。
- HTML本文とJSON-LDを一致させる。
- `Organization`、`WebPage`、`sameAs`、公式URL、出典リンク。
- 公開レコードだけを動的sitemapに追加。
- `robots.txt`、canonical、noindex解除・再付与を状態と連動。
- 削除時は公開URLを即時非公開にし、古いsitemap・キャッシュ・リンクを整理。

### P1 — 品質ゲート

- 公式URL所有または会社代表者の承認を確認。
- 事実の原典に到達できる。
- 重要主張に更新期限がある。
- 他社文章のコピー率・類似度を抑える。
- 競合中傷・偽レビュー・推薦順位を含めない。
- 公開ページにある内容だけを構造化データへ入れる。

### P2 — 検索・流入の所有権付き連携

- Search Consoleサイト所有権をOAuth等で確認し、sitemap送信・URL Inspection・検索分析を読み取り中心で接続。[Search Console API](https://developers.google.com/webmaster-tools/v1/api_reference_index)
- Bing Webmasterの所有サイトとAI Performanceを接続。
- IndexNowの鍵ファイル所有を確認し、追加・更新・削除時だけ通知。
- GA4のAI流入、問い合わせ、CRMの商談・失注理由を任意接続。UTMや参照元の欠落を前提に、直接因果とは言わない。[GA4 traffic-source dimensions](https://support.google.com/analytics/answer/15612152?hl=en)

### P3 — 直接AI連携

- 読み取り専用OpenAPI JSONを提供。
- MCP Resourceで、承認済み公開情報と出典だけを返す。
- scopeごとの認証、レート制限、監査ログ、更新通知。
- 書き込みTool、決済、メール送信は別の承認済みコネクターとして扱う。

### P4 — 分野別アダプター

- EC: Merchant Center商品フィード、UCPの公開profile、価格・在庫・返品・購入条件。[Google UCP](https://developers.google.com/merchant/ucp)
- 店舗: Business Profile、営業時間、所在地、レビュー権限。
- 規制・金融・医療: Rovanの一般テンプレートをそのまま使わず、専門家レビューとカテゴリ制限。
- 業界データ: Dataset、業界団体、資格・認証・事例の原典確認。

## 15. 成功条件（実装の完了証拠）

「作った」ではなく、次の観測がそろったら公開レイヤーのMVP完了とする。

1. 明示承認した会社だけに公開URLが発行される。
2. 未承認、期限切れ、削除済みのURLはHTML、JSON、Markdown、sitemapから非公開になる。
3. 公開HTMLとJSON-LDの主張・表示名・公式URLが一致する。
4. 全ての会社主張に出典URL、取得日時、承認状態、更新期限がある。
5. 非公開のEvidence、Prompt、競合情報、トークンが公開レスポンスに存在しない。
6. robots.txt、canonical、sitemap、noindexが公開状態と一致する。
7. 公開ページがRovan内部の結果ページやWatchページをリンクして漏らさない。
8. 公開レコードを同一条件のAI測定パネルで、公開前後に比較できる。
9. IndexNow、Search Console、Bing、GA4は所有権と実際の接続結果を表示し、未接続を成功扱いしない。
10. 「順位上昇」「推薦保証」「売上増」と断言せず、参照・引用・流入・測定結果を分けて表示する。

## 16. 残る不確実性と、調査の停止理由

### 確認できたこと

- Googleは通常のSearch要件をAI検索にも使い、特別なAIファイルを必須にしていない。
- OpenAIはOAI-SearchBotの許可をChatGPT検索への入口として説明している。
- BingはAI引用・クロール観測を提供し、IndexNowは更新通知を提供する。
- MCPは直接接続のデータ提供であり、検索インデックスとは別である。
- 署名付きデータは出所・完全性の補助であり、内容の真実性やAI推薦を自動的に保証しない。
- 公式構造化データは同一組織の識別と内容理解を補助するが、順位を保証しない。
- 第三者ディレクトリの価値は、コピーではなく独立したレビュー、比較、利用者、履歴、運営ルールにある。
- 公開情報にも個人情報・著作権・広告表示・訂正削除の責任がある。

### まだ実測が必要なこと

- Rovan公開情報レコードを追加した場合の、AI面ごとのCitation・候補入りの差。
- Rovanページが実際にどのクローラーに何回取得されるか。
- 企業規模、知名度、既存外部根拠をそろえた比較対象との差。
- Rovan公開レコード経由のAI流入が、問い合わせ・商談へ進む割合。
- 会社が自社サイトを変更しない場合の、Rovanページ単独の寄与。
- `llms.txt`、`agents.txt`、`ai.txt`など新しい提案形式の実際の採用範囲。

これらは、仕様やベンダーの宣伝文では決められない。Rovanの固定Prompt、公開状態、取得ログ、引用、流入、問い合わせをそろえた実験で判断する。

### 調査を止めた理由

公式のGoogle、OpenAI、Bing、Perplexity、MCP、Schema.org、IETF、文化庁、個人情報保護委員会の資料を確認し、外部AIに届く条件、届かない条件、公開レイヤーの責任境界が収束した。これ以上、根拠のない「専用ファイルで順位が上がる」という説を追加で追うより、実データを取れる公開レコードと測定実験へ進む方が意思決定価値が高い。

## 17. 既存ドキュメントとの対応

| 文書 | 役割 |
|---|---|
| `docs/PRODUCT_STRATEGY.md` | Mission、FIND / EXPLAIN / ACT / PROVE、価格、KPI |
| `docs/RESEARCH.md` | B2B買い手、競合、公式AI検索資料、現行方針 |
| `docs/AI_VISIBILITY_RESEARCH_2026-09-03.md` | AI可視性、クロール、Citation、公開レイヤーの追加調査 |
| `docs/AISEO_ADVISOR_NO_EXECUTION_2026-09-03.md` | 顧客サイトへ勝手に実行しない境界 |
| `docs/REVENUE_AUTOPILOT_RESEARCH_2026-09-03.md` | AI観測を売上改善へつなぐ方法と将来の権限境界 |
| `docs/MEASUREMENT.md` | Promptパネル、分母、観測、比較、因果の境界 |
| `docs/UX_RATIONALE.md` | 0.1秒 / 1–3秒 / 5–10秒の理解階層、画面の順序 |
| `docs/CHAT_HANDOFF_2026-09-02_VALUE_PASS.md` | これまでのUI・Change Pack・Watchの引き継ぎ |
| `docs/ARCHITECTURE.md` | Next.js、クロール、AIアダプター、非公開データ、依存関係 |
| `docs/CHATGPT_SITES.md` | ChatGPT SitesはUI、GitHub/バックエンドは永続ロジックという境界 |
| `docs/LAUNCH_CHECKLIST.md` | 本番前のプロバイダー、DB、Stripe、運用、品質ゲート |
| `docs/B2B_AI_BUYER_BEHAVIOR_2026.md` | AIがB2B候補形成に使われるという市場シグナル |

## 18. 主要ソース台帳

| Claim | Source | 備考 |
|---|---|---|
| Google AI検索に追加要件はなく通常のSearch要件が基礎 | [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) | Google公式、最終更新2025-12-10 |
| Googleは公開クロール、RAG、技術構造、ページ体験を重視 | [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) | Google公式、2026年取得 |
| `llms.txt`はGoogle Searchの特別信号ではない | [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) | Google公式 |
| OAI-SearchBotを許可することがChatGPT検索の入口 | [OpenAI Publishers FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq) | OpenAI公式、更新5日前 |
| GPTBotとOAI-SearchBotの目的が異なる | [OpenAI Publishers FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq) | OpenAI公式 |
| sitemapは発見のヒントで掲載保証ではない | [Crawling and indexing FAQ](https://developers.google.com/search/help/crawling-index-faq?hl=en) | Google公式 |
| Search Console APIで検索分析、sitemap、URL Inspectionを扱える | [Search Console API](https://developers.google.com/webmaster-tools/v1/api_reference_index) | Google公式 |
| IndexNowは更新通知で、インデックス保証ではない | [IndexNow documentation](https://www.indexnow.org/documentation) | IndexNow公式 |
| Bing AI Performanceは引用活動を観測する | [Bing AI Performance](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c) | Microsoft公式 |
| MCP Resourcesは接続クライアントへのデータ提供 | [MCP Resources](https://modelcontextprotocol.io/specification/draft/server/resources) | MCP公式仕様 |
| `sameAs`は同一性を示すURL | [Schema.org sameAs](https://schema.org/sameAs) | Schema.org公式語彙 |
| Organization構造化データは組織の識別を補助 | [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization) | Google公式 |
| ProfilePageは企業レビューサイトの用途ではない | [ProfilePage](https://developers.google.com/search/docs/appearance/structured-data/profile-page) | Google公式 |
| robots.txtはアクセス制御ではない | [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html) | IETF標準 |
| 公開情報でも個人情報規定は残る | [個人情報保護委員会ガイドライン](https://www.ppc.go.jp/personalinfo/legal/guidelines_thirdparty/) | 日本公式 |
| AIと著作権は利用段階・目的ごとに整理が必要 | [文化庁 AIと著作権](https://www.bunka.go.jp/seisaku/chosakuken/aiandcopyright.html) | 日本公式 |
| AlternativeToは利用者投稿中心の代替発見サービス | [AlternativeTo About](https://alternativeto.net/about/) | 運営者の説明 |
| G2はプロフィール、レビュー、カテゴリ、買い手意図を扱う | [G2 profile](https://sell.g2.com/create-a-profile) | G2自身の説明 |
| Product Huntはローンチ・レビュー・コメント・所有者Claimを持つ | [Product Hunt definitions](https://www.producthunt.com/launch/definitions) | Product Hunt公式 |
| ECのUCP profileは公開well-known JSONで能力を宣言 | [UCP profile](https://developers.google.com/merchant/ucp/guides/overview/ucp-profile) | Google公式、EC限定 |

## 19. 最終判断

「Rovan上に会社紹介ページを作る」は、単独の事業目的としては不適切である。正しくは、Rovanが会社の承認済み公開情報を、出典付き・更新可能・撤回可能なAI向けデータとして管理し、外部Web層と直接接続層へ分けて配信する。

それによってRovanは、

```text
AIに選ばれない
  → どの質問で負けているか分かる
  → 競合が持つ根拠との差が分かる
  → 会社が確認した公開データを整える
  → Rovan側にも読み取り入口ができる
  → 同じ条件で参照・引用・流入の変化を測る
```

という一続きのサービスになる。

ただし、公開データを置くこと自体を「推薦を買う仕組み」と表現しない。Rovanが約束できるのは、情報を見つけやすく、確かめやすく、更新しやすくし、どの変化が起きたかを測れる状態まで作ることである。
