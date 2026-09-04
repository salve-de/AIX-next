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
          background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
          borderRadius: "16px",
          color: "#ffffff",
          padding: "28px 28px 32px",
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.15)",
          border: "1px solid #334155",
        }}
      >
        {/* ヘッダーバッジ */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                background: "#f59e0b",
                color: "#0f172a",
                fontSize: "0.75rem",
                fontWeight: 800,
                padding: "3px 10px",
                borderRadius: "6px",
                letterSpacing: "0.04em",
              }}
            >
              エグゼクティブ要約
            </span>
            <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>
              社長のためのAI推薦メカニズム解説 ＆ 施工価値
            </span>
          </div>
          <div style={{ fontSize: "0.78rem", color: "#cbd5e1", background: "rgba(255,255,255,0.08)", padding: "4px 12px", borderRadius: "20px" }}>
            対象企業：<strong>{brandName}</strong>
          </div>
        </div>

        {/* メインヘッドライン */}
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              fontSize: "clamp(1.25rem, 2.2vw, 1.65rem)",
              fontWeight: 800,
              lineHeight: 1.35,
              margin: "0 0 10px",
              color: "#f8fafc",
            }}
          >
            なぜAIは御社を「100位中{rank}位」と判定したのか？<br />
            そして、本システムが<span style={{ color: "#38bdf8" }}>「具体的にどう解決したのか」</span>。
          </h2>
          <p style={{ margin: 0, fontSize: "0.92rem", color: "#cbd5e1", lineHeight: 1.65 }}>
            御社の実績や接客力が劣っているわけでは一切ありません。原因は<strong>「AIの学習データの偏り」</strong>と<strong>「AI専用台帳の欠如」</strong>という機械的な構造問題でした。
          </p>
        </div>

        {/* 根本原因の2大ボトルネック（文系比喩で完全解説） */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          {/* 原因 1 */}
          <div
            style={{
              background: "rgba(30, 41, 59, 0.7)",
              border: "1px solid #334155",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "#ef4444",
                  color: "#ffffff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                1
              </span>
              <strong style={{ fontSize: "0.98rem", color: "#f8fafc" }}>
                データ量と知名度の圧倒的な偏り<br />
                <span style={{ fontSize: "0.82rem", color: "#f87171" }}>（図書館の「本棚の占有率」の差）</span>
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>
              AIの学習データにおいて、東証上場の大手や広域チェーン（カチタス等）は、インターネット上に<strong>数十万件のニュース記事や公的プレスリリース</strong>が存在します。<br />
              AIは知識の浅い機械であるため、<strong>「本棚に大量の本がある会社＝信頼できる大手」と機械的に判断</strong>し、地域の中小企業を素通りして大手を自動推薦してしまいます。
            </p>
          </div>

          {/* 原因 2 */}
          <div
            style={{
              background: "rgba(30, 41, 59, 0.7)",
              border: "1px solid #334155",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "#ef4444",
                  color: "#ffffff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                2
              </span>
              <strong style={{ fontSize: "0.98rem", color: "#f8fafc" }}>
                AIロボットが読める台帳がなかった<br />
                <span style={{ fontSize: "0.82rem", color: "#f87171" }}>（「写真・デザイン」 vs 「機械専用データ」）</span>
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>
              既存のホームページは「人間がスマホで見るための写真やデザイン」で作られています。しかし、AI探索ロボット（GPTBot等）が必要とするのは、写真ではなく<strong>「1秒で読める機械専用の規格化データ」</strong>です。<br />
              「大手が断る古家をどう扱うか」「最短即日買取の確定条件」が機械向けに公開されていなかったため、AIは<strong>「誤った案内をしてはならない」と安全策をとり、推薦順位を{rank}位まで下げていた</strong>のです。
            </p>
          </div>
        </div>

        {/* 具体的にどう解決したか（施工アクション） */}
        <div
          style={{
            background: "linear-gradient(90deg, rgba(2, 132, 199, 0.2) 0%, rgba(14, 165, 233, 0.1) 100%)",
            border: "1px solid #0284c7",
            borderRadius: "12px",
            padding: "20px 24px",
            marginBottom: "28px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span
              style={{
                background: "#0284c7",
                color: "#ffffff",
                fontSize: "0.72rem",
                fontWeight: 800,
                padding: "2px 8px",
                borderRadius: "4px",
              }}
            >
              システムの施工内容
            </span>
            <strong style={{ fontSize: "1.05rem", color: "#38bdf8" }}>
              自社サイト改修ゼロで、AI専用の「公式確定仕様台帳」をネット上に即時配備
            </strong>
          </div>
          <p style={{ fontSize: "0.86rem", color: "#e2e8f0", lineHeight: 1.65, margin: "0 0 12px" }}>
            本システムは、自社ホームページに一切手を加えることなく、AI探索ロボット（ChatGPT・Perplexity・Claude等）が巡回して1秒で取り込める<strong>「AI公式推薦パス（国際規格JSON-LD・出展証跡完備）」</strong>を開設・常駐配備しました。<br />
            これにより、AIに対して<strong>「大手が断るような古家・空き家の売却条件」や「個別伴走の実績エビデンス」を確定事実として直接インストール</strong>しました。
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", fontSize: "0.78rem" }}>
            <span style={{ background: "rgba(255,255,255,0.1)", padding: "4px 10px", borderRadius: "6px", color: "#bae6fd" }}>
              ✓ 国際標準構造化データ（Schema.org）完全準拠
            </span>
            <span style={{ background: "rgba(255,255,255,0.1)", padding: "4px 10px", borderRadius: "6px", color: "#bae6fd" }}>
              ✓ 宅建業法・公的免許番号の全データ出展証跡
            </span>
            <span style={{ background: "rgba(255,255,255,0.1)", padding: "4px 10px", borderRadius: "6px", color: "#bae6fd" }}>
              ✓ 大手チェーンの弱点（定型対応）を補う看板の確立
            </span>
          </div>
        </div>

        {/* 提供価値のBefore / After 対比表 */}
        <div id="executive-summary-comparison">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <strong style={{ fontSize: "0.95rem", color: "#f8fafc" }}>
              提供価値の対比：Before（導入前） vs After（導入後）
            </strong>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
              見込み客のAI相談時における挙動の変化
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "14px",
            }}
          >
            {/* Before */}
            <div
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "10px",
                padding: "16px 18px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <span style={{ color: "#ef4444", fontWeight: 800, fontSize: "0.8rem" }}>【施工前】Before</span>
                <span style={{ color: "#fca5a5", fontSize: "0.75rem" }}>（AI推薦順位：{rank}位）</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.82rem", color: "#cbd5e1", lineHeight: 1.6 }}>
                <li>AIは「本棚にデータがない会社」と判定し、知名度だけで大手を推奨</li>
                <li>「確定条件」が分からないため、AIがハルシネーション（誤案内）を恐れて自社を除外</li>
                <li><strong>結果：地域で家や土地を売りたいお客様が、AI経由で大手に丸ごと流出していた</strong></li>
              </ul>
            </div>

            {/* After */}
            <div
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                borderRadius: "10px",
                padding: "16px 18px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <span style={{ color: "#10b981", fontWeight: 800, fontSize: "0.8rem" }}>【施工後】After</span>
                <span style={{ color: "#6ee7b7", fontSize: "0.75rem" }}>（公式推薦パス常駐配備）</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.82rem", color: "#e2e8f0", lineHeight: 1.6 }}>
                <li>AI探索ロボットが「大手が対応しにくい個別案件（古家・即日）の第一候補」として認識</li>
                <li>出展つきの確定台帳により、AIが自信を持って御社の電話番号や相談窓口を提示</li>
                <li><strong>結果：「大手に断られた」「すぐに売りたい」質の高い見込み客が直接御社へ流入</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 公式台帳への直通導線 */}
        <div
          style={{
            marginTop: "20px",
            paddingTop: "16px",
            borderTop: "1px solid #334155",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
            👉 配備された確定仕様台帳は、ステップ2の<strong>「AI公式推薦パス」</strong>からいつでも実物をご確認いただけます。
          </div>
          <a
            href="#step-2"
            style={{
              background: "#0284c7",
              color: "#ffffff",
              fontSize: "0.8rem",
              fontWeight: 700,
              padding: "8px 18px",
              borderRadius: "6px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              textDecoration: "none",
            }}
          >
            ステップ2の配備済み看板を見る ↓
          </a>
        </div>
      </div>
    </section>
  );
}
