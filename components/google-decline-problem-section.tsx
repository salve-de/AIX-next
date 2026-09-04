"use client";

import Link from "next/link";

export function GoogleDeclineProblemSection() {
  return (
    <section
      id="google-decline"
      className="google-decline-section shell"
      aria-label="Google検索の衰退と中小企業の課題"
      style={{
        margin: "48px auto",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #cbd5e1",
          padding: "36px 32px 40px",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
        }}
      >
        {/* セクションヘッダー */}
        <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 36px" }}>
          <span
            style={{
              display: "inline-block",
              background: "#fee2e2",
              color: "#dc2626",
              fontSize: "0.78rem",
              fontWeight: 800,
              padding: "4px 12px",
              borderRadius: "20px",
              letterSpacing: "0.06em",
              marginBottom: "12px",
            }}
          >
            市場の地殻変動：Google検索の衰退
          </span>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)",
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.25,
              margin: "0 0 16px",
            }}
          >
            Google検索で探す時代は終わりました。<br />
            顧客は今、<span style={{ color: "#2563eb" }}>ChatGPTやAIに直接「おすすめ」を聞いています。</span>
          </h2>
          <p style={{ fontSize: "0.98rem", color: "#475569", lineHeight: 1.7, margin: 0 }}>
            広告やまとめサイトで埋め尽くされたGoogle検索に、賢い買い手やビジネスパーソンは愛想を尽かしました。<br />
            従来のホームページやSEO対策を放置している企業が直面している、<strong>「3つの静かな危機」</strong>。
          </p>
        </div>

        {/* 3大危機のカードグリッド */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            gap: "20px",
            marginBottom: "36px",
          }}
        >
          {/* 危機 1 */}
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  background: "#dc2626",
                  color: "#ffffff",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  padding: "3px 8px",
                  borderRadius: "4px",
                }}
              >
                危機 01
              </span>
              <strong style={{ fontSize: "1.05rem", color: "#0f172a" }}>
                Google検索の「広告汚染」と顧客離れ
              </strong>
            </div>
            <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              現在のGoogle検索は、画面の上から下まで「スポンサー広告」と「アフィリエイト一括査定サイト」ばかりです。<br />
              「どれが本当の情報かわからない」と疲弊した顧客は、<strong>『公平で忖度のない答え』を一瞬で出してくれるChatGPTやPerplexityへ大移動</strong>しています。
            </p>
            <div style={{ marginTop: "auto", background: "#f1f5f9", padding: "10px 12px", borderRadius: "6px", fontSize: "0.78rem", color: "#334155" }}>
              💡 <strong>文系比喩:</strong> チラシばかり入る郵便ポスト（Google）を見なくなった客が、信頼できる相談相手（AI）に直接聞いている状態。
            </div>
          </div>

          {/* 危機 2 */}
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  background: "#dc2626",
                  color: "#ffffff",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  padding: "3px 8px",
                  borderRadius: "4px",
                }}
              >
                危機 02
              </span>
              <strong style={{ fontSize: "1.05rem", color: "#0f172a" }}>
                高額SEO・ブログ記事更新の無力化
              </strong>
            </div>
            <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              月額30万円を払ってブログ記事を量産しても、AIは業者の宣伝文句を信用しません。<br />
              ChatGPT等の探索ロボットが必要としているのは、宣伝記事ではなく<strong>「1秒で検証できる機械専用の確定仕様データ（JSON-LD・出展付き実績）」</strong>です。古いSEOを続けてもお金をドブに捨てるだけです。
            </p>
            <div style={{ marginTop: "auto", background: "#f1f5f9", padding: "10px 12px", borderRadius: "6px", fontSize: "0.78rem", color: "#334155" }}>
              💡 <strong>文系比喩:</strong> 人間向けの紙パンフレットをいくら印刷しても、駅の自動改札機（AIロボット）には通らないのと同じ。
            </div>
          </div>

          {/* 危機 3 */}
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  background: "#dc2626",
                  color: "#ffffff",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  padding: "3px 8px",
                  borderRadius: "4px",
                }}
              >
                危機 03
              </span>
              <strong style={{ fontSize: "1.05rem", color: "#0f172a" }}>
                気付かないうちに「客が全員大手へ流出」
              </strong>
            </div>
            <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              顧客がAIに「近くでおすすめの不動産屋は？」「古家を買い取ってくれる会社は？」と質問した瞬間、<strong>御社の名前すら出ずに、大手チェーン（カチタス等）へ自動送客</strong>されています。<br />
              問い合わせ自体が発生しないため、社長は客を奪われていることにすら気付けません。
            </p>
            <div style={{ marginTop: "auto", background: "#f1f5f9", padding: "10px 12px", borderRadius: "6px", fontSize: "0.78rem", color: "#334155" }}>
              💡 <strong>文系比喩:</strong> 御社の店の前を通りすらせず、裏口からライバル店行きの直行バスに顧客全員が乗せられている状態。
            </div>
          </div>
        </div>

        {/* 解決策への直通アクションバー */}
        <div
          style={{
            background: "linear-gradient(90deg, #0f172a 0%, #1e293b 100%)",
            borderRadius: "12px",
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
            <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#38bdf8", letterSpacing: "0.04em", display: "block", marginBottom: "4px" }}>
              AIX Next の解決策（完全放置・改修ゼロ）
            </span>
            <strong style={{ fontSize: "1.1rem", color: "#f8fafc", display: "block", marginBottom: "4px" }}>
              社名を入力するだけ。AIが1秒で読める「公式確定仕様台帳」を即日配備
            </strong>
            <p style={{ fontSize: "0.84rem", color: "#94a3b8", margin: 0 }}>
              高額なSEO業者を雇う必要も、自社サイトを改修する必要も一切ありません。AIが御社を推薦候補として認識できる最新の規格を、完全放置で即座に整えます。
            </p>
          </div>
          <Link
            href="#scan"
            style={{
              background: "#0284c7",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: 800,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 12px rgba(2, 132, 199, 0.4)",
            }}
          >
            無料で現状を診断する ↑
          </Link>
        </div>
      </div>
    </section>
  );
}
