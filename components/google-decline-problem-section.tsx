"use client";

import Link from "next/link";

export function GoogleDeclineProblemSection() {
  return (
    <section
      id="google-decline"
      className="google-decline-section shell"
      aria-label="Google検索の衰退と中小企業の課題"
      style={{
        margin: "44px auto",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          padding: "clamp(28px, 4vw, 40px) clamp(20px, 3.5vw, 36px)",
          boxShadow: "0 1px 3px rgba(15, 23, 42, 0.05)",
        }}
      >
        {/* セクションヘッダー */}
        <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 36px" }}>
          <span
            style={{
              display: "inline-block",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#991b1b",
              fontSize: "0.72rem",
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: "4px",
              letterSpacing: "0.04em",
              marginBottom: "14px",
            }}
          >
            知らずに顧客を奪われる構造
          </span>
          <h3
            style={{
              fontSize: "clamp(1.25rem, 2.4vw, 1.75rem)",
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.35,
              letterSpacing: "-0.02em",
              margin: "0 0 12px",
            }}
          >
            従来のホームページやSEO対策を放置すると起きる、3つの静かな危機
          </h3>
          <p style={{ fontSize: "0.92rem", color: "#475569", lineHeight: 1.7, margin: 0 }}>
            「うちは昔作ったホームページがあるから大丈夫」という油断が、見えないところで大きな損失を生んでいます。
          </p>
        </div>

        {/* 3大危機のカードグリッド */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: "18px",
            marginBottom: "32px",
          }}
        >
          {/* 危機 01 */}
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
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "#b91c1c",
                  background: "#fee2e2",
                  padding: "2px 8px",
                  borderRadius: "3px",
                  letterSpacing: "0.05em",
                }}
              >
                CRISIS 01
              </span>
              <strong style={{ fontSize: "1.0rem", color: "#0f172a", lineHeight: 1.4 }}>
                Google検索の「広告汚染」と顧客離れ
              </strong>
            </div>
            <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              現在のGoogle検索は、画面の上から下まで「スポンサー広告」と「アフィリエイト一括査定サイト」ばかりです。<br />
              「どれが本当の情報かわからない」と疲弊した顧客は、<strong>『公平で忖度のない答え』を一瞬で出してくれるChatGPTやPerplexityへ大移動</strong>しています。
            </p>
            <div style={{ marginTop: "auto", background: "#f1f5f9", border: "1px solid #e2e8f0", padding: "10px 12px", borderRadius: "4px", fontSize: "0.78rem", color: "#334155", lineHeight: 1.6 }}>
              <strong>実務上の実態:</strong> チラシばかり入る郵便ポスト（Google）を見なくなった客が、信頼できる相談相手（AI）に直接聞いている状態。
            </div>
          </div>

          {/* 危機 02 */}
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
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "#b91c1c",
                  background: "#fee2e2",
                  padding: "2px 8px",
                  borderRadius: "3px",
                  letterSpacing: "0.05em",
                }}
              >
                CRISIS 02
              </span>
              <strong style={{ fontSize: "1.0rem", color: "#0f172a", lineHeight: 1.4 }}>
                高額SEO・ブログ記事更新の無力化
              </strong>
            </div>
            <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              月額30万円を払ってブログ記事を量産しても、AIは業者の宣伝文句を信用しません。<br />
              ChatGPT等の探索ロボットが必要としているのは、宣伝記事ではなく<strong>「1秒で検証できる機械専用の確定仕様データ（JSON-LD・出展付き実績）」</strong>です。古いSEOを続けても費用が無駄になります。
            </p>
            <div style={{ marginTop: "auto", background: "#f1f5f9", border: "1px solid #e2e8f0", padding: "10px 12px", borderRadius: "4px", fontSize: "0.78rem", color: "#334155", lineHeight: 1.6 }}>
              <strong>実務上の実態:</strong> 人間向けの紙パンフレットをいくら印刷しても、駅の自動改札機（AIロボット）には通らないのと同じ。
            </div>
          </div>

          {/* 危機 03 */}
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
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "#b91c1c",
                  background: "#fee2e2",
                  padding: "2px 8px",
                  borderRadius: "3px",
                  letterSpacing: "0.05em",
                }}
              >
                CRISIS 03
              </span>
              <strong style={{ fontSize: "1.0rem", color: "#0f172a", lineHeight: 1.4 }}>
                気付かないうちに「客が全員大手へ流出」
              </strong>
            </div>
            <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              顧客がAIに「近くでおすすめの不動産屋は？」「古家を買い取ってくれる会社は？」と質問した瞬間、<strong>御社の名前すら出ずに、大手チェーン（カチタス等）へ自動送客</strong>されています。<br />
              問い合わせ自体が発生しないため、客を奪われていることにすら気付けません。
            </p>
            <div style={{ marginTop: "auto", background: "#f1f5f9", border: "1px solid #e2e8f0", padding: "10px 12px", borderRadius: "4px", fontSize: "0.78rem", color: "#334155", lineHeight: 1.6 }}>
              <strong>実務上の実態:</strong> 御社の店の前を通りすらせず、裏口からライバル店行きの直行バスに顧客全員が乗せられている状態。
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
