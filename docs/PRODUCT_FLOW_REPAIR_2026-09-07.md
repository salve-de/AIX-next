# プロダクト導線・整合性修正（2026-09-07）

## 依頼・保護する条件

前ターンの公開前監査で挙げた問題を、オーナーの「全部なおせや」に基づいて修正する。API設定不足の説明に置き換えず、ページ遷移・結果表示・再訪・継続利用を対象とする。

直前の文言復元は維持する。AI顧客奪還シェア／固定50問の北極星、価格、自社サイト改修不要、初回の明示承認、範囲外の情報を捏造しない条件を変更しない。既存の未コミット変更を保持し、commit・push・本番反映は別の状態として扱う。

## 担当

- 主担当：ナビゲーション、再訪入口、データ管理、利用者向け説明、統合、Safari、SQL検証。
- Curie：診断・Watch・メールの測定表示／比較／通知、状態切替、通知解除、空状態。
- Meitner：公開ページの管理権限・再訪・直接作成・戦略反映・有料継続時の掲載維持。
- 共有チェックアウト上の編集先を分離し、互いの担当ファイルを無断変更しない。

## 修正対象の全件台帳

1. 実データ用メニューが架空の見本へ移動する。
2. 実データと見本、別の識別子への切替で古い状態が残る。
3. 閉じたタブ以外から公開ページを管理できない。
4. サイトなし・SNS経路が公開後の管理・診断につながらない。
5. 結果・Watch・メールの候補入り数と判定規則が一致しない。
6. 「前回」の表示が初回基準比較になっている。
7. 競合だけの変化を通知せず、新規候補が変動なしになる。
8. 強みの選択が生成内容に渡らない。
9. 有料の掲載維持と30日期限が両立しない。
10. メール未登録者がデータを書き出し・削除できない。
11. 「いつでも解除可能」の通知に解除操作がない。
12. 無料公開できる実装に対して、比較表が有料だけ公開できるように見える。
13. 規約・プライバシー・問い合わせ・特商法表記に内部指示が残る。
14. プライバシーの非公開説明が、承認後の公開機能と一致しない。
15. `/ai-info`の戻り先・自社サイト設置案内が現行導線と一致しない。
16. Watchの改善文面が未作成の際、見出しだけが残る。
17. 管理画面への再訪入口がなく、管理キーの手動切り出しが必要。

## 実装した変更の対応表

| 対象 | 変更 |
| --- | --- |
| 1・2・17 | 実データ画面のメニューに対象の管理URLを渡す。共通メニューの架空データは「見本」と明記。`/manage`で保存URLをそのまま開く。同一サイト・許可ルートだけを受け付ける。対象切替時には画面状態をリセットし、古い通信結果を破棄。 |
| 3・4 | `/profile/manage`を新設。保存した所有者リンクまたは明示的に紐付けたWatchで管理。直接登録も下書き→承認→公開→管理→診断へ接続。scanIdだけで管理権限を渡さない。 |
| 5・6・7 | 診断・Watch・メールの候補入り数を同じ多数決規則へ統一。初回基準と前回比較を区別。競合だけの変化、新規候補、Provider別変化も通知判定に反映。取得失敗をゼロや改善と扱わない。 |
| 8 | 選択した強みを、参照元で裏付けられる情報の強調・追加に使用。推測した戦略文を会社の事実に変換しない。 |
| 9・12 | 無料公開30日と有料の掲載維持を区別。掲載維持は別途同意を必要とし、有効契約の週次処理で8日先まで更新。内容更新停止と掲載維持停止を別操作にする。非公開・期限切れを自動復活させない。比較表と説明も一致させる。 |
| 10 | メール未登録のWatchも所有者リンクで書き出し・削除可能。メール登録済みの場合の照合、課金解約確認、削除の原子性は維持。DB migration014を追加。 |
| 11 | Watchからメール通知を解除可能にする。サンプルでは実通知操作を無効化。 |
| 13・14 | 顧客向けページの内部設定指示を削除。本人承認後の公開範囲と非公開情報の説明を整合。不明な運営者情報は創作せず、販売開始ガードを維持。 |
| 15・16 | `/ai-info`から対象Watchへ戻る。顧客サイトへの設置を必須にしない。未生成の改善文面は、空見出しではなく未作成として説明。 |

追加確認で、参照元の延べ出現数をページ数と表示していた箇所をURL重複除外へ変更し、見守り未登録の結果画面は「登録後に毎週測定」とした。データ管理の説明文をフォーム上部に配置し、左右のフォームが崩れないよう修正。開発専用`/setup`は本番では404とし、404から管理入口への復帰経路を追加した。

独立レビューで見つかった、強み選択時の基礎情報削除、自己掲載を経由した未確認情報の格上げ、解約と掲載延長の競合についても修正・回帰テストの対象に追加した。

## 参照した外部一次資料

- [NN/g: 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — 状態表示、ユーザーの操作と結果の対応、用語の一貫性、復帰・解除、空状態。
- [MDN: sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) — タブ単位の保存を恒久管理の唯一の入口にしない。
- [React: Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state) — 管理対象・見本切替での状態の分離。
- インストール済みNext.js 16.3.4の`04-linking-and-navigating.md` — Linkのクライアント遷移・状態保持。
- [消費者庁: 通信販売](https://www.no-trouble.caa.go.jp/what/mailorder/) — 販売者情報・提供条件を不明確な開発指示のまま顧客に見せない。個別の法的適用や法務審査完了を主張しない。

## 検証記録

- 主担当の関連31テスト成功：管理URLの同一オリジン・許可ルート限定、メール未登録の権限、登録済みメールの空欄拒否、課金・削除保護。
- PostgreSQL 16の使い捨てローカルDBにマイグレーションを適用し、`tests/privacy-transaction.sql`成功。1,101件の履歴の完全書き出し、他のWatch・プロフィールの保存、失敗時ロールバック、削除済みレシート再試行、メール未登録、権限制御を実際のSQLで確認。テストデータはトランザクション終了でロールバック。本番DBには接続していない。
- Safariの既存Rovanサーバーは`127.0.0.1:3001`。別プロジェクトのウィンドウが前面になっていた場面では、その内容を変更していない。
- `npm run check`成功：lint、全156テスト（失敗・スキップ0）、TypeScript、本番ビルド。`git diff --check`成功。
- migration015と`tests/profile-renewal-transaction.sql`も実PG16で成功。契約・所有者紐付け・同意・未失効・公開中の条件、当日再実行、解約済み・未課金・撤回済みの拒否を確認。契約判定と延長をWatch行ロック付きRPCへまとめ、解約との競合を保護した。
- 実Safari 26.5.2（シミュレーターではない）の専用WebDriverセッションで、ホーム・結果・Watch・管理入口・データ管理・規約類・料金・調査方法・パートナー・課金・入力なし・404・開発設定の表示／遷移を確認。1440pxと430pxで横はみ出しなし。800px幅でメニュー項目が折り返される問題も、ヘッダーのみ折りたたみ開始幅を調整して修正。
- `tests/safari-profile-owner-flow.mjs`成功：架空サービスの下書き作成→承認して公開→実公開ページ→新規タブ（sessionStorage空）→`/manage`で保存リンク入力→所有者画面→公開停止→公開先404。API応答のモックなし。外部Provider・課金・メールは呼び出していない。タブ切替後のSafariポインター操作が不安定だったため、この試験のボタンは実Safari内の有効なDOM要素を操作した。手動操作や実機iPhoneでの検証とは呼ばない。
- 本番ビルドをローカル3002で一時起動し、`/setup`のHTTP404と管理画面の`private, no-store`／`noindex`／`no-referrer`を確認。これは本番デプロイではない。
- 画面証跡：`/private/tmp/rovan-product-safari.qERkCj/`。ブラウザー試験用レコードは公開停止し、SQL試験の行はロールバック。通常の開発サーバー3001は利用者向けに残す。
- 終了処理：隔離PGクラスタ、今回の本番プレビュー3002、専用Safariセッション／ドライバーを停止。検証用DBファイルは停止状態で一時ディレクトリに保持し、既存ファイルや通常のSafariウィンドウは削除していない。担当サブエージェント3名も終了。

## 主な変更ファイル

- 再訪・遷移：`app/manage/page.tsx`、`components/management-entry.tsx`、`lib/management-link.ts`、`components/site-header.tsx`、`components/site-footer.tsx`、`lib/site.ts`、`next.config.ts`。
- 公開管理：`app/profile/manage/page.tsx`、`components/profile-management-client.tsx`、`components/profile-management-link.tsx`、`lib/profile-management-link.ts`、`lib/profile-origin.ts`、`lib/profile-selection.ts`、`components/public-profile-actions.tsx`、`components/profile-automation-controls.tsx`、`components/scan-progress.tsx`、`app/api/ai-profile/route.ts`、`lib/public-profile.ts`、`lib/profile-automation.ts`、`lib/storage.ts`、`lib/types.ts`、`lib/watch-measurement.ts`。
- 結果・通知：`lib/measurement-readout.ts`、`components/result-client.tsx`、`components/watch-client.tsx`、`components/executive-diagnostic-summary.tsx`、`lib/watch-email.ts`。
- データ管理：`app/api/privacy/export/route.ts`、`app/api/privacy/delete/route.ts`、`lib/privacy-data.ts`、`components/data-rights-client.tsx`、`app/data-rights/page.tsx`。
- 利用者向け説明・表示：`app/privacy/page.tsx`、`app/terms/page.tsx`、`app/commerce/page.tsx`、`app/support/page.tsx`、`components/ai-readable-client.tsx`、`lib/ai-readable.ts`、`components/zero-effort-promise-section.tsx`、`app/setup/page.tsx`、`app/not-found.tsx`、`app/utility.css`、`app/globals.css`。
- DB：`supabase/migrations/014_email_optional_privacy.sql`、`supabase/migrations/015_atomic_profile_renewal.sql`。本番適用は未実施。
- 回帰試験：`tests/management-navigation.test.ts`、`tests/measurement-readout-lifecycle.test.ts`、`tests/watch-copy-states.test.ts`、`tests/profile-recovery.test.ts`、`tests/profile-origin.test.ts`、`tests/profile-selection-regression.test.ts`、`tests/query-race.test.ts`、`tests/billing-privacy-release.test.ts`、`tests/privacy-data.test.ts`、`tests/privacy-transaction.sql`、`tests/profile-renewal-transaction.sql`、`tests/scan-start-client.test.ts`、Safariスクリプト2本。

直前から存在した文言復元の差分は`docs/COPY_RESTORE_2026-09-07.md`と分けて扱う。料金・北極星・プロジェクト方針を、この導線修正のために変更していない。

## 事実の不足と未実施を区別する

運営者・連絡先・所在地、実際の保存期間や委託先の処理地域などは推測で補わない。運営情報が未掲載の環境の販売開始ガードを外さない。文面修正だけを法務確認や販売準備完了とは扱わない。

GitHub同期・本番デプロイ・本番マイグレーション・実課金・実通知は、この修正のローカル検証とは別。本書を作成しただけでGitHubに記録済みとは報告しない。

最終状態：指摘17項目と追加発見した不具合をローカル修正・検証済み。変更は未コミット・未push。元のHEADは`f3c5a7f5963c8792c791dc58e28a4d1e414aa342`のまま。一般販売可の最終判定には、実際の運営者・連絡先等の確定、本番DBへの014・015適用、本番での診断・契約・週次測定・通知の通し確認が別途必要。

## 追記：初回公開に不要な案内の整理

オーナーの「今はいらない、削除したりして」「すぐに公開できるように」に基づき、連絡先未登録の問い合わせページ、販売者情報未登録の特商法ページは表示しない（直接アクセスは404）。「受付を開始していません」「未掲載（販売受付前）」の表示を削除。共通フッターとサイトマップから両ページへのリンクを除外し、規約・プライバシー内のリンクは必要情報がある場合だけ表示する。

公開ページ・データ管理の存在しない問い合わせ先への案内も外し、所有者の管理・掲載停止を残した。連絡先登録済みの問い合わせ機能と、販売準備未完了時の課金拒否は残す。第三者の問い合わせ受付が新設されたわけではなく、これを根拠に一般販売準備完了とはしない。価格・主な訴求・診断と見守りの機能は変更しない。

この追記の変更対象は上記8ソースファイルと`tests/optional-public-pages.test.ts`。ソースを消去せず条件付き非表示にしたため復元可能。GitHub・本番反映は未実施。

検証：既存156テスト・lint・型チェック・本番ビルド成功。追加2テスト成功。ローカルHTTPでホーム・規約・プライバシー・公開サンプルの200、非表示2ページの404、不要案内とリンクの不在を確認した。この追記ではSafari再操作は未実施。
