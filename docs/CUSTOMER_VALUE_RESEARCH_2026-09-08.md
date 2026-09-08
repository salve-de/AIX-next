# 顧客が支払う理由を作り、確認できるようにする

調査日: 2026-09-08。対象: Rovan、地域の中小企業・専門事業者。目的は「表示する数字を増やす」ことではなく、根拠の整備と推薦候補入りの変化を顧客自身が確認できるようにすること。ベンダーの機能説明は成功・支払意思の独立検証ではない。

## 外部検索で比較した手段

| 手段 | 顧客が確認できる価値 | 判断・実装境界 |
|---|---|---|
| 固定相談の前後回答・競合候補 | 自社がどの相談で候補入り/候補外になったか | 実装。AI別、モデル・反復・国・言語・質問一致。生回答を管理用APIから取得 |
| 情報源分析 | どのURLが何問・何回答で使われたか | 実装。回答引用、検索取得、過去の区分未記録を分離 |
| 不足する根拠の優先整備 | 自社の原典にある専門性を候補外の相談に合わせて整備 | 自動更新の抽出順を変更。語句一致は適合性の証明ではない。内容を創作しない |
| 更新と結果の履歴 | 何を公開し、その後どう変わったか | 追加/更新前の原文、公開URL、測定ID、関連質問を保存。基準記録がない旧更新は比較不可 |
| 継続推移・低下の表示 | 単発の上昇に惑わされず判断できる | 実装。AIごとの成功分母/予定/未取得を表示 |
| 持ち出せる報告書 | 社内説明、継続契約の判断に使える | CSVおよび単体HTML報告書。管理URL・契約情報を含めない |
| 検索への更新通知（IndexNow） | 公開URLの変更を検索エンジンへ通知 | 次段階。ドメイン所有証明と公開環境の設定が必要。受理は収録・推薦ではない |
| 検索収録の確認 | 公開が発見可能になっているか | 次段階。Search Console/Bingの所有サイトデータで証拠を得る。site検索の欠如を非収録と断定しない |
| Bing AI Performance | Microsoft側の実引用状況 | 接続が必要。Rovan所有ドメインで検証。AI APIパネルとは別データとして扱う |
| AIクローラー来訪 | どのAIが公開ページを取得したか | 未実装。識別・ログ/保持・プライバシー設計が必要。来訪は推薦・人間の流入ではない |
| 流入・問い合わせ・売上 | ビジネスへの貢献 | 未実装。既存解析等への接続・同意が必要。推測した売上や架空ROIは表示しない |
| ページと相談の適合シミュレーション | 公開前に内容の弱点を発見 | 将来候補。URLをAIへ直接渡す実験を自然な検索採用と混同しない |
| 第三者掲載・PR・コミュニティ | 自社以外からの参照根拠 | 調査対象。自動投稿/掲載依頼は対象外。顧客に週次の作業を押し付けない |
| 独自の比較情報・料金・事例・FAQ | 購買判断に使える説明 | 原典で確認できる範囲を優先。新しい対応能力・実績や他社の弱点を作らない |
| AI専用ファイル/構造化データ | 内容の表現とクロール補助 | 既存機能を維持。推薦向上の証明として売らない |

## 一次資料と読み取れること

- [Peec Actions](https://peec.ai/product-actions): 引用源と競合露出の差から改善機会を優先化。コンテンツ作成は利用者側に残るという公式説明。Rovanでは原典付き整備までを一続きにすることが差別化仮説。
- [Peec AI visibility](https://peec.ai/product/ai-visibility): 購買判断を意識した質問ライブラリ、引用源・行動候補。
- [Scrunch Optimizer](https://helpcenter.scrunchai.com/en/articles/12845826-understanding-the-optimizer-in-scrunch): ページが検索結果に出た場合の適合テスト。自然な検索発見の実績ではない。
- [Scrunch Signals](https://helpcenter.scrunchai.com/en/articles/15879296-understanding-the-signals-tab): 回答データから改善機会やアラートをまとめる。
- [Ahrefs Brand Radar](https://help.ahrefs.com/en/articles/11064852-what-is-brand-radar-and-how-to-use-it): ブランド候補・参照ページ・競合比較を質問から掘り下げる。マーケティング説明でありRovanの成果の証拠ではない。
- [Ahrefs methodology](https://ahrefs.com/blog/brand-radar-methodology/): 質問集合に基づく可視性は実オーディエンスや流入の代替ではない。
- [Profound Answer Engine Insights](https://help.tryprofound.com/articles/3443229936-answer-engine-insights-overview): 回答集合、トピック、引用を分析対象として定義。
- [Profound Pages](https://help.tryprofound.com/articles/6700593218-about-pages): ページ単位の引用・訪問・状態をまとめる。
- [Google AI features](https://developers.google.com/search/docs/appearance/ai-features): AI向け特別なファイルやschemaは不要。クロール/インデックス/表示は保証されない。役立つ本文と発見可能性が基本。
- [Google helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content): 人が判断に使える信頼性のある情報を優先する方向。
- [Bing AI Performance](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c): ページ引用とgrounding query。順位・権威・売上を測るものではない。ヘルプ本文は検索取得時に確認、直接openは空の結果。
- [IndexNow documentation](https://www.indexnow.org/documentation)、[FAQ](https://www.indexnow.org/faq): 所有証明付きURL更新通知。クロールは検索側の判断。
- [Scrunch agent traffic integration](https://helpcenter.scrunchai.com/en/articles/14491908-connecting-your-website-to-agent-traffic-using-the-custom-api): URL・時刻・リクエスト等のログ接続が必要。新しい訪問者計測を黙って加えることはしない。

## 実装方針

今回の情報源から確実に採用できるのは、①相談別の根拠、②実施内容、③公開後の結果をつなげて見せる方式。効果量や課金意欲を保証する証拠はない。実顧客1社の同意済み公開と継続測定が次の事業検証ゲート。

外部検索は上記の機能群、検索側の仕様、測定/収益帰属の境界をカバーした。インターネット上の全サービスを網羅したという意味ではない。新たな外部連携の契約・課金・公開・訪問者計測は実行していない。

## 実装・検証結果

- 相談ごとの結果、強みと改善対象、AIが使った情報、Rovanが整備した内容、測定推移の5表示。
- 管理用 `/api/watch/proof`。権限確認、秘密・契約情報の除外、private/no-store、CSV/単体HTML報告書。
- 自動更新の原文選択を候補外相談に関連する順へ変更。追加/更新前の事実・公開URL・基準測定ID・関連相談を記録。
- 前後比較はAI/モデル/質問/反復/地域/言語一致かつ反復取得が揃ったものに限定。未取得を低下、基準測定を改善、検索取得を回答引用として数えない。
- 過去の実行履歴がないレコードを補完して改善済みにしない。反映済み変更の原典・関連質問を追跡できる新形式を追加。
- 見本は専用のfixture関数。一般の保存済みWatchからは呼ばれず、DB保存や実API呼び出しはしない。
- `node --import tsx --test tests/*.test.ts`: 176件成功。`npm test`のtsx CLIはsandboxのIPC制約で起動できなかったため、同じテスト群をNode import方式で実行。
- TypeScript / 変更対象ESLint / `git diff --check` 成功。`npm run build -- --webpack` 成功。
- アプリ内ブラウザーでPC1440px・モバイル390pxを検証。390pxでbody.scrollWidth=390、成果領域scrollWidth=364。絞り込み、前後回答、参照元→関連相談、測定履歴を実操作。報告書はContent-Disposition付き通常配信に変更後、downloadイベントを確認。console error/warnは取得時点で0件。
- 実運用の検索収録・AI引用・推薦向上・実流入・問い合わせ・支払意思はこの変更で証明していない。外部公開・Provider課金・DB migration・Git commit/pushは行っていない。

既存の未コミット変更88ファイルを保護し、一時worktree `/private/tmp/rovan-customer-value` / `codex/customer-value-proof` に同じ状態を再現して開発。取り込み時は元ファイルが作業開始時のスナップショットと一致するかを全対象で検証し、今回の変更ファイルだけを元プロジェクトへ反映する。worktreeは復元・比較用に保持。
