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
              background: "#f1f5f9",
              border: "1px solid #e2e8f0",
              color: "#475569",
              fontSize: "0.72rem",
              fontFamily: "var(--font-mono, monospace)",
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: "4px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Market Shift / 市場構造の地殻変動
          </span>
          <h2
            style={{
              fontSize: "clamp(1.4rem, 2.8vw, 2.1rem)",
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.3,
              letterSpacing: "-0.025em",
              margin: "0 0 16px",
            }}
          >
            Google検索で探す時代は終わりました。<br />
            顧客は今、ChatGPTやAIに直接「おすすめ」を聞いています。
          </h2>
          <p style={{ fontSize: "0.94rem", color: "#475569", lineHeight: 1.75, margin: 0 }}>
            広告やまとめサイトで埋め尽くされたGoogle検索に、賢い買い手やビジネスパーソンは愛想を尽かしました。<br />
            従来のホームページやSEO対策を放置している企業が直面している、<strong>「3つの静かな危機」</strong>。
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

        {/* 解決策への直通アクションバー */}
        <div
          style={{
            background: "#0f172a",
            borderRadius: "6px",
            padding: "24px 28px",
            color: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div style={{ maxWidth: "680px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#94a3b8",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "6px",
              }}
            >
              The Solution / AIXの解決策
            </span>
            <strong style={{ fontSize: "1.05rem", color: "#f8fafc", display: "block", marginBottom: "6px", letterSpacing: "-0.01em" }}>
              社名を入力するだけ。AIが1秒で読める「公式確定仕様台帳」を即日配備
            </strong>
            <p style={{ fontSize: "0.84rem", color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
              高額なSEO業者を雇う必要も、自社サイトを改修する必要もありません。AIが御社を推薦候補として認識できる最新規格を、自走システムで即座に整えます。
            </p>
          </div>
          <Link
            href="#scan"
            style={{
              background: "#ffffff",
              color: "#0f172a",
              padding: "10px 20px",
              borderRadius: "4px",
              fontSize: "0.86rem",
              fontWeight: 700,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "background 0.15s ease",
            }}
          >
            無料で現状を診断する <span aria-hidden="true">↑</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
