# Rovan Core Product Strategy

> この文書は、Rovanの「本質」「現状」「不足しているもの」「何を優先して実装するか」を一つにまとめた中核設計書です。
>
> 最終更新: 2026-09-05

---

## 0. 結論

Rovanは単なる「AI SEO診断ツール」でも、「AIが読めるJSON/DBを生成するツール」でもない。

Rovanが作るべきものは、次の閉ループである。

```text
企業URL
  ↓
市場・競合・Buyer Promptを理解
  ↓
OpenAI / Gemini / Perplexity等で実際の推薦結果を観測
  ↓
競合がなぜ選ばれ、自社がなぜ落ちたかをEvidence単位で分解
  ↓
自社と競合のClaim Graphを構築
  ↓
不足している事実だけを特定
  ↓
必要なら企業に最小限だけ質問
  ↓
Webページ / FAQ / JSON-LD / AI-readable profile / Rovan DBを更新
  ↓
GitHub PR / WordPress Draftとして安全に反映
  ↓
同じBuyer Promptで再測定
  ↓
改善したか確認
  ↓
効かなければ次の施策
```

Rovanの本当の商品は、DBそのものではない。

**「AIが企業を比較・推薦するために必要な情報を発見し、構造化し、公開し、その結果本当に選ばれるようになったかまで継続検証するシステム」**である。

---

# 1. Rovanの本質

## 1.1 顧客が欲しいもの

顧客は以下を欲しいわけではない。

- JSON-LD
- llms.txt
- FAQ生成
- スコア
- レポート
- ダッシュボード
- AI-readable database

これらはすべて手段である。

顧客が本当に欲しいのは、

> **ChatGPT、Gemini、Perplexity等が購買判断をするとき、自社を正しく理解し、比較候補に入れ、適切な条件では推薦できる状態。**

である。

したがって、Rovanの価値は以下の順番で考える。

```text
AI-readable
  ↓
AI-understandable
  ↓
AI-comparable
  ↓
AI-trustable
  ↓
AI-recommendable
```

「読める」は最初の一段でしかない。

---

## 1.2 Rovanの中核概念

Rovanは企業情報を、単なるページ集合ではなく、AIが比較判断に使える構造へ変換する。

理想形:

```text
Entity
  └─ Product
      ├─ Audience
      ├─ Use Case
      ├─ Feature
      ├─ Price
      ├─ Implementation
      ├─ Support
      ├─ Security / Trust
      └─ Claim
          ├─ Evidence
          ├─ Source
          ├─ Validity / Updated At
          ├─ Confidence
          └─ Relevant Buyer Prompts
```

これを本書では **Claim Graph** と呼ぶ。

---

# 2. 現在のRovanで既にできていること

現在の実装には、かなり多くの外殻が既に存在する。

## 2.1 観測

`lib/scan-runner.ts`

- URLクロール
- 企業 / ブランド / 市場 / 競合発見
- Buyer Prompt生成
- OpenAI / Gemini / Perplexity測定
- Raw Answer保存
- Citation保存
- Recommendation Coverage
- First Choice Rate
- Citation Coverage
- Repeat Agreement
- Lost Prompt抽出

つまり「AIが今どう答えているかを見る」機能はある。

## 2.2 継続監視

Rovan Watchとして、固定Panelによる再測定・履歴保存がある。

これにより、単発診断ではなく時系列比較を行うための土台がある。

## 2.3 Evidence

企業からEvidenceを受け取り、URL / PDF / Image等を保存できる基盤がある。

## 2.4 Change Pack

`lib/change-pack.ts`

- Heading
- Body
- FAQ
- JSON-LD
- Internal Link
- Review Checklist

まで生成できる。

## 2.5 安全な反映

- GitHub Pull Request
- WordPress Draft
- Domain ownership verification
- 人間の承認必須
- mainへの直接書き込み禁止

という安全設計がある。

## 2.6 Public Profile / Market DB

`lib/public-profiles.ts`

すでに以下を持つ公開プロフィール構造がある。

- Company
- Brand
- Domain
- Market
- Measurement
- Evidence
- Competitors
- Opportunities

さらに、

- `/companies/[slug]`
- `/categories/[slug]`

として企業ページ、市場比較ページを公開する仕組みもある。

つまり、**Rovan自身がAIや検索エンジンに読まれる市場DBになるための土台も存在する。**

---

# 3. 現在の最大の欠陥

## 3.1 Evidence Gap判定が浅い

現在の`defaultEvidenceGaps()`は、主に以下の固定項目を確認している。

- 導入企業数・顧客数
- 平均導入期間
- 導入効果・ROI
- 導入・運用サポート

そして、公開ページ本文に特定キーワードが存在するかどうかで不足を推定している。

これはMVPとしてはよいが、Rovanの最終価値としては弱い。

今のロジックは大雑把に言うと、

```text
自社が推薦されなかった
  ↓
サイトに「導入期間」という語がない
  ↓
導入期間を公開しよう
```

になっている。

本来必要なのは、

```text
Buyer Promptで自社が落ちた
  ↓
競合Aが勝った
  ↓
競合Aが回答内で選ばれた理由を抽出
  ↓
その理由を支えるCitationを読む
  ↓
比較軸をClaimとして分解
  ↓
自社に同等Claimが存在するか確認
  ↓
ClaimがあるならEvidenceが公開されているか確認
  ↓
不足している差分だけを特定
```

である。

---

# 4. 最優先で作るもの: Competitive Evidence Engine

## 4.1 目的

各Buyer Promptについて、

> **なぜ競合が勝ち、自社が負けたのかをEvidenceレベルまで説明する。**

これをRovanの中核エンジンにする。

---

## 4.2 例

Buyer Prompt:

> 従業員100人くらいで、導入しやすい勤怠管理サービスは？

AI回答で競合Aが推薦されたとする。

Rovanは回答とCitationから、競合Aについて次を抽出する。

```text
Audience fit
- 50〜300名向け

Implementation
- 最短2週間
- CSV移行対応

Support
- 専任導入担当

Price
- 初期費用0円
```

次に自社を同じ比較軸で評価する。

```text
50〜300名向け      → Evidenceあり
最短2週間          → 不明
CSV移行            → Evidenceあり
専任導入担当       → 不明
初期費用0円        → Evidenceあり
```

Rovanの出力:

```text
このPromptで負けている主要差分

1. 導入期間
   競合A: 最短2週間という比較可能なEvidenceあり
   自社: 公開Evidenceを確認できず

2. 導入支援体制
   競合A: 専任担当を明記
   自社: 支援内容はあるが担当体制が不明

推奨対応:
- /implementation に平均/最短導入期間を追加
- /support に導入担当体制を追加

関連Buyer Prompts:
- P03
- P08
- P17
```

これがRovanの価値になる。

---

## 4.3 Competitive Evidence Engineの処理

```text
Observation
  ↓
Winner detection
  ↓
Recommendation reason extraction
  ↓
Citation fetch / parse
  ↓
Decision factor extraction
  ↓
Competitor Claim generation
  ↓
Own Claim matching
  ↓
Evidence verification
  ↓
Gap classification
  ↓
Priority scoring
```

---

# 5. Claim Graph

## 5.1 なぜ必要か

現在のPublic Profileは、企業・Evidence・測定結果を保存できるが、比較判断に必要な関係がまだ弱い。

Rovan内部では、最低限次の単位へ分ける。

## 5.2 Proposed data model

### Entity

```ts
Entity {
  id
  type: company | brand | product
  name
  aliases
  domain
}
```

### Claim

```ts
Claim {
  id
  entityId
  dimension
  subject
  predicate
  value
  unit?
  conditions?
  sourceType
  confidence
  firstSeenAt
  lastVerifiedAt
}
```

`dimension`例:

- audience
- price
- feature
- integration
- implementation
- support
- security
- compliance
- proof
- roi
- availability
- geography
- contract

### Evidence

```ts
Evidence {
  id
  claimId
  sourceUrl
  sourceTitle
  sourceOwner
  quotedFact
  retrievedAt
  status
}
```

### PromptClaimRelation

```ts
PromptClaimRelation {
  promptId
  claimId
  relevance
  observedInfluence
  providerAgreement
}
```

### CompetitiveGap

```ts
CompetitiveGap {
  promptId
  ownEntityId
  competitorEntityId
  dimension
  competitorClaimId
  ownClaimId?
  gapType
  confidence
  priority
}
```

`gapType`例:

- missing_claim
- missing_evidence
- weak_specificity
- stale_evidence
- weaker_proof
- missing_third_party_authority
- contradictory_information
- entity_ambiguity

---

# 6. 自動Evidence収集

ユーザーに大量入力させない。

Rovanの原則は、

> **公開情報から取れるものはRovanが勝手に取る。ユーザーに聞くのは、公開情報からどうしても分からない事実だけ。**

とする。

## 6.1 自動収集対象

- 自社公式サイト
- Pricing
- Product pages
- FAQ
- Case studies
- Security / Trust center
- Help center
- Docs
- Changelog
- 公開PDF
- Structured data
- Sitemap
- robots.txt

必要に応じて、正当な公開第三者Sourceも分析対象にする。

## 6.2 ユーザーへの質問

悪い例:

```text
会社情報を入力してください。
価格を入力してください。
導入期間を入力してください。
サポート内容を入力してください。
```

良い例:

```text
Rovanが公開Webを確認しましたが、
「平均導入期間」だけ確認できませんでした。

この情報はBuyer Prompt 4 / 8 / 11に影響する可能性があります。

平均導入期間は？
[  ] 日 / 週間 / ヶ月
```

つまり、入力フォームではなく **Missing Fact Inbox** にする。

---

# 7. Rovan自身をAIのSourceにする

これは重要な第2軸である。

Rovanは顧客サイトだけを改善するのではなく、Rovan自身にも企業・市場・比較情報を蓄積する。

## 7.1 2つのSource

```text
顧客公式サイト
+
Rovan Public Profile / Market DB
```

企業情報が二つの独立した公開Sourceに存在する状態を作る。

ただし、Rovan Profileは広告ページにしてはいけない。

## 7.2 独立性

以下を厳守する。

- 有料契約の有無で測定順位を変えない
- 有料契約の有無でComparison rankingを変えない
- 企業提供EvidenceとRovan観測値を分離表示
- Source / timestamp / confidenceを表示
- 誤情報訂正手段を持つ
- Unclaimed企業も掲載可能

この独立性がないと、Rovan自身のSource価値が死ぬ。

---

# 8. 非顧客企業もDB化する

顧客だけをDBに入れてはいけない。

市場単位で競合も構造化する。

```text
Market
├─ Company A (Claimed)
├─ Company B (Unclaimed)
├─ Company C (Unclaimed)
├─ Company D (Claimed)
└─ Company E (Unclaimed)
```

## 8.1 Unclaimed Profile

公開情報だけから生成する。

- 会社
- Product
- Category
- Target
- Price
- Features
- Evidence
- Citation
- Last checked

## 8.2 Claimed Profile

ドメイン所有確認後、企業が追加Evidenceを提出できる。

ただし企業提供情報には明確にラベルを付ける。

これによりRovanは、単なる顧客向けSaaSから、**市場そのものの構造化DB**へ成長できる。

---

# 9. Change Packを「作文」から「修正」に変える

現在のChange Pack生成機構は活かす。

ただし入力を強くする。

現在:

```text
Evidence Gap
  ↓
LLM
  ↓
文章生成
```

目標:

```text
Lost Buyer Prompt
  ↓
Winner Reason
  ↓
Competitor Claim
  ↓
Competitor Evidence
  ↓
Own Claim / Evidence
  ↓
Competitive Gap
  ↓
Required Fact
  ↓
Exact Change Pack
```

Change Packには必ず以下を紐付ける。

- 対象Buyer Prompt
- 改善対象Dimension
- 競合Evidence
- 自社Evidence
- Gap type
- Expected affected prompts
- 変更対象ページ
- 公開すべきClaim
- 根拠

これでChange Packは「AIが作ったSEO文章」ではなく、**観測された競合差分を埋める修正パッチ**になる。

---

# 10. 最大の継続価値: Change → Remeasure

Rovanは変更を提案して終わってはいけない。

## 10.1 必須ループ

```text
Baseline measurement
  ↓
Change Pack
  ↓
Approved publish
  ↓
Recrawl
  ↓
Same Core Buyer Prompt Panel
  ↓
Remeasure
  ↓
Before / After comparison
```

## 10.2 Change Impact

例:

```text
Change Pack #CP-102
公開日: 2026-09-05

変更:
- 導入期間を追加
- 100〜300名導入事例を追加

Affected Buyer Prompts: 7

Before
Recommendation Coverage: 31%

After
Recommendation Coverage: 53%

Observed uplift: +22pt

Prompt impact
P03: 0% → 67%
P08: 33% → 67%
P17: unchanged
```

## 10.3 因果の扱い

Rovanは「この変更が100%原因」と断定してはいけない。

以下を分離する。

- Observed uplift
- Temporal association
- Provider agreement
- Prompt-level agreement
- Causal confidence

競合変更、AIモデル更新、Web index更新など外部要因があるため。

---

# 11. 優先順位

今後、UIの微調整より以下を優先する。

| Priority | Work | Why |
|---|---|---|
| P0 | Competitive Evidence Engine | Rovanの頭脳。現状最大の弱点 |
| P0 | Claim Graph | AI比較判断を構造化する基盤 |
| P0 | Dynamic Evidence Gap | 固定4項目判定を廃止するため |
| P1 | Automatic Evidence Extraction | ユーザー入力を減らす |
| P1 | Change → Remeasure attribution | 継続課金の核心 |
| P1 | Unclaimed competitor profiles | 市場DB化と比較精度 |
| P2 | Rovan Market DB強化 | Rovan自身のSource価値 |
| P2 | Missing Fact Inbox | 企業から必要事実だけ取得 |
| P3 | UI polish | 上記が終わった後 |

---

# 12. 具体的な実装順序

## Phase 1 — Competitive Intelligence Core

### 1. Observation reason extraction

新規候補:

```text
lib/recommendation-reasons.ts
```

各Observationから以下を抽出。

- recommended entity
- reason
- decision dimension
- cited source
- confidence

### 2. Citation evidence parser

新規候補:

```text
lib/citation-evidence.ts
```

Citation先から比較可能Factを抽出。

### 3. Claim Graph storage

新規候補:

```text
lib/claims.ts
lib/claim-graph.ts
```

Supabase migrationを追加。

### 4. Competitive Gap engine

新規候補:

```text
lib/competitive-gaps.ts
```

固定`defaultEvidenceGaps()`を置き換える。

---

## Phase 2 — Action Engine

### 5. Missing Fact Inbox

Competitive Gapのうち、公開Webで解決できないものだけユーザーへ質問。

### 6. Change Pack v2

`lib/change-pack.ts`をClaim/Gaps drivenへ変更。

### 7. Change lineage

各Change Packに以下を保存。

- baseline scan id
- prompt ids
- gap ids
- claim ids
- publishedAt
- deployment target

---

## Phase 3 — Validation Loop

### 8. Automatic post-change rerun

公開から一定期間後、同一Panelを再測定。

### 9. Change Impact

Before/AfterをPrompt単位・Provider単位で比較。

### 10. Next Action

効いた場合:

```text
Keep / Expand
```

効かなかった場合:

```text
Try next gap
Investigate third-party authority
Investigate entity ambiguity
Investigate citation weakness
```

---

## Phase 4 — Market Intelligence Network

### 11. Unclaimed profiles

Rovan非契約企業も公開情報から作成。

### 12. Category claim schema

市場ごとに比較軸を蓄積。

例:

```text
勤怠管理
- employee size
- price
- implementation time
- integrations
- payroll compatibility
- support
- security
```

市場が増えるほど、Rovanが「AIが購入比較に使う判断軸」を学習する。

これ自体がデータ資産になる。

---

# 13. Rovanが持つべきデータ資産

長期的なMoatはUIでもLLMプロンプトでもない。

蓄積すべきデータは以下。

```text
Buyer Prompt
× Market
× Provider
× Time
× Recommended Entity
× Recommendation Reason
× Claim
× Evidence
× Citation
× Change
× After Result
```

これが大量に蓄積すると、Rovanは、

> 「どの市場で、どのAIが、どのようなEvidenceを持つ企業を推薦しやすいか」

を実データで持つことになる。

これは単純なAEO / GEOツールとの差別化になる。

---

# 14. やらないこと

中核が完成するまでは以下を優先しない。

- ダッシュボード装飾の追加
- 意味の薄い総合Score追加
- 新しいチャートを増やす
- 一般的なSEO監査機能
- ブログ記事大量生成
- 根拠のない「AI順位改善」保証
- 単なるllms.txt生成機能
- 単なるSchema生成機能

これらは補助機能であり、RovanのMoatではない。

---

# 15. 成功条件

Rovanの中核機能が完成したと言える条件。

## Test Case

ある会社URLを入力する。

Rovanが以下を自動で行えること。

1. 市場を特定
2. 主要競合を特定
3. Buyer Promptを生成
4. 複数AIで測定
5. Lost Promptを特定
6. 各Lost PromptでWinnerを特定
7. Winnerが選ばれた理由を抽出
8. CitationからClaim/Evidenceを抽出
9. 自社に同じClaim/Evidenceがあるか照合
10. 本当に欠けている差分を特定
11. 公開Webで取れない事実だけ企業へ質問
12. Exact Change Packを作る
13. PRまたはDraftを作る
14. 公開後に同じPanelで再測定
15. Before/Afterを表示
16. 次の最有力アクションを決める

ここまで一つの流れで動いて、初めてRovanの中核が完成したとみなす。

---

# 16. 商品としての説明

内部実装の本質:

> AI-readable企業DB + Claim Graph + Competitive Evidence Engine + Measurement Loop

顧客向けの説明:

> **AIが御社をどう比較しているかを調べ、競合に負けている理由を根拠まで特定し、必要な情報を追加し、その後本当に推薦が増えたかまで自動で確認する。**

短く言うなら:

> **Rovan makes companies understandable, comparable, and recommendable by AI.**

---

# 17. 最終形

Rovanの完成形は以下。

```text
                    ┌─────────────────┐
                    │  Company Website │
                    └────────┬────────┘
                             │ crawl
                             ▼
                    ┌─────────────────┐
                    │   Claim Graph    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
           OpenAI          Gemini       Perplexity
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                    Buyer Prompt Results
                             │
                             ▼
                 Competitive Evidence Engine
                             │
                             ▼
                     Competitive Gaps
                             │
                 ┌───────────┴───────────┐
                 ▼                       ▼
          Missing Fact Inbox        Auto-resolvable
                 │                       │
                 └───────────┬───────────┘
                             ▼
                       Change Pack
                             │
                  ┌──────────┴──────────┐
                  ▼                     ▼
              GitHub PR            WP Draft
                  │                     │
                  └──────────┬──────────┘
                             ▼
                           Publish
                             │
                             ▼
                         Remeasure
                             │
                             ▼
                       Change Impact
                             │
                             └──────→ next action
```

さらに並行して、Claim Graphの公開可能部分をRovan Public Profile / Category DBへ反映する。

その結果、Rovanは、

1. 顧客のAI推薦改善SaaS
2. AIが参照可能な企業・市場データベース
3. AI購買判断を観測する独自データネットワーク

の3つを同時に持つことができる。

---

# 18. 次にやること

**次の開発はUIではなく、P0の3点から開始する。**

```text
1. Competitive Evidence Engine
2. Claim Graph
3. Dynamic Evidence Gap
```

特に、現在の固定`defaultEvidenceGaps()`を中核ロジックとして扱わない。

Rovanが最初に強くすべき能力は、

> **「なぜ競合が勝ったのかを、AI回答とCitationからEvidence単位で特定できること」**

である。

ここが強くなれば、既に存在するWatch、Change Pack、GitHub PR、WordPress Draft、Public Profile、Category DBがすべて一本の価値ループにつながる。
