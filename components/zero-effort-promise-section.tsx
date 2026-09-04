"use client";

export function ZeroEffortPromiseSection() {
  return (
    <section
      id="zero-effort-promise"
      className="zero-effort-promise-section shell"
      aria-label="完全放置とユーザー作業ゼロの保証"
      style={{
        margin: "32px auto 40px",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          borderRadius: "16px",
          color: "#ffffff",
          padding: "36px 32px 38px",
          boxShadow: "0 16px 36px rgba(15, 23, 42, 0.12)",
          border: "1px solid #334155",
        }}
      >
        {/* ヘッダー */}
        <div style={{ textAlign: "center", maxWidth: "820px", margin: "0 auto 28px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(56, 189, 248, 0.15)", border: "1px solid rgba(56, 189, 248, 0.3)", padding: "4px 14px", borderRadius: "20px", marginBottom: "14px" }}>
            <span style={{ fontSize: "0.85rem" }}>🛡️</span>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#38bdf8", letterSpacing: "0.04em" }}>
              社長のための「完全放置」宣言
            </span>
          </div>
          <h2
            style={{
              fontSize: "clamp(1.4rem, 2.5vw, 1.95rem)",
              fontWeight: 800,
              lineHeight: 1.3,
              margin: "0 0 12px",
              color: "#f8fafc",
            }}
          >
            あなたの手は一切煩わせません。<br />
            <span style={{ color: "#38bdf8" }}>あなたがやることは、URLや会社名を入力するだけ</span>です。
          </h2>
          <p style={{ fontSize: "0.92rem", color: "#cbd5e1", lineHeight: 1.65, margin: 0 }}>
            ホームページの改修も、サーバーの設定も、面倒なブログ更新も一切不要です。<br />
            <strong>「なぜ、URLを入力するだけで完全放置でいいのか？」</strong> その仕組みを3つの理由で説明します。
          </p>
        </div>

        {/* 3つの理由（なぜURLだけでいいのか？） */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "18px",
            marginBottom: "28px",
          }}
        >
          {/* 理由 1 */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "12px",
              padding: "22px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  background: "#0284c7",
                  color: "#ffffff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                1
              </span>
              <strong style={{ fontSize: "0.98rem", color: "#f8fafc" }}>
                AIXが公開情報を「全自動で収集・整理」するから
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>
              URLを入力いただくと、AIXが自社ホームページや国税庁法人番号、公的許認可などの公開情報を自動解析します。<br />
              AI探索ロボットが求める「事業内容・料金体系・取引実績・許認可番号」を<strong>システムが全自動で抽出して規格化</strong>するため、社長が資料を提出する必要すらありません。
            </p>
          </div>

          {/* 理由 2 */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "12px",
              padding: "22px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  background: "#0284c7",
                  color: "#ffffff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                2
              </span>
              <strong style={{ fontSize: "0.98rem", color: "#f8fafc" }}>
                自社サイトの外側に「AI専用台帳」を自動配備するから
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>
              自社サイトを改修したり制作会社に依頼する必要はありません。<br />
              ChatGPTやPerplexity等の探索ロボット（GPTBot等）が巡回して1秒で読める<strong>「国際規格の公式確定仕様台帳（JSON-LD常駐）」をAIX側が即日自動開設</strong>します。自社の既存サイトは1文字も触りません。
            </p>
          </div>

          {/* 理由 3 */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "12px",
              padding: "22px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  background: "#0284c7",
                  color: "#ffffff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                3
              </span>
              <strong style={{ fontSize: "0.98rem", color: "#f8fafc" }}>
                毎週の追跡・監視・保守も「完全自動」で自走するから
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>
              AIの検索アルゴリズム更新や、ライバル企業の急浮上も、システムが毎週自動で測定・監視します。<br />
              台帳の定期メンテナンスや最新データへの最適化も全自動で回るため、<strong>社長が管理画面にログインして操作する手間すらゼロ</strong>です。
            </p>
          </div>
        </div>

        {/* コミットメントメッセージバー */}
        <div
          style={{
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            borderRadius: "10px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.2rem" }}>🤝</span>
            <span style={{ fontSize: "0.88rem", color: "#e2e8f0", lineHeight: 1.5 }}>
              <strong>社長は、本業（接客・施工・製造・経営）に100%専念してください。</strong><br />
              AI営業窓口の構築・AIへの認知・ライバル監視は、すべてAIXが完全放置で自走させます。
            </span>
          </div>
          <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#34d399", background: "rgba(52, 211, 153, 0.15)", padding: "4px 10px", borderRadius: "6px" }}>
            作業工数：完全0分
          </span>
        </div>
      </div>
    </section>
  );
}
