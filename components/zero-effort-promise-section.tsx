"use client";

export function ZeroEffortPromiseSection() {
  return (
    <section
      id="zero-effort-promise"
      className="zero-effort-promise-section shell"
      aria-label="完全自動運用とユーザー作業ゼロの保証"
      style={{
        margin: "36px auto 44px",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "8px",
          color: "#0f172a",
          padding: "clamp(28px, 4vw, 40px) clamp(20px, 3.5vw, 36px)",
          boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
          border: "1px solid #e2e8f0",
        }}
      >
        {/* ヘッダー */}
        <div style={{ textAlign: "center", maxWidth: "820px", margin: "0 auto 32px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#f1f5f9",
              border: "1px solid #e2e8f0",
              padding: "4px 12px",
              borderRadius: "4px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#475569",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Official Assurance / 運用の公式保証
            </span>
          </div>
          <h2
            style={{
              fontSize: "clamp(1.35rem, 2.5vw, 1.95rem)",
              fontWeight: 800,
              lineHeight: 1.35,
              letterSpacing: "-0.025em",
              margin: "0 0 14px",
              color: "#0f172a",
            }}
          >
            あなたの手は一切煩わせません。<br />
            あなたがやることは、URLや会社名を入力するだけです。
          </h2>
          <p
            style={{
              fontSize: "0.92rem",
              color: "#475569",
              lineHeight: 1.75,
              margin: 0,
              maxWidth: "680px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            ホームページの改修も、サーバーの設定も、面倒なブログ更新も不要です。<br />
            <strong>なぜ、URLを入力するだけで完全自動で成立するのか？</strong> その客観的な仕組みを3つの理由で説明します。
          </p>
        </div>

        {/* 3つの理由（なぜURLだけでいいのか？） */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(270px, 100%), 1fr))",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          {/* 理由 01 */}
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              padding: "24px 22px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  color: "#0284c7",
                  letterSpacing: "0.05em",
                }}
              >
                01
              </span>
              <strong style={{ fontSize: "0.95rem", color: "#0f172a", lineHeight: 1.4 }}>
                公開情報を全自動で収集・整理するから
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              URLを入力いただくと、AIXが自社ホームページや国税庁法人番号、公的許認可などの公開情報を自動解析します。<br />
              AI探索ロボットが求める「事業内容・料金体系・取引実績・許認可番号」をシステムが自動で抽出・構造化するため、資料提出の手間はありません。
            </p>
          </div>

          {/* 理由 02 */}
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              padding: "24px 22px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  color: "#0284c7",
                  letterSpacing: "0.05em",
                }}
              >
                02
              </span>
              <strong style={{ fontSize: "0.95rem", color: "#0f172a", lineHeight: 1.4 }}>
                自社サイトの外側に「AI専用台帳」を配備するから
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              自社サイトを改修したり制作会社に依頼する必要はありません。<br />
              ChatGPTやPerplexity等のAI探索ロボットが1秒で読める「国際規格の公式電子台帳」をAIX側が即日開設します。既存の自社サイトは1文字も触りません。
            </p>
          </div>

          {/* 理由 03 */}
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              padding: "24px 22px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  color: "#0284c7",
                  letterSpacing: "0.05em",
                }}
              >
                03
              </span>
              <strong style={{ fontSize: "0.95rem", color: "#0f172a", lineHeight: 1.4 }}>
                毎週の追跡・監視・保守も自動で自走するから
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              AIの検索アルゴリズム更新や、ライバル企業の急浮上も、システムが毎週自動で測定・監視します。<br />
              台帳の定期メンテナンスや最新データへの最適化も全自動で回るため、管理画面にログインして操作する負担もありません。
            </p>
          </div>
        </div>

        {/* コミットメントメッセージバー */}
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#0f172a",
                background: "#e2e8f0",
                padding: "2px 8px",
                borderRadius: "3px",
                letterSpacing: "0.05em",
              }}
            >
              COMMITMENT
            </span>
            <span style={{ fontSize: "0.88rem", color: "#334155", lineHeight: 1.5 }}>
              <strong>社長は、本業（接客・施工・製造・経営）に100%専念してください。</strong><br />
              AI営業窓口の構築・AIへの認知・ライバル監視は、すべてAIXが自走させます。
            </span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "#0f172a",
              background: "#e2e8f0",
              border: "1px solid #cbd5e1",
              padding: "4px 12px",
              borderRadius: "4px",
              letterSpacing: "0.04em",
            }}
          >
            作業工数: 0分
          </span>
        </div>
      </div>
    </section>
  );
}
