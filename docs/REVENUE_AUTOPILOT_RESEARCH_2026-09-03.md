# AIX Revenue Autopilot — 事業成果までつなぐ調査と実装方針

> **方針更新 (2026-09-03):** 顧客サイトへの実行代行・自動公開は商品にしない。この文書は「実行まで広げた場合に必要な条件」の調査資料として残し、現在の採用方針は [`docs/AISEO_ADVISOR_NO_EXECUTION_2026-09-03.md`](AISEO_ADVISOR_NO_EXECUTION_2026-09-03.md) を優先する。

調査日: 2026-09-03 (JST)  
対象: 日本の高単価B2B企業が、AIや検索で候補に入り、サイト訪問、問い合わせ、商談、受注へ進むまでをAIXに委任できる方法  
結論: 「AIにおすすめされる」は目的ではなく、認知と売上に近い買い手接点を増やすための一つの手段である。

## 1. 先に結論

ユーザーが会社名やURLを入力するだけで、権限も変更も承認もなく、AI推薦と売上を自動的に増やす方法はない。AI各社は内部の推薦ロジックや全ユーザーの会話を公開しておらず、検索エンジンも掲載・順位・売上を保証していない。

AIXが提供すべき最大の価値は、単なる「AI順位の診断」ではなく、次の運用を一度の委任後に継続して実行すること。

```text
一度だけ: URL・対象顧客・目標・事実・公開権限を接続
      ↓
AIX: 買い手の質問を調査し、競合との差と根拠を測る
      ↓
AIX: 最も売上に近い変更を作り、GitHub/CMSへレビュー可能な形で渡す
      ↓
承認された範囲: 公開、sitemap/IndexNow通知、計測設定を実行
      ↓
AIX: AIの候補入り・引用・AI流入・問い合わせ・商談を同じ履歴で追う
      ↓
AIX: 次に実施する一手を、見込める商談価値の順に選ぶ
```

これなら「使うだけで得られる価値」は、次のように説明できる。

> 競合に取られている買い手の質問を見つけ、根拠のある変更を公開し、AIから来た見込み客が商談・受注につながったかまで追う。毎週の調査と優先順位付けはAIXが行う。

ただし、定常作業ゼロと完全な無許可自動化は別物である。最初に所有権・接続・自動公開ポリシーを一度設定し、危険な変更は承認待ちにする。ここを省いて「お任せで必ず売上が上がる」と約束するのは、技術的にも契約・規約上も不正確である。

## 2. 目的をKPIの階層に戻す

AIの推薦順位は中間指標であり、AIXの北極星は売上に近い順で置く。

```text
認知       自社が知られる / 検索・AIで発見される
  ↓
候補入り   買い手の比較質問で候補に入る / 引用される
  ↓
訪問       AI・検索・第三者ページからサイトへ来る
  ↓
有望化     問い合わせ、資料請求、デモ予約、電話、チャット
  ↓
商談       条件を満たすSQL / 商談化した案件
  ↓
受注       成約額・粗利・継続売上
```

### 指標の扱い

| 層 | 追う値 | 何が言えるか | 言えないこと |
|---|---|---|---|
| A | crawl/index、ページ事実、CTA、フォーム状態 | 読める・理解できる・連絡できる状態か | AIが推薦する保証 |
| B | 同一質問での候補入り率、Citation Coverage、競合との差 | 測定した買い手質問での観測変化 | 全ユーザーのAI体験、売上の因果 |
| C | AI referrerのセッション、ページ、UTM | AI経由の実訪問 | 訪問者が必ずAI回答を見た証明 |
| D | AIを知った問い合わせ、資料請求、デモ、CRM案件 | AI接点を含む有望行動 | その一要因だけが成約原因だったこと |
| E | 受注、売上、粗利、継続 | 事業成果 | AIXの一変更だけの因果（対照や検証なしでは不可） |

Google Analytics Data APIはチャネル、コンバージョン、収益などを取得できるが、計測設定と適切な帰属モデルが必要である。AIの候補入り数をそのままリード数や売上に変換してはいけない。

参考: [Google Analytics Data APIの指標](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema)、[Conversion reporting basics](https://developers.google.com/analytics/devguides/reporting/data/v1/conversions-api-basics)

## 3. 「稼働なし」を実現する運用モデル

### 3.1 一度だけ顧客にしてもらうこと

初回だけ、次を明示的に設定する。

1. 対象ドメインと所有権（Search Console、Bing、CMS、GitHubなど）
2. 売りたい商品・地域・言語・対象顧客・除外業種
3. 成果目標（問い合わせ、デモ、資料請求、店舗来訪、EC購入など）
4. 使ってよい事実と根拠URL、期限、禁止表現
5. 変更の自動化ポリシー（下書きだけ / PR自動作成 / 低リスク変更のみ自動公開）
6. CRM・GA4・広告・予約フォームの接続とデータ保持範囲

### 3.2 以後AIXが担うこと

- 固定した買い手質問と発見質問を定期測定する。
- 競合が選ばれた回答、引用ページ、更新時期、公開根拠を比較する。
- 売上への距離、影響しそうな質問数、実装工数、確度でActionを優先する。
- 事実を捏造せず、ページ本文・FAQ・比較材料・構造化データ・メタデータの変更案を作る。
- GitHubのブランチ/PRまたはWordPress等のDraftへ渡す。
- 承認済みの範囲だけ公開し、sitemap/IndexNow等で更新を通知する。
- 公開後にクロール/index状態、AI回答、AI流入、フォーム、CRM案件を再確認する。
- 変化があったときだけ、次の判断に必要な内容を通知する。

### 3.3 自動公開の境界

| 変更 | 推奨デフォルト | 理由 |
|---|---|---|
| sitemapの再生成、更新通知 | 自動可 | 可逆で内容を増やさないが、所有権が必要 |
| 既存事実からのtitle/description/見出し候補 | PR/Draft | 表現がブランド・法令に影響する |
| robots、canonical、noindex | 承認必須 | 誤ると全ページが見えなくなる |
| 既存事実に一致するJSON-LD | PR/Draft、低リスクのみ自動可 | 本文との不一致やリッチ結果ポリシー違反を防ぐ |
| 料金、効果、認証、導入社数、比較優位 | 承認必須 | 事実・表示規制・契約上の確認が必要 |
| 導入事例、レビュー、第三者言及 | 顧客/掲載者の明示承認必須 | 権利・真正性・プラットフォーム規約が関係する |
| 外部サイトへの投稿、レビュー依頼、PR送信 | 承認と対象別ポリシー確認 | スパム・ステマ・虚偽・無断掲載を防ぐ |

「ゼロ稼働」は、危険な操作を無断で行う意味ではなく、顧客が許可した範囲でAIXが定常運用を代行する意味に定義する。

## 4. 売上に近づく方法の全調査

### 4.1 自社サイトの買い手情報を増やす

**何をするか**: 商品/サービスの対象、解決する課題、適さないケース、価格の考え方、導入手順、期間、連携、セキュリティ、比較軸、実績、FAQを、買い手の質問ごとに一つの公開ページへ整理する。

**なぜ効く可能性があるか**: AIや検索が参照できる具体的な事実と、訪問者が比較・問い合わせするための材料が増える。Googleは人の役に立つ独自情報、経験、正確さ、鮮度を重視し、検索エンジンのためだけの大量生成を推奨していない。

**自動化**: 高（公開ページの事実を抽出し、欠落を指摘し、下書きを作れる）。顧客固有の事実・主張は承認が必要。

**AIXの実装**: Buyer Prompt → Evidence Gap → Change Pack → PR/CMS Draft → 再測定。

参考: [Googleの生成AI検索向けガイド](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)、[Helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)、[Googleの生成AIコンテンツ方針](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content)

### 4.2 クロール・インデックス・エンティティを整える

**何をするか**: robots.txt、noindex、canonical、sitemap、タイトル、見出し、内部リンク、会社/商品/サービスのJSON-LD、アクセシビリティ、表示速度、モバイル表示を監査し、詰まりを直す。

**なぜ効く可能性があるか**: 読めない・登録できない・会社とページの対応が曖昧という技術的な損失を減らす。Googleは生成AI検索でも通常のクロール・インデックス・検索品質の基盤を使うと説明している。

**自動化**: 監査は高、変更は中。誤ったrobots/noindexは大きな損失になるため、公開前の差分とロールバックを必須にする。

**注意**: 正しい構造化データを置いても表示・順位は保証されない。本文と一致しないマークアップや偽レビューは禁止される。

参考: [Sitemapの仕様](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)、[構造化データの一般方針](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)、[Organization構造化データ](https://developers.google.com/search/docs/appearance/structured-data/organization)

### 4.3 AIごとの公開クローラーを許可・計測する

**何をするか**: ChatGPT Searchの`OAI-SearchBot`、Perplexityの`PerplexityBot`、Anthropicの`Claude-User`などが公開ページを取得できるかを確認する。OpenAIの`GPTBot`（学習）と`OAI-SearchBot`（検索表示）は目的が別である。

**なぜ効く可能性があるか**: ブロック設定による機会損失を避け、ChatGPTからの流入を`utm_source=chatgpt.com`で計測できる。

**自動化**: 監査は高、robots変更は承認/ポリシー管理が必要。

**注意**: クローラーを許可しても推薦や引用は保証されない。

参考: [OpenAI Publishers and Developers FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)、[Perplexity crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)、[Anthropic web crawling](https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)

### 4.4 Search Console・Bingを接続する

**何をするか**: 所有権確認後、Google Search ConsoleのURL検査、sitemap送信、生成AI検索の表示レポートを取得する。Bing Webmaster ToolsのAI Performance、検索/クロール指標、IndexNow通知を取得する。

**なぜ効く可能性があるか**: AIXの合成プロンプト観測だけでなく、実際の検索面で表示されたURL・国・端末・日付・引用状況を確認できる。

**自動化**: 高（OAuth後）。ただし、Search Console/Bingは対象サイトの所有権とAPI権限が必要。

**注意**: Search Consoleの表示やBingのCitation Shareは、売上の因果や内部順位の開示ではない。IndexNowも通知であって掲載保証ではない。

参考: [Search Console API](https://developers.google.com/webmaster-tools)、[Google生成AIパフォーマンスレポート](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports)、[Bing Webmaster Tools](https://learn.microsoft.com/en-us/bingwebmaster/)、[Bing IndexNow](https://www.bing.com/indexnow/getstarted)

### 4.5 実装までつなぐ（GitHub/CMS）

**何をするか**: AIXが作ったChange Packを、GitHubのブランチ/PRまたはWordPress等のDraftとして作成し、差分・根拠・関連質問・公開前チェックを残す。

**なぜ効く可能性があるか**: 診断結果を顧客が転記する手間をなくし、公開までの遅延を減らす。変更が公開されなければ、AIや検索が読める内容も変わらない。

**自動化**: 高（PR/Draftまで）。本番公開は顧客ポリシーと権限で分ける。

**必要条件**: verified domain/repository、最小スコープOAuth、レビュー、監査ログ、重複実行防止、ロールバック。

参考: [GitHub Pull Requests REST API](https://docs.github.com/en/rest/pulls/pulls)、[GitHub Repositories REST API](https://docs.github.com/en/rest/repos)、[WordPress REST API](https://developer.wordpress.org/rest-api/reference/posts/)

### 4.6 第三者の本物の根拠を増やす

**何をするか**: 顧客の許可を得た導入事例、パートナー/業界団体ページ、実際の取材・寄稿、比較サイトの正確なプロフィール、顧客が自由意思で書いたレビューを整える。

**なぜ効く可能性があるか**: 自社の主張だけではなく、買い手が確認できる独立した根拠が増える。既存のAI可視性製品も引用ドメイン、競合、言及、感情、外部流入を測定対象にしている。

**自動化**: 低〜中。候補リスト、依頼文、事実台帳、掲載状況の監視は自動化できるが、第三者の掲載・レビューをAIXが作ってはいけない。

**禁止**: 偽レビュー、報酬付きレビュー、競合ページへの妨害投稿、同じ内容の大量転載、権利のないロゴ/事例の掲載。Googleはインセンティブ付きレビューや選択的な高評価依頼を禁止し、違反時はプロフィール制限の可能性がある。Google Business Profileの第三者管理も、所有者の明示同意と正確な変更が必要。

参考: [Googleレビューのベストプラクティス](https://support.google.com/business/answer/3474122?hl=en-en)、[Google Business Profile第三者ポリシー](https://support.google.com/business/answer/7353941?hl=en)、[Googleスパムポリシー](https://developers.google.com/search/docs/essentials/spam-policies)

### 4.7 Google Business Profile / ローカル情報

**適用範囲**: 店舗、拠点、訪問型サービスなど場所が意思決定に関係する場合のみ。B2B SaaSや全国向けサービスに一律適用しない。

**何をするか**: 公式プロフィールを確認・申請し、住所、営業時間、カテゴリ、写真、サービス、正直なレビューへの返信を整える。

**限界**: Googleはローカル順位を主に関連性、距離、知名度/人気などで説明しており、支払いで順位を買う方法はない。AIXはプロフィールを勝手に取得・変更しない。

参考: [Google Business Profileのローカル順位](https://support.google.com/business/answer/7091?hl=en)、[公開情報の出所](https://support.google.com/business/answer/2721884?hl=en)

### 4.8 ECだけに有効な商品フィード/エージェント商取引

GoogleのUniversal Commerce Protocol（UCP）やChatGPTのショッピング/商品フィードは、商品、価格、在庫、配送、購入をAI面につなぐ強い手段になり得る。ただし、対象は承認された商取引であり、一般的なB2Bサービスの「おすすめ順位」を上げる汎用スイッチではない。

UCPはMerchant Center、商品フィード、返品・サポート情報、公開プロフィール、決済/注文API、Googleの承認を前提にする。ChatGPTの商品結果も、商品・価格・レビュー・在庫などのメタデータで独立に選ばれ、広告や提携による有料掲載ではない。

参考: [Google UCPガイド](https://developers.google.com/merchant/ucp)、[UCP実装概要](https://developers.google.com/merchant/ucp/guides/overview)、[ChatGPTショッピング結果](https://help.openai.com/en/articles/11128490-improved-shopping-results-from-chatgpt-search)

### 4.9 AI流入から問い合わせ・商談・受注へつなぐ

**何をするか**: AI流入のUTM、フォーム/デモ/電話イベント、CRMのリードソース、商談ステージ、受注額をつなぐ。HubSpotなどのCRMでは、コンタクトと取引をAPIで作成・更新・関連付けできる。

**なぜ効く可能性があるか**: 「AIに引用された」で止めず、どのページ・質問・流入が有望行動や案件に結び付いたかを判断できる。

**自動化**: 中〜高。フォーム/分析/CRMの所有権、個人情報の処理目的、同意、保持期間、アクセス制御が必要。

**AIXが表示するもの**: AI経由セッション、AI流入ページ、コンバージョン、案件、受注の観測値と帰属モデル。プロンプト順位と売上は別系列で並べ、因果を断定しない。

参考: [HubSpot Deals API](https://developers.hubspot.com/docs/api-reference/latest/crm/objects/deals/guide)、[Google Analytics conversion reports](https://developers.google.com/analytics/devguides/reporting/data/v1/conversions-api-basics)、[OpenAI流入のUTM説明](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)

### 4.10 コンバージョン率を上げる

**何をするか**: AI/検索から訪れた人が最初に見るページに、対象顧客、解決する課題、選ぶ基準、証拠、次の行動を配置する。フォームを短くし、デモ予約・資料・問い合わせの選択肢と計測を用意する。モバイル、速度、アクセシビリティ、信頼情報を確認する。

**なぜ効く可能性があるか**: 候補入りを増やしても、訪問者が次の行動を取れなければ売上にならない。ここはAI SEOと独立したCRO領域である。

**自動化**: 監査・A/B案は高、実ページ変更はPR/Draft。価格・法的表現・フォームの個人情報項目は承認必須。

### 4.11 有料広告・リターゲティング・メール

**何をするか**: AIで顕在化した高意図質問を広告/ランディングページ/メールのテーマに反映し、同意のある訪問者へ再接触する。

**位置づけ**: AI推薦を操作する方法ではなく、需要を確実に取りに行く別チャネル。広告費、同意、頻度、ブランド毀損を管理する。

**AIXの範囲**: 高意図質問・競合差・LP案・広告文案・計測設計。広告入稿や予算変更は別権限・明示承認にする。

### 4.12 定期的な更新と競合変化

**何をするか**: 価格、機能、対象業種、事例、セキュリティ、採用情報、パートナー、競合の公開ページを監視し、期限切れの主張や比較表を更新する。

**なぜ効く可能性があるか**: 古い情報はAI/検索にも訪問者にも不利で、誤った比較・問い合わせを生む。Watchは活動ログではなく、前回の変更が同じ買い手質問に影響したかを見る場所にする。

**自動化**: 高（差分検出、期限通知、再測定）。事実更新の承認は必要。

## 5. 既存サービスから学べること

公式機能説明を照合すると、Ahrefs Brand Radar、Semrush AI Visibility、Profound、Scrunchなどは、プロンプト/トピック、言及、引用、競合、出典、感情、AI流入、レポートを束ねている。これは「測定だけ」はすでに競争が激しいことを示す。

共通している設計:

- まず現在地と競合差を見せる。
- 質問/トピック単位へ掘り下げる。
- 引用元・出典ページ・機会を示す。
- 定期測定とレポートを提供する。
- 一部はコンテンツ案、監査、エージェント/最適化まで広げている。

AIXが同じ土俵で勝つべきではない領域:

- プロンプト数やAI面の数だけを増やすこと。
- 0〜100の独自スコアだけを売ること。
- 「AIに好かれる文章」の大量生成。

AIXが取るべき差:

```text
買い手の質問で負ける
→ その競合と根拠差を確認する
→ 売上に近いActionを一つ選ぶ
→ 顧客の許可した場所へ実装可能な差分を渡す
→ AI・検索・流入・商談・受注を同じ変更IDで追う
```

参考: [Ahrefs Brand Radar](https://help.ahrefs.com/en/articles/11064852-what-is-brand-radar-and-how-to-use-it)、[Semrush AI Visibility](https://www.semrush.com/solutions/ai-visibility/)、[Profound Answer Engine Insights](https://www.tryprofound.com/features/answer-engine-insights)、[ScrunchのAI可視性指標](https://helpcenter.scrunchai.com/en/collections/18197161-metrics-kpis)

### 5.1 既存サービスはどこまで自動実行しているか

既存サービスは一括りにできない。公式説明を読むと、次の三種類に分かれる。

| 種類 | 実例 | 実際にしていること | 責任・安全の境界 |
|---|---|---|---|
| 測定・発見 | Ahrefs Brand Radar、Semrush AI Visibility、Profound、Scrunch | AI回答、言及、Citation、競合、出典、コンテンツ機会を定期観測 | 公式説明の中心は分析と提案。顧客サイトの本番変更を当然に行う商品ではない |
| 承認付き実行 | Orbitr | サイト証拠を読み、変更案を作り、承認後、接続先が対応する場合だけ実行し、公開URLを検証 | 権限・接続先・証拠が揃わない操作は実行しない。すべての提案が自動公開できるとは約束しない |
| 低リスク変更の自動反映 | Alli AI、Search Atlas OTTO | Alli AIはエッジのオーバーレイでtitle等をプレビュー後に反映し、無効化で戻せると説明。OTTOは自動運転と承認モード、変更履歴・ロールバックを説明 | いずれもベンダー自身の説明であり、成果保証の証拠ではない。自動化を選ぶ運営者が変更責任を負う |

具体的には、Alli AIは「プレビューしてから公開」「1クリックでロールバック」「ソースコード/CMSを直接変更しない」という設計を掲げる一方、サイトへのスニペット等の導入と運営者のApproveを必要とする。Search AtlasのOTTOは、技術SEO・ページ変更・コンテンツ等を自動反映し、承認モードも選べると説明している。これらは「AIが勝手に判断して無制限に本番を書く」ことの根拠ではなく、接続したサイトで、運営者が選んだ自動化モードを実行するサービスである。

Orbitrの公開ドキュメントは、`inspect → strategy → review/approve → execute → verify`を分離し、利用可能な操作はプラットフォーム、付与権限、証拠に依存すると明記している。これはAIXが採用すべき責任分界に近い。

さらに、実装先のAPIも「書ける」ことと「無条件に書いてよい」ことを分けている。GitHubはブランチ/PRを作成でき、WordPress REST APIはDraftやPublishの状態を持つ。AIXはデフォルトをPR/Draftにし、顧客が選んだ低リスク操作だけを別途自動化するのが安全である。

参考: [Alli AIの自動反映とロールバック](https://www.alliai.com/ai-seo-software)、[Search Atlas OTTO](https://searchatlas.com/otto-seo/)、[Orbitrの権限と実行](https://docs.getorbitr.com/)、[GitHub Pull Requests API](https://docs.github.com/en/rest/pulls/pulls)、[WordPress REST API](https://developer.wordpress.org/rest-api/reference/posts/)

### 5.2 「できる」と「責任を取れる」は別

技術的には、OAuth/API/スニペット/エッジレイヤーを使えば自動反映できる。しかし、次を満たさない自動化はAIXでは採用しない。

1. 対象ドメインと接続先の所有者が明示的に許可している。
2. 操作ごとの最小権限、対象URL、期間、実行者が記録される。
3. 本番前に差分を見られ、承認モードへ戻せる。
4. 失敗時に即時停止・ロールバックできる。
5. 料金、効果、認証、事例、レビュー、法令・安全表現は自動公開しない。
6. 公開後にURL、クロール、検索/AI表示、流入、問い合わせを検証する。
7. 何を根拠に変えたか、誰が許可したか、いつ戻したかを追える。

Google Business Profileでは第三者が管理する場合も所有者の明示同意が必要で、レビュー返信には明示承認が必要とされる。第三者が「上位表示を保証する」と主張することも禁止されている。したがって、外部プロフィール・レビュー・PRまでAIXが無断で書く設計は、技術的に可能でも商品として不適切である。

参考: [Google Business Profile第三者ポリシー](https://support.google.com/business/answer/7353941?hl=en)、[Googleレビューのポリシー](https://support.google.com/business/answer/3474122?hl=en)、[Googleの第三者SEOツールへの注意](https://developers.google.com/search/docs/fundamentals/third-party-seo)

## 6. AIXの現在地と不足

### すでにあるもの（コードで確認済み）

- 会社名・商品名・サービス名またはURLから診断先を確定し、公開ページをクロールしてrobots/noindex/sitemap/canonical/JSON-LD/見出し/購入前情報を監査する。
- OpenAI、Gemini、Perplexityの観測結果から、同一Buyer Promptの候補入り、競合、Citation、Evidence差を保存する。
- Measurement Completenessを分け、取得失敗を「自社が負けた」と数えない。
- Watchで固定パネルを再測定する。
- 公開ページと確認済み企業入力だけから、Change PackとAI-readable下書きを作る。
- `llms.txt`/JSON-LDはダウンロード可能な公開前下書きであり、顧客サイトへ自動公開しない。
- Supabaseが設定されればScan/Watch/Change PackのJSONBを永続化し、未設定時はローカルのインメモリへフォールバックする。

### まだないもの

- Search Console/Bing/GA4/CRMの所有権付き接続。
- GitHub PR、CMS Draft、公開後の自動再測定の実行アダプター。
- 承認ポリシー、差分、監査ログ、ロールバックを持つExecution Layer。
- AI流入 → 問い合わせ → 商談 → 受注を接続するOutcome Ledger。
- 顧客の事実の有効期限、変更責任者、第三者掲載の許諾・訂正・削除台帳。
- 低リスク/高リスク変更を分ける自動公開制御。

したがって、現在のAIXを「使うだけで売上が上がる自動運転」と呼ぶのはまだ早い。現在は、損失の発見、根拠のある下書き、同じ質問での再測定までが実装された状態である。

## 7. 推奨する実装順

### P0 — 今ある結果を「売上に近い順」にする

1. DiscoveryでBuyer Promptに意図（比較、価格、導入、代替、緊急度）と推定商談価値を付ける。
2. Actionを「関連質問数 × 目標行動への近さ × 根拠の強さ ÷ 実装工数」で優先する。
3. 結果画面の主文を、順位ではなく「この質問で競合に取られている候補枠」「次に公開する変更」「確認方法」にする。
4. Change Packに変更ID、使用事実、対象Prompt、想定イベント、期限を持たせる。

### P1 — 接続して、転記をなくす

1. Google Search Console: OAuth、プロパティ所有権、URL検査、sitemap、生成AIレポート。
2. Bing Webmaster: OAuth、AI Performance、IndexNow、クロール指標。
3. GitHub App: ブランチ/PRのみ。mainへ直接書かない。
4. WordPress等: Draftのみ。Publishは顧客ポリシーで許可された場合だけ。
5. GA4: AI referrer、ランディングページ、フォーム/デモイベント。
6. CRM: まず読み取り、次にAI接点を記録する最小限の書き込み。HubSpot等のスコープと個人情報を明示する。

### P2 — 許可した範囲だけ自動実行する

1. 自動化ポリシーを初回に選択（Draft / PR / Safe auto-publish）。
2. 既存の確認済み事実から生成した低リスク変更だけ自動公開可能にする。
3. 料金、効果、証言、規制対象、robots/noindex、第三者掲載は承認待ち。
4. すべての実行にidempotency key、diff、actor、根拠、時刻、rollbackを記録する。
5. 公開後に再クロール、同一Prompt、検索/AI/GA4/CRMの遅延を考慮して自動評価する。

### P3 — 運用代行として売る

- 顧客ごとにICP、禁止事項、事実台帳、承認者、SLA、停止条件を登録する。
- AIXが毎週、変更を一つに絞って実装・確認し、重要な変化だけ通知する。
- 高リスク業界は専門担当者のレビューをサービスに含める。
- EC顧客だけUCP/商品フィードを別パッケージで扱う。

## 8. 料金・商品設計の仮説

価格は市場調査の確定値ではなく、現在のAIX機能から検証する仮説とする。

| 商品 | 顧客が買う結果 | AIXの作業 | 位置づけ |
|---|---|---|---|
| Free Scan | どの買い手質問で負けているか | FIND + EXPLAIN | 価値を実データで体験 |
| 14-day Watch | 最初の変更後に同じ質問が動いたか | PROVE | 継続判断 |
| Founder Watch（現行案） | 毎週どこを直すか分かる | ACT + PROVE、Change Pack | 月額プロダクト |
| Managed Autopilot（追加案） | 公開・計測・改善まで任せられる | 接続、PR/CMS、承認運用、Outcome Ledger | セットアップ費 + 高単価月額を検証 |

Managed Autopilotの価格は、プロンプト数ではなく、対象ドメイン数、実装量、接続数、レビュー責任、SLA、売上計測まで含めて見積もる。効果を保証する成功報酬だけに依存せず、固定費 + 明確な成果指標の組み合わせを検証する。

## 9. 成功判定と実験方法

### 最低限のNorth Star

**AI接点を含む有望商談の創出と受注額**。プロンプトの候補入り率は先行指標として並べる。

### Change ID単位で記録する項目

- 公開したページ/PR/CMS Draftと公開時刻。
- 使った事実と根拠URL、事実の確認者、有効期限。
- 対象Buyer Prompt、プロバイダー、地域、言語、モデル、測定時刻。
- 変更前後の候補入り、Citation、検索表示、AI流入、フォーム、CRMステージ。
- 競合の更新、モデル更新、季節要因、広告などの外部要因。

### 判定ルール

- 固定Core Promptを変えず、同じ地域・言語・プロバイダー・期間で比較する。
- 1回の回答ではなく複数回の反復とMeasurement Completenessを併記する。
- 変更前後だけで因果を断定しない。可能なら未変更ページ/質問のホールドアウトを置く。
- AI観測、検索表示、AI流入、問い合わせ、商談、受注を別系列で保持する。
- 30/60/90日の遅延を考慮し、短期の順位変化だけで成功/失敗を決めない。

## 10. 絶対に売らないもの

- 「AIXにURLを入れれば、全AIがあなたを推薦する」という保証。
- 「AIの内部順位を見ている」「Googleの内部スコアを使っている」という表現。
- `llms.txt`、JSON-LD、クローラー許可だけで順位が上がるという表現。
- Buyer Prompt数を失注数、顧客数、売上に変換すること。
- 大量の薄いAI記事、コピー、偽の第三者言及、レビュー操作。
- 顧客サイト、広告、CRM、第三者プロフィールへの無断書き込み。
- 単純な前後差をAIXの因果的な売上増加として報告すること。

Googleは、第三者ツールには内部ランキング/AIシステムへのアクセスがなく、成果保証ができないと明示している。また、生成AIで価値のない大量ページを作ることはスパムポリシーに触れ得る。ここを商品設計の中心に置く。

参考: [Googleの第三者SEOツールへの注意](https://developers.google.com/search/docs/fundamentals/third-party-seo)、[Googleスパムポリシー](https://developers.google.com/search/docs/essentials/spam-policies)

## 11. 最終判断

根本目的は「AIに好かれること」ではなく、**自社が知られ、比較に入り、信頼され、問い合わせ・商談・受注につながること**。

AIXの勝ち筋は、AI順位表を増やすことではない。

```text
顧客のURLを読む
→ 売上に近い買い手質問を見つける
→ 競合が持つ根拠との差を特定する
→ 事実確認済みの変更を公開可能な差分にする
→ 許可された接続先へ渡す/公開する
→ AI・検索・流入・案件・受注を追う
→ 次の変更を自動で選ぶ
```

この運用を実装して初めて、「AIXに任せれば、顧客の定常稼働なしに、AI検索を含む需要獲得と売上改善を進める」という価値を提供できる。現時点のリポジトリはこのうち最初の診断〜下書き〜再測定までで、接続・公開反映・Outcome Ledger・運用代行は次段である。
