<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Rovan プロジェクト AI開発者・エージェント最高行動憲法
（ALL AI AGENTS MUST OBEY THIS PROTOCOL）

本リポジトリで作業するすべてのAIエージェント（Cursor, Claude, Copilot, ChatGPT, Antigravity等）は、以下の**4大絶対原則**を1文字たりとも妥協せずに遵守せよ。

## 1. このプロジェクトで達成すること（What We Achieve）
- **確認したい変化**: 利用者がAIへ条件を伝えて候補を比較する場面では、質問・参照元・モデル・日時によって回答が変わります。Rovanはその変化を同じ条件で確認できるようにします。
- **解決する課題**: 地域の事業者や専門サービスは、公開情報が複数ページに分かれていると、利用者やAIが名称・分野・対応条件を確認しにくいことがあります。
- **提供する価値**: URLまたは社名を起点に、取得できた公開情報とAI回答を整理し、参照元付きの公開情報ページの下書きと測定結果を提供します。公開は内容を確認した後に行います。

## 2. ユーザーの入力負担を抑える
- **入力の原則**:
  - 最初の入力はURLまたは社名で開始できるようにする。
  - 既存サイトへの書き込みや、利用者への追加質問を前提にしない。
  - 不足情報を推測で補わず、未確認として表示する。
- **守るべき仕様**:
  - 社名から始めた場合は、候補サイトを利用者が確認してから診断する。
  - 公開情報ページやChange Packは下書きとして扱い、公開前の確認・承認を必要とする。

## 3. 自動化と公開の境界
- **自動化する範囲**:
  - クロール、測定、参照元の整理、下書き生成、週次比較は自動化する。
  - Rovanは対象会社のサイト、第三者ポータル、AI Providerの内部データを変更しない。
  - Rovanの公開プロフィールも、明示的な承認なしに公開・更新しない。
- **4大法的境界線の死守**:
  1. **Google Maps評価の除外**: 規約違反リスクを切除するため、初版ではMaps評価転載を行わない。
  2. **取扱項目の客観事実（Fact）限定**: 著作権侵害を避け、個別許諾を不要にするため、会社名・住所・価格等の事実データのみ扱う。
  3. **呼称の厳格適正化**: 本人確認や公的認証を行わないため、「公式台帳」と名乗らず「公開情報参照ページ」と位置づける。
  4. **推薦・成果の断定排除**: AIの回答、推薦、掲載順位、流入、問い合わせ、契約、売上を保証せず、訂正・非公開申請窓口を常備する。

## 4. 長期的視野・スケーラビリティ
- 実際の処理時間、再試行、レート制限、Provider費用、同時実行数、監視と復旧を測定してからインフラを選ぶ。
- 無料枠や短期の設定容易性だけを理由に、長時間のクロール・AI測定・再試行を短いリクエストへ詰め込まない。
- ジョブ、キュー、リース、冪等性、段階的な再開を使う場合は、実行ログと失敗時の復旧手順を残す。規模の数値や費用を根拠なく約束しない。

## 5. プロジェクトの北極星と測定モデル
- **北極星指標**:
  - **『候補回復率（測定質問ベース）』**。初回に自社が候補外だった質問のうち、同じ質問・AI・地域・測定条件で再測定した際に自社が候補へ含まれた割合を示す。
  - これはAI回答の観測値であり、顧客数、顧客シェア、売上、AI Providerの内部順位ではない。比較可能なパネル・取得成功数・測定日時を必ず併記する。
- **コア運用モデル**:
  - AI回答、候補名、参照元URL、公開情報の差分を観測事実として保存する。
  - 公開ページやChange Packは、確認できた事実と参照元を示す下書きとして扱い、明示承認なしに自動公開しない。
  - 施策後の変化は相関として記録し、未検証の因果・推薦成果・集客成果を断定しない。
