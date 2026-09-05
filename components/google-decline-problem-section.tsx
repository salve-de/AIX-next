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
                Google検索の広告だらけに嫌気がさした顧客が、AIへ大移動
              </strong>
            </div>
            <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              いまのGoogle検索は、上から下まで広告とお金目当ての比較サイトばかりです。<br />
              「どれが本当のおすすめかわからない」と疲れた買い手は、<strong>『忖度なしで一番いい会社』を一瞬で教えてくれるChatGPTなどのAIへ直接相談</strong>するようになっています。
            </p>
            <div style={{ marginTop: "auto", background: "#f1f5f9", border: "1px solid #e2e8f0", padding: "10px 12px", borderRadius: "4px", fontSize: "0.78rem", color: "#334155", lineHeight: 1.6 }}>
              <strong>身近な例え:</strong> チラシだらけの郵便受け（Google）を見なくなり、信頼できる知人（AI）に「どこが一番いい？」と直接聞いている状態です。
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
                綺麗な写真のホームページも、AIには「白紙」に見えている
              </strong>
            </div>
            <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              AIロボットは文字データしか読めないため、デザイン重視のホームページや画像チラシの内容をほとんど理解できません。<br />
              御社がどんなに良い腕や実績を持っていても、<strong>AIが読める専用データにして届けてあげないと、AIからは「存在しない会社」と同じ</strong>に見えてしまいます。
            </p>
            <div style={{ marginTop: "auto", background: "#f1f5f9", border: "1px solid #e2e8f0", padding: "10px 12px", borderRadius: "4px", fontSize: "0.78rem", color: "#334155", lineHeight: 1.6 }}>
              <strong>身近な例え:</strong> 人間向けの綺麗なカラー写真パンフレットを、駅の自動改札機（AIロボット）にかざしても切符と認識されないのと同じです。
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
                気付かないうちに、お客が全員「大手チェーン」へ奪われている
              </strong>
            </div>
            <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              お客さんがAIに「近くでおすすめの会社は？」「親身に相談に乗ってくれるところは？」と聞いた瞬間、<strong>御社の名前すら出ずに、広告量の多い大手チェーンへ自動的にお客が誘導</strong>されています。<br />
              自社のホームページを見てもらう前に客が奪われているため、減っていることにすら気付けません。
            </p>
            <div style={{ marginTop: "auto", background: "#f1f5f9", border: "1px solid #e2e8f0", padding: "10px 12px", borderRadius: "4px", fontSize: "0.78rem", color: "#334155", lineHeight: 1.6 }}>
              <strong>身近な例え:</strong> 御社の店の前を通りすらせず、裏口から大手ライバル店行きの直行バスに顧客全員が乗せられているような状態です。
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
