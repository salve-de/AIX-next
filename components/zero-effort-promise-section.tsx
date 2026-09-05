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
                letterSpacing: "0.05em",
              }}
            >
              完全自動運用の約束
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
            あなたがやることは、会社名を入れるだけ（10秒）です。
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
            ホームページの改修も、サーバーの設定も、面倒なブログ更新も一切不要です。<br />
            <strong>なぜ、社名を入れるだけで勝手にAIがお客を連れてくるようになるのか？</strong> その理由を3つでお話しします。
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
                ネット上にある御社の強みを、AIが勝手に集めるから
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              社名を入力いただくだけで、AIがホームページや公的データ、取引実績を自動解析します。<br />
              ChatGPTが「お客に推薦する決め手」となる強み（短納期・親身な対応・個別特注など）をシステムが自動で抜き出すため、資料を準備して提出する手間は一切ありません。
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
                今のホームページはいじらず、外側に「AI専用の看板」を作るから
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              制作会社にホームページの改修をお願いしたり、サーバーをいじる必要はありません。<br />
              ChatGPTなどのAIロボットが24時間読み込める「専用の紹介看板」をネット上に自動開設します。今あるホームページは1文字も触る必要がありません。
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
                ライバルの監視もAIの最新対策も、全部勝手に自走するから
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              AIの回答ルールの変更や、ライバルが急に客を奪い始めたかどうかも、システムが毎週自動で見守ります。<br />
              専用看板の最新維持も全自動で回るため、管理画面にログインしてポチポチ作業する負担すらゼロです。
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
              安心の約束
            </span>
            <span style={{ fontSize: "0.88rem", color: "#334155", lineHeight: 1.5 }}>
              <strong>社長は、本業（接客・施工・製造・経営）に100%専念してください。</strong><br />
              AI専用看板の設置・AIへの売り込み・ライバル監視は、すべてAIXが勝手に自走させます。
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
