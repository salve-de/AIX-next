<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# AIX プロジェクト AI開発者・エージェント最高行動憲法
（ALL AI AGENTS MUST OBEY THIS PROTOCOL）

本リポジトリで作業するすべてのAIエージェント（Cursor, Claude, Copilot, ChatGPT, Antigravity等）は、以下の**4大絶対原則**を1文字たりとも妥協せずに遵守せよ。

## 1. このプロジェクトで達成すること（What We Achieve）
- **購買行動の地殻変動**: Google検索の広告汚染・衰退により、一般顧客は「ChatGPTやPerplexity等の生成AIに直接おすすめを聞く」行動へ急速に移行している。
- **解決すべき理不尽な課題**: 誠実な実力を持つ地域の中小企業（不動産、町工場、飲食店、専門士業等）が、AI上で大手全国チェーンに顧客を全件奪われ、スルーされている。
- **提供する価値**: URLまたは社名を入力するだけで、自社サイト改修ゼロで、主要AIが参照しやすい「客観的参照インデックス（構造化データ）」を外側に自動配備し、大手に奪われた推薦シェアを奪還する。

## 2. ユーザーの手間は「極限まで減らす（完全放置 / Zero Effort）」なぜなら
- **なぜユーザーに作業をさせてはならないのか？**:
  - 中小企業の社長やパン屋の店主は本業で極めて多忙であり、決定を極度に嫌う。
  - 「自社サイトを改修してください」「ファイルを設置してください」「ブログを書いてください」「質問票に回答してください」と強いた瞬間に、**100%離脱（やらない・使われない）**する。
- **守るべき絶対仕様**:
  - ユーザーのアクションは「URLまたは社名を入れる最初の10秒」に限定する。
  - ユーザーへのヒアリング・質問票の送信は**絶対禁止**。公開情報にある確定事実（Fact）だけでシステムが全自動で完結させる。

## 3. 管理者（あなた・俺）も完全放置（無人自販機アーキテクチャ）
- **受託・コンサル業務の絶対禁止**:
  - 「他社ポータルへの申請・更新代行」「個別口コミの同意取り」「ECの在庫エラー裏方修正」といった**人間が裏で汗をかく労働集約型の代行業は1ミリも組み込んではならない**。
  - AIXは「完全自動の自動販売機（SaaS）」である。他社サイトへ頭を下げて申請せず、AIX自体が一次情報参照ハブ（JSON-LD）となり、AI探索ロボットに直接読ませる。
- **4大法的境界線の死守**:
  1. **Google Maps評価の除外**: 規約違反リスクを切除するため、初版ではMaps評価転載を行わない。
  2. **取扱項目の客観事実（Fact）限定**: 著作権侵害を避け、個別許諾を不要にするため、会社名・住所・価格等の事実データのみ扱う。
  3. **呼称の厳格適正化**: 本人確認を求めない仕様のため、「公式台帳」と名乗らず「公開情報参照インデックス」と位置づける。
  4. **推薦・手離れの断定排除**: 推薦成果を断定せず、免責事項および非公開申請窓口（オプトアウト）を常備する。

## 4. 長期的視野・スケーラビリティ最優先（短期の小手先の禁止）
- **今じゃなくて将来を見ろ**:
  - 「今だけ無料枠で済むから」「設定が今だけ早いから」という理由で、スケール時に破綻する小手先のインフラ（CI/CDのバッチ濫用、サーバーレス10秒タイムアウト等）を選ぶことを厳禁とする。
  - 顧客・監視対象が100社、1,000社、10,000社へと爆発的にスケールしたときに、**最も壊れず、最も安く、管理者の保守工数が最も楽な方法**（Cloud Scheduler ➔ Cloud Run Jobs等）を最初から選定せよ。
  - 将来の再設計・作り直しコストをゼロにすることが、管理者の手離れ100%の絶対条件である。
