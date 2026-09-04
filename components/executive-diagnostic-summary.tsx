"use client";

interface ExecutiveDiagnosticSummaryProps {
  brandName: string;
  rank?: number;
  topCompetitor?: string;
  lostCount?: number;
  totalCount?: number;
}

export function ExecutiveDiagnosticSummary({
  brandName,
  rank = 93,
  topCompetitor = "全国展開の大手買取企業",
  lostCount = 12,
  totalCount = 12,
}: ExecutiveDiagnosticSummaryProps) {
  return (
    <section
      id="executive-summary"
      className="executive-summary-section shell"
      aria-label="AI診断要約と提供価値"
      style={{
        marginTop: "24px",
        marginBottom: "32px",
      }}
    >
      <div
        style={{
          background: "#09090b",
          borderRadius: "8px",
          color: "#ffffff",
          padding: "clamp(24px, 3.5vw, 32px)",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          border: "1px solid #27272a",
        }}
      >
        {/* ヘッダーバッジ */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                background: "#f1f5f9",
                color: "#0f172a",
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "0.72rem",
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: "3px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Executive Summary / 経営要約
            </span>
            <span style={{ color: "#a1a1aa", fontSize: "0.8rem" }}>
              AI推薦メカニズム解説 ＆ 施工価値
            </span>
          </div>
          <div
            style={{
              fontSize: "0.76rem",
              color: "#d4d4d8",
              background: "#18181b",
              border: "1px solid #27272a",
              padding: "3px 10px",
              borderRadius: "4px",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            SUBJECT: <strong style={{ color: "#ffffff" }}>{brandName}</strong>
          </div>
        </div>

        {/* メインヘッドライン */}
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              fontSize: "clamp(1.2rem, 2.2vw, 1.55rem)",
              fontWeight: 800,
              lineHeight: 1.35,
              letterSpacing: "-0.02em",
              margin: "0 0 10px",
              color: "#f4f4f5",
            }}
          >
            なぜAIは御社を「100位中{rank}位」と判定したのか？<br />
            そして、本システムが「具体的にどう解決したのか」。
          </h2>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#a1a1aa", lineHeight: 1.7 }}>
            御社の実績や接客力が劣っているわけではありません。原因は<strong>「AIの学習データの偏り」</strong>と<strong>「AI専用台帳の欠如」</strong>という機械的な構造問題でした。
          </p>
        </div>

        {/* 根本原因の2大ボトルネック（文系比喩で完全解説） */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "14px",
            marginBottom: "24px",
          }}
        >
          {/* 原因 01 */}
          <div
            style={{
              background: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "6px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  color: "#f87171",
                  letterSpacing: "0.04em",
                }}
              >
                01
              </span>
              <strong style={{ fontSize: "0.95rem", color: "#f4f4f5", lineHeight: 1.4 }}>
                データ量と知名度の圧倒的な偏り<br />
                <span style={{ fontSize: "0.8rem", color: "#a1a1aa", fontWeight: 500 }}>（図書館の本棚の占有率の差）</span>
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#a1a1aa", lineHeight: 1.65, margin: 0 }}>
              AIの学習データにおいて、東証上場の大手や広域チェーン（カチタス等）は、ネット上に<strong>数十万件のニュース記事やプレスリリース</strong>が存在します。<br />
              AIは知識の浅い機械であるため、<strong>「本棚に大量の本がある会社＝信頼できる大手」と機械的に判断</strong>し、地域の中小企業を素通りして大手を自動推薦してしまいます。
            </p>
          </div>

          {/* 原因 02 */}
          <div
            style={{
              background: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "6px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  color: "#f87171",
                  letterSpacing: "0.04em",
                }}
              >
                02
              </span>
              <strong style={{ fontSize: "0.95rem", color: "#f4f4f5", lineHeight: 1.4 }}>
                AIロボットが読める台帳がなかった<br />
                <span style={{ fontSize: "0.8rem", color: "#a1a1aa", fontWeight: 500 }}>（「写真・デザイン」 vs 「機械専用データ」）</span>
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#a1a1aa", lineHeight: 1.65, margin: 0 }}>
              既存のホームページは「人間がスマホで見るための写真やデザイン」で作られています。しかし、AI探索ロボット（GPTBot等）が必要とするのは、写真ではなく<strong>「1秒で読める機械専用の規格化データ」</strong>です。<br />
              「大手が断る古家をどう扱うか」「最短即日買取の確定条件」が機械向けに公開されていなかったため、AIは<strong>「誤案内を避けるための安全策」として推薦順位を{rank}位まで下げていた</strong>のです。
            </p>
          </div>
        </div>

        {/* 具体的にどう解決したか（施工アクション：完全自動） */}
        <div
          style={{
            background: "#18181b",
            border: "1px solid #3f3f46",
            borderRadius: "6px",
            padding: "20px 22px",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  background: "#f4f4f5",
                  color: "#09090b",
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  padding: "2px 6px",
                  borderRadius: "3px",
                  textTransform: "uppercase",
                }}
              >
                Action
              </span>
              <strong style={{ fontSize: "1.02rem", color: "#f4f4f5", letterSpacing: "-0.01em" }}>
                社長の作業は「社名を入力しただけ」。あとは自走システムで公式窓口が稼働
              </strong>
            </div>
            <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#a1a1aa", fontFamily: "var(--font-mono, monospace)", background: "#27272a", padding: "2px 8px", borderRadius: "3px" }}>
              作業工数: 0分（改修ゼロ）
            </span>
          </div>
          <p style={{ fontSize: "0.86rem", color: "#a1a1aa", lineHeight: 1.7, margin: "0 0 14px" }}>
            ITの専門知識も、ホームページの改修工事も不要です。<br />
            AIXが自社サイトの公開情報と公的データベースを解析し、ChatGPTやPerplexity等のAI探索ロボットが1秒で読める<strong>「AI公式確定仕様台帳（国際規格JSON-LD・出展証跡完備）」を自社サイトの外側に全自動配備</strong>しました。<br />
            「大手が断るような空き家・古家の売却条件」や「即日個別対応の強み」が、AIのナレッジベースに直接登録されています。
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", fontSize: "0.76rem" }}>
            <span style={{ background: "#27272a", border: "1px solid #3f3f46", padding: "3px 8px", borderRadius: "3px", color: "#e4e4e7" }}>
              ユーザー作業: URL・社名を入力するだけ（自走運用）
            </span>
            <span style={{ background: "#27272a", border: "1px solid #3f3f46", padding: "3px 8px", borderRadius: "3px", color: "#e4e4e7" }}>
              国際標準構造化データ（Schema.org）自動常駐
            </span>
            <span style={{ background: "#27272a", border: "1px solid #3f3f46", padding: "3px 8px", borderRadius: "3px", color: "#e4e4e7" }}>
              宅建業法・公的免許番号の全データ出展証跡を自動付与
            </span>
            <span style={{ background: "#27272a", border: "1px solid #3f3f46", padding: "3px 8px", borderRadius: "3px", color: "#e4e4e7" }}>
              定期保守・毎週のAI回答変動監視も全自動
            </span>
          </div>
        </div>

        {/* 提供価値のBefore / After 対比表 */}
        <div id="executive-summary-comparison">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <strong style={{ fontSize: "0.92rem", color: "#f4f4f5" }}>
              提供価値の対比：Before（導入前） vs After（導入後）
            </strong>
            <span style={{ fontSize: "0.74rem", color: "#71717a", fontFamily: "var(--font-mono, monospace)" }}>
              BEHAVIOR TRANSFORMATION
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "12px",
            }}
          >
            {/* Before */}
            <div
              style={{
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "6px",
                padding: "16px 18px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <span style={{ color: "#f87171", fontWeight: 700, fontSize: "0.78rem", fontFamily: "var(--font-mono, monospace)" }}>[ BEFORE / 導入前 ]</span>
                <span style={{ color: "#71717a", fontSize: "0.74rem" }}>（AI推薦順位: {rank}位）</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.82rem", color: "#a1a1aa", lineHeight: 1.65 }}>
                <li>AIは「本棚にデータがない会社」と判定し、知名度だけで大手を推奨</li>
                <li>「確定条件」が分からないため、AIが誤案内を恐れて自社を除外</li>
                <li>対策方法が分からず、ブログ更新やサイト改修に手を取られる（または放置）</li>
                <li><strong>結果: 地域で家や土地を売りたい顧客が、AI経由で大手に丸ごと流出</strong></li>
              </ul>
            </div>

            {/* After */}
            <div
              style={{
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "6px",
                padding: "16px 18px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <span style={{ color: "#4ade80", fontWeight: 700, fontSize: "0.78rem", fontFamily: "var(--font-mono, monospace)" }}>[ AFTER / 導入後 ]</span>
                <span style={{ color: "#71717a", fontSize: "0.74rem" }}>（公式推薦パス常駐配備）</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.82rem", color: "#e4e4e7", lineHeight: 1.65 }}>
                <li>AI探索ロボットが「大手が対応しにくい個別案件（古家・即日）の第一候補」として認識</li>
                <li>出展つきの確定台帳により、AIが自信を持って御社の電話番号や相談窓口を提示</li>
                <li><strong>社長は完全放置で成立</strong>: 自社サイトの改修も更新もゼロ。本業に100%集中可能</li>
                <li><strong>結果: 「大手に断られた」「すぐに売りたい」質の高い見込み客が直接御社へ流入</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 公式台帳への直通導線 */}
        <div
          style={{
            marginTop: "20px",
            paddingTop: "16px",
            borderTop: "1px solid #27272a",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ fontSize: "0.8rem", color: "#a1a1aa" }}>
            配備された確定仕様台帳は、ステップ2の<strong>「AI公式推薦パス」</strong>からいつでも実物をご確認いただけます。
          </div>
          <a
            href="#step-2"
            style={{
              background: "#ffffff",
              color: "#09090b",
              fontSize: "0.78rem",
              fontWeight: 700,
              padding: "6px 14px",
              borderRadius: "4px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              textDecoration: "none",
            }}
          >
            ステップ2の配備済み看板を見る <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
