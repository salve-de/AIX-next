# AIX Continuous Value & Retention Strategy

> AIXを「一回診断して終わるツール」にしないための継続価値設計。
>
> 最終更新: 2026-09-05

---

# 0. 結論

AIXの最大の解約リスクは、ユーザーが一度Scanして結果を見たあと、

```text
へえ、今はこうなのか
  ↓
何個か直す
  ↓
その後どうなったかよく分からない
  ↓
毎月払う理由がない
  ↓
解約
```

になることである。

したがってAIXは「現在の診断結果」を売るのではなく、

> **AIXを導入してから、自社のAI購買ポジションがどう変わったかを継続的に可視化し、AIXが改善を実行し、その結果を再測定し、次の改善まで進め続けるサービス**

にする。

ユーザーが毎月理解できるべきことは4つだけ。

```text
Before
  ↓
AIXが何をした
  ↓
After
  ↓
次に何をする
```

この4点が明確なら、AIXは健康診断ではなく「AI推薦の継続改善担当者」になる。

---

# 1. 継続課金の本質

## 1.1 一回診断では弱い

単発Scanで分かるのは「今どう見えているか」だけ。

それだけでは顧客は一度見れば十分である。

AIXの月額価値は以下に置く。

1. 自社のAI推薦状況を継続観測する
2. 競合の変化を検知する
3. 負けた理由をEvidence単位で特定する
4. AIXが改善案を作る
5. 承認後にPR / Draftを作る
6. 公開後に同じBuyer Promptで再測定する
7. 何が改善したかを表示する
8. 次の最有力改善を自動で決める

つまり、

```text
Measure
→ Explain
→ Fix
→ Publish
→ Remeasure
→ Learn
→ Next Action
```

を回し続けることが月額商品の本体である。

---

# 2. ホーム画面の中心は「現在値」ではなく「AIX導入後の変化」

現在のScoreだけを大きく出してはいけない。

ユーザーが最初に見るべきなのは、

> **AIXを入れてから何が変わったか**

である。

例:

```text
Since AIX started

AI Buyer Share
18% → 31%
+13pt

Recommendation Prompts
9 / 50 → 16 / 50

First Choice
6% → 11%

Citation Prompts
7 → 14

Market Position
4 / 12 → 2 / 12

Gap vs Competitor A
-21pt → -8pt
```

「現在31%」だけではなく、必ずBaselineとの差を見せる。

---

# 3. North Star Metric

AIXには指標が複数ある。

- Recommendation Coverage
- First Choice Rate
- Citation Coverage
- Repeat Agreement
- Market Position

これらは分析上必要だが、顧客向けには主指標を一つ決める。

候補名:

> **AIX Buyer Panel Share**

意味:

> 固定された重要Buyer Prompt Panelに対して、自社がAIの推薦候補に入った割合。

注意:

これは世界中のChatGPT利用者の「市場シェア」ではない。

必ずAIXの測定パネルであることを明記する。

例:

```text
AIX Buyer Panel Share
23% → 27% → 34% → 41%
```

ユーザーが毎週・毎月追える一本のグラフにする。

---

# 4. Change Impactを中核UIにする

`Change → Remeasure`は単なる分析機能ではなく、継続価値の中心にする。

例:

```text
CHANGE IMPACT

9月3日にAIXが変更
- 50〜300名向け導入事例を追加
- 平均導入期間を追加
- CSV移行情報を追加

Affected Buyer Prompts: 11

Before
Recommendation Coverage: 17%

After
Recommendation Coverage: 26%

Observed uplift: +9pt

Provider result
OpenAI      improved
Gemini      improved
Perplexity  unchanged
```

さらにPrompt単位で、

```text
「従業員100名向け勤怠管理」
Before: 推薦なし
After: 2位推薦
```

まで見せる。

重要なのは、AIXが「この変更が100%原因」と断定しないこと。

以下を分離して表示する。

- Observed uplift
- Temporal association
- Provider agreement
- Prompt-level agreement
- Causal confidence

---

# 5. 「今週AIXが何をしたか」を必ず見せる

月額サービスで最も危険なのは、ユーザーが

> 「金を払っているけど何をしてくれているのか分からない」

と思うこと。

そのため、AIX Activityを明示する。

例:

```text
AIX ACTIVITY — THIS MONTH

450 AI answers measured
32 competitor pages checked
18 citation sources analyzed
4 competitive gaps found
3 change packs generated
2 GitHub PRs created
1 measurable improvement detected
```

AIXが裏側で働いた量を可視化する。

ただし「作業量」だけを価値にしない。

Activityは必ず、

```text
Activity
→ Finding
→ Action
→ Result
```

へ接続する。

---

# 6. 競合監視を継続理由にする

自社だけを毎週見ても変化が少なく、飽きる可能性がある。

一方、競合の変化は行動理由になる。

AIXは以下を監視する。

- Recommendation Coverage変化
- 新しいBuyer Promptでの競合出現
- Citation Source変化
- 競合サイトの重要ページ変更
- 新しい価格・プラン
- 新しい導入事例
- 新しいSecurity / Compliance Evidence
- 新しいIntegration
- 新しい第三者評価

例:

```text
COMPETITOR ALERT

Competitor A
AIX Buyer Panel Share +11pt this week

Newly cited page:
competitor.example/security

New evidence detected:
- ISO 27001
- SOC 2
- SSO
- Data residency

Affected Buyer Prompts:
- セキュリティ重視
- 大企業向け
- 情シス向け

AIX finding:
あなたにも同等Evidenceがありますが、AIが確認しやすい公開ページに存在しません。

Next action:
Security Evidence Change Pack ready
```

これなら「競合が動いていないか確認する」という継続理由が生まれる。

---

# 7. 変化がない週にも価値を作る

毎週ランキングが改善するとは限らない。

「上昇した週だけ価値がある」設計にすると、変化がない週が解約理由になる。

AIXは4つの状態すべてに意味を持たせる。

## 7.1 Improved

```text
+4 Buyer Promptsで新しく推薦入り
```

## 7.2 Declined

```text
-2 Buyer Promptsで推薦喪失
競合Aが新しく上位へ
```

## 7.3 Environment changed

```text
GeminiのCitation Source構成が変化
新しい競合がBuyer Prompt 3件に出現
```

## 7.4 Stable

```text
50 Buyer Prompts中48件で状態維持
重大な競合変化なし
AI Provider側の大きな変動なし
```

何も起きていない場合でも、

> **「重大な変化が起きていないことを確認できた」**

という監視価値を提供する。

---

# 8. 常にNext Best Actionを一つ出す

ダッシュボードに大量のOpportunityを並べるだけでは弱い。

ユーザーが知りたいのは、

> **結局、次に何をやれば一番効きそうなのか**

である。

常に一つを最上位に出す。

例:

```text
NEXT BEST ACTION

平均導入期間を公開する

Why now
- 11 Buyer Promptsに関連
- 主要競合3社中3社が公開
- 自社は公開Evidenceなし
- OpenAI / GeminiのLost Promptで共通して関連

Expected affected prompts: 11
Confidence: High

[Change Packを見る]
[承認してPRを作る]
```

Next Best Actionは、

- Impact
- Confidence
- Effort
- Evidence quality
- Provider agreement
- Competitor prevalence

などでPriorityを決める。

---

# 9. 「金を払っとくから勝手に強くしといて」に近づける

ユーザーへ毎週大量の作業を要求してはいけない。

理想的な自動化範囲:

```text
毎週
  ↓
同一Buyer Promptを再測定
  ↓
競合変化を検知
  ↓
Citationを解析
  ↓
Competitive Gapを更新
  ↓
公開情報からEvidenceを補完
  ↓
Change Packを生成
  ↓
GitHub PR / WordPress Draftまで作成
```

ユーザーには、

```text
今週3件の改善案を作りました。

Expected affected prompts: 17
High confidence: 2
Medium confidence: 1

[3件を確認]
```

程度まで入力負荷を落とす。

AIXは勝手に本番公開・main mergeまではしない。

原則:

> **分析・準備・Draft/PRまでは自動。公開は承認付き。**

---

# 10. Monthly Value Report

請求日の前後で、ユーザーが「今月AIXにいくら払う価値があったか」を理解できるレポートを出す。

例:

```text
YOUR AIX MONTH

AI Buyer Panel Share
24% → 36% (+12pt)

Market Position
5 / 14 → 3 / 14

New wins
+7 Buyer Prompts

Lost wins
-1 Buyer Prompt

AIX work
1,350 AI observations
84 competitor pages checked
41 citations analyzed
6 gaps discovered
4 changes prepared
3 changes published

Measured change impact
2 / 3 published changes showed positive observed movement

Biggest win
「100〜300名向け」Prompt cluster
+21pt

Current biggest risk
Competitor B is gaining in Security prompts

Next best action
Publish SSO / Security Evidence
```

このレポートが、更新課金の理由を毎月説明する。

---

# 11. Retention Homeの理想構成

AIX Workspaceのトップ画面は以下の順にする。

## 1. Since AIX Started

最重要KPIとBaseline差。

```text
31%
AIX Buyer Panel Share
+13pt since AIX started
```

## 2. This Week

```text
+4 new recommendation wins
-1 lost recommendation
Competitor A +3pt
2 citation source changes
```

## 3. Change Impact

最近の変更がどう効いたか。

## 4. AIX Activity

今週 / 今月AIXが何をしたか。

## 5. Competitor Alerts

競合の重要変化。

## 6. Next Best Action

次に一番効きそうな一手。

この順番にすることで、ユーザーは数十秒で、

```text
今どうなっている
何が変わった
AIXが何をした
競合はどう動いた
次に何をする
```

を理解できる。

---

# 12. 実装データとして追加すべきもの

最低限、以下を永続化する。

## Baseline

```ts
Baseline {
  watchId
  startedAt
  scanId
  buyerPanelShare
  recommendationCoverage
  firstChoiceRate
  citationCoverage
  marketPosition
}
```

## ChangeLineage

```ts
ChangeLineage {
  changePackId
  baselineScanId
  gapIds
  claimIds
  promptIds
  approvedAt
  publishedAt
  target
}
```

## ChangeImpact

```ts
ChangeImpact {
  changePackId
  beforeScanId
  afterScanId
  observedUplift
  providerAgreement
  promptAgreement
  causalConfidence
  measuredAt
}
```

## CompetitorEvent

```ts
CompetitorEvent {
  competitorId
  type
  sourceUrl
  detectedAt
  affectedPromptIds
  affectedDimensions
  severity
}
```

## ActivityEvent

```ts
ActivityEvent {
  watchId
  type
  objectId
  summary
  createdAt
}
```

---

# 13. 成功条件

AIXの継続価値が完成したと言えるのは、ユーザーが毎月以下を答えられる状態。

1. AIX導入時より良くなったのか
2. どのBuyer Promptで良くなったのか
3. AIXは何をしたのか
4. その変更後に何が起きたのか
5. 競合は今どう動いているのか
6. 今一番危険なことは何か
7. 次に何をすべきか

そしてAIX側は、ユーザーが何もしなくても毎週、

```text
Observe
→ Detect
→ Explain
→ Prepare Fix
→ Remeasure
→ Report
```

まで進める。

---

# 14. 開発優先順位への反映

`CORE_PRODUCT_STRATEGY.md`にあるP0/P1開発と直結する。

特に優先する。

| Priority | Work | Retention value |
|---|---|---|
| P0 | Competitive Evidence Engine | なぜ負けたか分かる |
| P0 | Claim Graph | 改善対象を正確に持つ |
| P0 | Dynamic Evidence Gap | 本当に足りないものを出す |
| P1 | Change Lineage | AIXが何を変えたか追跡 |
| P1 | Change → Remeasure | 効果を見せる |
| P1 | Baseline / Since AIX Started | 導入価値を累積表示 |
| P1 | Competitor Events | 継続監視理由 |
| P1 | Next Best Action | 次の行動を一本化 |
| P2 | Monthly Value Report | 更新課金の価値説明 |
| P3 | Additional UI polish | 上記の後 |

---

# 15. 顧客向け説明

弱い説明:

> AI検索順位を監視します。

より、次を使う。

> **AIXを入れた日から、AIで自社がどれだけ選ばれるようになったかを記録し続けます。競合に負けた理由を見つけ、修正し、その修正が効いたかまで確認します。**

AIXの立ち位置は、

> AI SEO health check

ではなく、

> **continuous AI recommendation improvement operator**

である。

ユーザーが最終的に感じる価値は、

> **「AIXに金を払っておけば、AI上で自社がどう扱われているか分からない状態にならず、改善も止まらない」**

である。
