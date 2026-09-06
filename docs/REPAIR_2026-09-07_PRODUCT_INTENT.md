# 2026-09-07：価値提案・北極星・自動化の修復

## 依頼と変更範囲

ユーザーは、虚偽・誤認・不具合の是正は維持しつつ、AIが独断で弱めた価値提案・北極星・自動化・オーナー戦略を適切に直すことを承認した。基準は `8d679aa`、過剰変更は `5335ebe`、今回の修正開始HEADは `06221ca`。全面revertではない。既存の価格額、契約条件、顧客サイト非改修、サンプル識別、公開DTO・認証・決済・削除の安全対策を維持する。

## 何をどう変えたか

| 区分 | 修正前 | 今回 |
| --- | --- | --- |
| 商品の主語 | 公開情報の確認・整理 | 専門性でAIのおすすめ獲得を目指す。大手と同じ土俵だけで競わない |
| 通常運用 | 下書きと毎回の確認中心 | 初回の公開・自動更新同意後、許可範囲の週次処理。実装範囲外は明記 |
| 北極星 | 初回候補外からの回復率に置換 | AI顧客奪還シェア＝固定50問パネルの候補入り割合。回復率は補助指標 |
| 計測 | 名前と分母が混在 | AI別の成功分母、未取得・反復不足、同条件の共通質問、測定日時を表示。無料12問と区別 |
| 差別化 | 汎用3軸の整理案 | 対象顧客・用途・実測の候補外質問によるニッチ仮説。未取得AIの回答を作らない |
| 公開更新 | 週次処理から呼び出し削除 | 管理権限を結び付けた自動更新を新たに接続。旧URL推測による更新は廃止 |
| 報告 | 常に「公開前確認待ち」 | 保存された実行状態から反映済みと未反映を区別。北極星もメールへ追加 |
| 紹介 | カード削除 | 公開ホームURLだけの紹介文コピーを復旧。架空コード・実績・未提供割引は戻さない |
| パートナー | 事実上の不採用扱い | 制度廃止ではなく実装復旧待ちと明示。報酬発生は未提供 |
| オーナー台帳 | 目標を旧案・不採用へ格下げ | 第2.23節を基準コミットの原文へ復元し、現在も有効な目標として扱う |

## 自動更新の実装境界

- 公開ページの管理tokenと、同じ初回Scanに紐付く有効な有料Watchのtokenの両方で初回許可する。URLだけでは他のページを選ばない。
- 対象サイトと同じoriginのクロール済み本文から、料金・対応地域・専門分野等の短い記載を原文で最大5件抽出し、出典URL付きで反映。会社紹介文・顧客サイト・第三者サイト・AI内部データは書き換えない。
- noindex、参照元ページ欠落、空本文、30,000文字の切り詰め、抽出不能では既存項目を消さず保留する。記載がないことをサービス廃止と認定しない。
- 公開用allow-listを通し、JSON・Markdown・JSON-LDを公開事実から再生成する。管理token、Watch関連、回復用スナップショットは公開DTOへ出さない。
- 更新日時の比較による条件付き保存で、停止・取り消しと競合する更新を拒否する。同じ測定runの再試行は二重反映しない。
- 更新前の事実と管理対象項目を組で保存する。管理画面で直前の前後内容・出典を確認でき、取り消すと自動更新も停止する。履歴は直前1回の回復用であり、無期限の版管理ではない。
- 公開期限30日は自動延長しない。期限後の継続運用、タブを閉じた後の安全な管理復旧、実際の権利確認は引き続き作り込みが必要。
- DBマイグレーション `012_profile_automation.sql` が必要。既存ページは自動で許可済みにしない。今回、実DBには適用していない。

## 変更ファイルの全範囲

- 方針：`AGENTS.md`、`PROJECT_RULES.md`、`docs/CORE_PRODUCT_STRATEGY.md`、`docs/CONTINUOUS_VALUE_RETENTION.md`、`docs/OWNER_VISION_AND_PHILOSOPHY.md`、`docs/PROJECT_MASTER_HISTORY_AND_STRATEGY.md`
- ページ：`app/layout.tsx`、`app/page.tsx`、`app/pricing/page.tsx`、`app/methodology/page.tsx`、`app/partners/page.tsx`、`app/setup/page.tsx`
- 表示：`components/brand.tsx`、`components/site-header.tsx`、`components/site-footer.tsx`、`components/structured-data.tsx`、`components/executive-diagnostic-summary.tsx`、`components/positioning-panel.tsx`、`components/public-profile-actions.tsx`、`components/result-client.tsx`、`components/watch-client.tsx`、`components/zero-effort-promise-section.tsx`
- 復旧・追加UI：`components/executive-referral-card.tsx`、`components/profile-automation-controls.tsx`
- 処理：`app/api/ai-profile/route.ts`、`lib/positioning.ts`、`lib/public-dto.ts`、`lib/storage.ts`、`lib/types.ts`、`lib/watch-email.ts`、`lib/watch-measurement.ts`、`lib/north-star.ts`、`lib/profile-automation.ts`
- DB・テスト：`supabase/migrations/012_profile_automation.sql`、`tests/positioning.test.ts`、`tests/north-star.test.ts`、`tests/profile-automation.test.ts`
- 記録：本書、`README.md`

## 外部の一次資料と、そこから言える範囲

- [Google Search Central：AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)：既存SEOの基本、クロール可否、見える本文と構造化データの一致。特別なAI専用schemaやファイルは必要条件ではなく、掲載・インデックスは保証されない。
- [OpenAI：Overview of OpenAI Crawlers](https://developers.openai.com/api/docs/bots)：検索用途と学習用途のクローラーを区別する。検索アクセスを許可することを推薦獲得の証明とは扱わない。
- インストール済みNext.js 16.3.4のRoute Handlers／use-client文書とReactのスキルに従い、既存API構成、非公開レスポンス、クライアント状態管理を維持した。

これらは実装上の根拠であり、オーナーの事業目標を「情報整理」に変更する根拠ではない。固定50問の指標はRovanの製品定義であって、業界共通の認証指標とは呼ばない。

## 検証

- `node --import tsx --test tests/**/*.test.ts`：98件成功。`npm test`のtsx CLIはこのsandboxのIPC制限で起動できず、同じテストをNodeのloader経由で実行。
- `npm run lint`、`npm run typecheck`、`npm run build`、`git diff --check`：成功。
- サブエージェント2名：UI・文書を分担。文書担当が自動更新を独立点検し、取り消し後の管理対象喪失と部分本文からの削除を指摘。修正・対象再テスト後に解消確認。
- Safari実ブラウザ、`http://127.0.0.1:3001/`：ホーム表示、診断見本へのクリック、根拠ログ展開、下書き見本操作（実公開なし表示）、14日試用ボタンからWatch見本への遷移、50問北極星と補助回復率・自動更新欄の区別を確認。
- 別プロジェクトが使う3000番とユーザー既存タブは変更・停止していない。新設のRovan検証サーバー3001番と検証タブは確認用に残す。
- 本番DBのCAS競合、マイグレーション適用、実AI→公開更新→再測定→通知の有料E2Eは未検証。メモリテストを本番証拠とは扱わない。処理量・並列数を増やしていないため新規の負荷試験は対象外。本番処理能力は未確定。

## 残っているもの／公開状態

今回の修復は、以前取り下げたすべての機能を完全復活させたという意味ではない。パートナー受付・報酬台帳・割引適用、任意の補足入力フォーム、本番環境、永続的な管理復旧、競合サイトの前後クロール保存からの自律ニッチ選定、実際の流入・問い合わせ効果検証は未完成。製品目標として残し、実装済みと表示しない。

前回の `docs/RELEASE_2026-09-07.md` に記載した本番公開・決済・削除の未検証事項も、この修復で解消したとは扱わない。GitHubの作業ブランチへの記録と、main統合・本番デプロイは別。今回はmain統合・本番デプロイ・外部サービス設定変更を行っていない。
