"use client";

export function ZeroEffortPromiseSection() {
  return (
    <section
      id="zero-effort-promise"
      className="zero-effort-promise-section shell"
      aria-label="手間を抑えてAI推薦の獲得を目指す仕組み"
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
              AI推薦への取り組みを、少ない手間で
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
            まずはURLまたは社名を入れるだけ。<br />
            情報の整備と毎週の追跡を、Rovanに任せて本業へ。
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
            ホームページの改修やサーバー設定は不要です。<br />
            <strong>専門知識や追加の質問票は不要。</strong> 初回に対象サイト・公開内容を確認し、継続更新を許可します。
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
                  color: "#0f172a",
                  letterSpacing: "0.05em",
                }}
              >
                01
              </span>
              <strong style={{ fontSize: "0.95rem", color: "#0f172a", lineHeight: 1.4 }}>
                公開情報から、選ばれる理由の材料を集めるから
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              URLまたは社名を起点に、専門分野・対応地域・利用条件など、御社がどんな相談に応えられるかを公開ページから整理します。<br />
              参照元にない実績や強みを推測して追加することはありません。
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
                  color: "#0f172a",
                  letterSpacing: "0.05em",
                }}
              >
                02
              </span>
              <strong style={{ fontSize: "0.95rem", color: "#0f172a", lineHeight: 1.4 }}>
                自社サイトの改修なしで、専門性を伝えるページを作れるから
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              Web制作会社に改修を依頼したり、サーバー設定を変更したりする必要はありません。<br />
              参照元付きの公開情報ページをRovan上に用意し、初回確認後に公開できます。
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
                  color: "#0f172a",
                  letterSpacing: "0.05em",
                }}
              >
                03
              </span>
              <strong style={{ fontSize: "0.95rem", color: "#0f172a", lineHeight: 1.4 }}>
                同意した範囲の更新と、推薦の追跡を任せられるから
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              有効な有料Watchでは、同意後の週次処理で同じサイトの料金・対応地域などの短い記載を参照元付きで更新。毎週の承認は不要です。<br />
              同じ質問で推薦状況を追跡し、自動更新の停止・直前の更新の取り消しもできます。
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
              <strong>初回確認のあとは、許可した事実更新を任せて本業へ。</strong><br />
              会社紹介文や自社サイトは書き換えません。自動更新は公開ページの30日間の有効期限内で動作し、期限は延長しません。
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
            入力: URLまたは社名
          </span>
        </div>
      </div>
    </section>
  );
}
