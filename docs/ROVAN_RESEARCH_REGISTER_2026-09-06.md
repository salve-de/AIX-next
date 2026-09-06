# ROVAN 研究・出典台帳 — 2026-09-06

## 利用上の前提

この文書は、当該会話で参照された研究・公式資料・市場情報を失わないための台帳である。今回のGitHub保存作業で全リンクの全文を再取得・全論文を再監査したという意味ではない。以下の要約は会話で扱った射程を示す。新しい研究成果やROVANの実証結果を報告する文書ではない。

実装方針として採用するのは、必須作業ゼロ、任意の決定権、実行と結果の可視化、会社方針の蓄積、継続価値の検証。論文の効果量、競合の価格・件数、市場割合を広告に転載するときは原典・測定方法・時点を再確認する。全文を取得できない論文は要旨の範囲を超えて断定しない。

「研究では満足度が上がった」→「ROVANの有料解約が必ず減る」と変換しない。類似サービスの機能が存在することと、その機能が解約低下を引き起こしたことも別である。研究確認が必要な箇所を残しても、採用済み製品方向の実装全体を止めて再び一般論調査へ戻らない。

## 1. 任意参加・主導権・所有感

| ID | 一次資料・研究 | 会話で扱った内容とROVANへの含意 | 限界 |
|---|---|---|---|
| P01 | Dietvorst, Simmons & Massey, Overcoming Algorithm Aversion: People Will Use Imperfect Algorithms If They Can (Even Slightly) Modify Them. https://pubsonline.informs.org/doi/10.1287/mnsc.2016.2643 | 小さな修正権。方針を任意で変えられる設計の根拠候補 | 予測実験。SaaSの有料継続実験ではない |
| P02 | Norton, Mochon & Ariely, The IKEA effect: When labor leads to love. https://scholars.duke.edu/publication/861385 | 自分が関わり完成した対象の評価。短い選択が完了して結果に結びつく体験 | 苦労を増やせばよいわけではない。完成・成功などの条件がある |
| P03 | Mochon, Norton & Ariely, Bolstering and restoring feelings of competence via the IKEA effect. https://scholars.duke.edu/publication/938465 https://www.sciencedirect.com/science/article/pii/S0167811612000584 | 有能感、自分の寄与。自分の意向が反映されたと分かること | ROVANのユーザーに同じ程度の効果があるとは限らない |
| P04 | Franke et al., The “I Designed It Myself” Effect in Mass Customization. https://pubsonline.informs.org/doi/10.1287/mnsc.1090.1077 | カスタマイズと自分が設計した感覚、達成感・評価 | カスタマイズの質・実際の関与が条件。支払意思と継続支払いを分ける |
| P05 | Pierce et al., The State of Psychological Ownership: Integrating and Extending a Century of Research. https://journals.sagepub.com/doi/abs/10.1037/1089-2680.7.1.84 | コントロール、知識、自己投入と所有感 | 理論的枠組み。解約率の因果効果ではない |
| P06 | Leung et al., Man Versus Machine: Resisting Automation in Identity-Based Consumer Behavior. https://journals.sagepub.com/doi/10.1177/0022243718818423 | 自分の役割・自己認識に重要な部分まで奪う自動化への抵抗 | 経営者・担当者が同じように反応するとは限らない |
| P07 | 自己決定理論の公式解説。https://selfdeterminationtheory.org/topics/application-relationships/ | 自律性は自分一人で全部働くことではない。自分の意思で任せる経路も残す | 解説をROVANへの直接実験として扱わない |
| P08 | Algorithm Appreciation: People Prefer Algorithmic to Human Judgment. https://www.hks.harvard.edu/publications/algorithm-appreciation-people-prefer-algorithmic-human-judgment | 全員がAIに抵抗するとは限らない。完全委任を好む利用者も尊重 | 課題・専門性・比較相手による違い |
| P09 | CHI 2023, DOI 10.1145/3544548.3581253. https://doi.org/10.1145/3544548.3581253 | 操作権とアルゴリズム受容の追試・拡張として会話で参照 | 書誌詳細・実験条件は原典で再確認。万能効果を置かない |
| P10 | 2025年AIカスタマイズ研究, DOI 10.1080/10447318.2025.2588652. https://www.tandfonline.com/doi/abs/10.1080/10447318.2025.2588652 | AIと成果への所有感・満足。呼び名・文体・重点の複数要素 | 会話で507人、平均6.04対5.92という紹介があったが、数値は再確認要。単発課題、複数操作の複合条件であり名付け単独の効果ではない |
| P11 | Aalto repositoryのAI文章作成研究。https://aaltodoc.aalto.fi/items/5316daa2-eba2-4afc-9e37-6dd23e99ec55 | 個人向け文面の装飾より、実際に出力へ影響を与えること | 完全な書誌・実験条件は原典を読む。一般化しすぎない |

## 2. 参加の負担・価値の可視化・継続

| ID | 一次資料・研究 | 採用する設計上の含意 | 限界 |
|---|---|---|---|
| P12 | Blut, Heirati & Schoefer, The Dark Side of Customer Participation. https://journals.sagepub.com/doi/10.1177/1094670519894643 | 参加による役割曖昧性や負担を増やさない。質問票や監督業務を戻さない | 参加の量と種類、利用者の能力などの条件がある |
| P13 | Chernev et al., Choice Overload: A Conceptual Review and Meta-Analysis. https://www.kellogg.northwestern.edu/academics-research/research/detail/2015/when-product-assortment-leads-to-choice-overload-a-conceptual/ | 推奨1つと少数の代案。選ぶ材料を先に提供 | 選択肢が多いと常に悪いという主張ではない |
| P14 | Buell & Norton, The Labor Illusion: How Operational Transparency Increases Perceived Value. https://pubsonline.informs.org/doi/10.1287/mnsc.1110.1376 | 裏の仕事を見せる。ROVANは処理回数より、自社への対応と根拠を示す | 人工的に待たせる・架空の作業を作ることは本計画の要件ではない |
| P15 | Bhattacherjee, Understanding Information Systems Continuance: An Expectation-Confirmation Model. https://aisel.aisnet.org/misq/vol25/iss3/2/ | 初回の期待と体験、今後も使う有用性を分ける | 継続意向と実際の有料更新は同一ではない |
| P16 | Gehring et al., Customer success: An interorganizational performance concept in business markets. https://link.springer.com/article/10.1007/s11747-025-01121-5 | 目標達成・目的一致・可視性。担当者と支払判断者が成果を説明できる報告 | 質的研究。具体的な解約率改善幅の根拠にはしない |
| P17 | Customer Success Management, DOI 10.1177/1094670521997565. https://doi.org/10.1177/1094670521997565 | 顧客成功・提供価値の認識を製品内の自動報告で支える | 人力CSをそのまま追加する方針ではない |

## 3. 進捗・習慣・競争・通知

| ID | 一次資料・研究 | 採用・保留の判断 | 限界 |
|---|---|---|---|
| P18 | Harkin et al., Does monitoring goal progress promote goal attainment? A meta-analysis of the experimental evidence. https://pubmed.ncbi.nlm.nih.gov/26479070/ https://eprints.whiterose.ac.uk/id/eprint/91437/ | 一つの案件の発見→実行→確認を継続表示 | 会話の138研究・約2万人は一般的な目標達成の集約。B2B解約率ではない |
| P19 | MIS Quarterly 31(4), habit and continued IS usage. https://aisel.aisnet.org/misq/vol31/iss4/5/ | 「競争状況を考える際にROVANを見る」文脈を作る | 毎日ログイン必須への飛躍をしない |
| P20 | Mekler et al., gamification elements and intrinsic motivation. https://bruehlmann.io/publication/mekler-towards-2017/ | ポイント・ランキングで作業量が増えても価値や動機と同じではない | 初版はポイント・アバターより事業上の案件進捗を優先 |
| P21 | Rivalry research, DOI 10.5465/AMJ.2010.54533171. https://doi.org/10.5465/AMJ.2010.54533171 | 自社と本当に関係する競合に絞った比較 | スポーツ等の研究をSaaS継続に直接一般化しない |
| P22 | Loewenstein, The Psychology of Curiosity. https://doi.org/10.1037/0033-2909.116.1.75 | 次の検証が気になる理由を、前回の実案件につなげる | 情報を知れば好奇心は解消される。継続価値をこれだけで説明しない |
| P23 | Notification batching study, DOI 10.1016/j.chb.2019.07.016. https://doi.org/10.1016/j.chb.2019.07.016 | 臨時通知を乱発せず定期要約にまとめる | スマートフォン通知全般の研究。ROVANでの最適頻度は未確定 |

## 4. 実サービスから借りる操作・報告の構造

| ID | 公式情報 | 使う部分 | 使わない飛躍 |
|---|---|---|---|
| E01 | Spotify DJ requests update. https://newsroom.spotify.com/2025-10-15/dj-spanish-text-requests-update/ | 自動で動き、方向だけ任意に変更できる | 音楽アプリの利用行動をB2B有料継続に直結させない |
| E02 | Duolingo, Improving the streak. https://blog.duolingo.com/improving-the-streak/ | 達成条件を軽くする。少ない負担で完了する | 会話の14日継続・相対3.3%は有料更新率でもROVANの予測値でもない |
| E03 | Intercom Fin performance. https://www.intercom.com/help/en/articles/11390083-monitor-fin-s-performance-with-clarity-and-confidence | 関与・自動化・解決・顧客体験を分ける | 「AIが動いた」を「顧客の問題が解決した」に置き換えない |
| E04 | Microsoft HAX Guideline: Convey the consequences of user actions. https://www.microsoft.com/en-us/haxtoolkit/guideline/convey-the-consequences-of-user-actions/ | 方針を変えると今後何が変わるかをすぐ示す | 保存前のクリックだけを方針反映完了にしない |

## 5. 競合・技術・運用の参照先

| ID | 公式資料 | 会話で参照した用途・確認点 |
|---|---|---|
| M01 | Peec Actions. https://peec.ai/product-actions https://peec.ai/blog/introducing-actions | 改善機会の優先付けとユーザー実行の境界。新規性を主張する前に現在の機能を再確認 |
| M02 | Profound Agents. https://help.tryprofound.com/articles/9762251986-agents-overview https://help.tryprofound.com/articles/2212787792-create-a-workflow | ワークフロー・入力・CMS連携。自動改善案だけを独自機能としない |
| M03 | Scrunch AXP. https://helpcenter.scrunchai.com/en/articles/13656392-agent-experience-platform-axp | 顧客URL／CDNでの配信と、ROVAN別ドメイン公開は違う |
| T01 | Google AI features and your website. https://developers.google.com/search/docs/appearance/ai-features | 通常の検索条件、AI専用要件、索引・表示の保証がないことを確認 |
| T02 | 会話中のGoogle追加ガイド参照。https://developers.google.com/search/docs/fundamentals/ai-optimization-guide | 到達性・公開時点・現在の内容を再確認。過去回答の「2026年8月のllms.txt明言」を無検証で広告へ転載しない |
| T03 | Gemini Google Search grounding. https://ai.google.dev/gemini-api/docs/google-search | 外部検索、引用、検索情報を記録する実装の参照 |
| T04 | Stripe revenue recovery. https://docs.stripe.com/billing/revenue-recovery https://docs.stripe.com/billing/revenue-recovery/smart-retries | 支払い失敗、再試行、回復。満足度による解約と分ける |
| T05 | Stripe customer portal / subscription webhooks. https://docs.stripe.com/customer-management https://docs.stripe.com/billing/subscriptions/webhooks | 契約状態の同期と顧客自己処理、重複受信・状態遷移 |
| T06 | Cloud Run Jobs. https://cloud.google.com/run/docs/create-jobs | タイムアウト、再試行、実行上限。今回の文書PRで新規基盤へ移行しない |
| T07 | Microsoft Research, Why Tenant-Randomized A/B Test is Challenging and Tenant-Pairing May Not Work. https://www.microsoft.com/en-us/research/articles/why-tenant-randomized-a-b-test-is-challenging-and-tenant-pairing-may-not-work/ | 会社単位割当、ばらつき、必要サンプル数。少数顧客から因果効果を断定しない |

## 6. 初期の価格・市場規模説明に出た情報の保管

次は過去回答の参照先を保存するもので、今回の保存PRで検証済みとするものではない。特に競合価格、顧客数、市場割合は変わる。公表元による自己報告と独立測定を分ける。

- G2 AI Search Insight Report: https://learn.g2.com/g2-2026-ai-search-insight-report
- Gartner buyer survey: https://www.gartner.com/en/newsroom/press-releases/2026-05-20-gartner-survey-finds-sixty-nine-percent-of-b-two-b-buyers-turn-to-sales-reps-to-validate-ai-generated-insights
- Semrush AI pricing: https://www.semrush.com/pricing/ai/
- GEO AIO TRACKER: https://geoaiotracker.com/
- Extageによる費用調査（一次の価格表とは異なる二次資料）: https://www.extage-marketing.co.jp/web-school/llmo-cost/
- Profound agency offer: https://www.tryprofound.com/blog/agencies-launch-your-aeo-practice-with-profound
- Profound funding announcement: https://www.tryprofound.com/newsroom/profound-raises-series-c-at-1b-valuation-to-lead-a-new-category-of-marketing
- ChartMogul retention report: https://chartmogul.com/reports/saas-retention-the-ai-churn-wave/

過去回答ではSemrush $99、Profound $99/$399、Scrunch $250、Otterly $189/$489、国内9,800〜198,000円等が例示された。これらは現在価格の確定値として保存しない。AI SearchScopeなど完全な原典リンクが会話中に揃わなかった項目は、出典を捏造せず再確認対象とする。

過去のG2・Gartnerの利用率、ProfoundのEnterprise顧客数・Fortune 500比率、ChartMogulのサンプル数・維持率についても、調査対象、時点、定義が違う。ROVANの対象市場規模、支払意思、顧客の成功率をそのまま計算しない。

## 7. 実装証拠・解釈の基準

原本でレビューした固定コミット：`8d679aa6932b302174099eec6381c99515137167`。

- https://github.com/salve-de/AIX-next/blob/8d679aa6932b302174099eec6381c99515137167/lib/providers/index.ts
- https://github.com/salve-de/AIX-next/blob/8d679aa6932b302174099eec6381c99515137167/lib/autonomous-watch.ts
- https://github.com/salve-de/AIX-next/blob/8d679aa6932b302174099eec6381c99515137167/lib/watch-measurement.ts
- https://github.com/salve-de/AIX-next/blob/8d679aa6932b302174099eec6381c99515137167/lib/positioning.ts
- https://github.com/salve-de/AIX-next/issues/4
- https://github.com/salve-de/AIX-next/pull/3

実装時には呼出し経路、feature flag、永続化、公開状態、ジョブ、テストを確認する。コメント、関数名、ファイルの存在、Issueのチェック、過去の回答だけで「機能が提供されている」とは断定しない。

**この台帳の役割は、根拠を失わず、研究・仮説・実観測・製品の完了状態を混同しないこと。** 実装内容は原本の34タスクと最新の補足に従い、原典の再調査はその結果が実装や表示の正確性を変える箇所に限定して行う。
