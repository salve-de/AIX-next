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
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: "4px",
              letterSpacing: "0.04em",
              marginBottom: "14px",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            なぜ今、起きているのか？
          </span>
          <h2
            style={{
              fontSize: "clamp(1.3rem, 2.5vw, 1.85rem)",
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.35,
              letterSpacing: "-0.025em",
              margin: "0 0 14px",
            }}
          >
            「Google検索」が終わり、顧客は「AIへの直接相談」へ移行しています
          </h2>
          <p style={{ fontSize: "0.92rem", color: "#475569", lineHeight: 1.75, margin: 0 }}>
            お客さんはもう広告だらけの検索結果を見比べません。ChatGPTなどのAIに「おすすめ」を直接聞く時代です。<br />
            従来のホームページがあるのに客足が遠のく、3つの見えない理由をご確認ください。
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
          {/* 課題 01 */}
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
                  color: "#0f172a",
                  background: "#e2e8f0",
                  padding: "2px 8px",
                  borderRadius: "3px",
                  letterSpacing: "0.05em",
                }}
              >
                課題 01
              </span>
              <strong style={{ fontSize: "1.0rem", color: "#0f172a", lineHeight: 1.4 }}>
                Google検索の広告増加と、顧客のAI直接相談への移行
              </strong>
            </div>
            <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              従来のGoogle検索は、広告や比較サイトが多くを占めるようになりました。<br />
              「どれが本当のおすすめかわからない」と感じた買い手は、<strong>公平で忖度のない答えを一瞬で出してくれるChatGPTなどのAIへ直接相談</strong>するようになっています。
            </p>
            <div style={{ marginTop: "auto", background: "#ffffff", border: "1px solid #e2e8f0", padding: "10px 12px", borderRadius: "4px", fontSize: "0.78rem", color: "#475569", lineHeight: 1.6 }}>
              <strong>背景:</strong> 広告が並ぶ検索結果を見比べず、信頼できる相談窓口（AI）に「どこが一番いい？」と直接聞く購買行動への変化です。
            </div>
          </div>

          {/* 課題 02 */}
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
                  color: "#0f172a",
                  background: "#e2e8f0",
                  padding: "2px 8px",
                  borderRadius: "3px",
                  letterSpacing: "0.05em",
                }}
              >
                課題 02
              </span>
              <strong style={{ fontSize: "1.0rem", color: "#0f172a", lineHeight: 1.4 }}>
                デザイン重視のWebサイトと、AIの読解の壁
              </strong>
            </div>
            <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              写真やデザイン中心のWebサイトは、人間には美しく見えても、テキストを解析するAI探索ロボットには正しく伝わらないことがあります。<br />
              <strong>AIが理解できる公式データとして整備されていない場合、優れた実績や強みがあってもAIの推薦候補から漏れてしまいます。</strong>
            </p>
            <div style={{ marginTop: "auto", background: "#ffffff", border: "1px solid #e2e8f0", padding: "10px 12px", borderRadius: "4px", fontSize: "0.78rem", color: "#475569", lineHeight: 1.6 }}>
              <strong>背景:</strong> 人間向けの綺麗なパンフレットを置くだけでは、機械の読み取り口（AIロボット）には認識されないのと同じ状態です。
            </div>
          </div>

          {/* 課題 03 */}
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
                  color: "#0f172a",
                  background: "#e2e8f0",
                  padding: "2px 8px",
                  borderRadius: "3px",
                  letterSpacing: "0.05em",
                }}
              >
                課題 03
              </span>
              <strong style={{ fontSize: "1.0rem", color: "#0f172a", lineHeight: 1.4 }}>
                気付かないうちに、大手チェーンへ比較が集中
              </strong>
            </div>
            <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              顧客がAIに「近くでおすすめの会社は？」「親身に相談できるところは？」と尋ねた際、AIはWeb上の露出量が多い大手チェーンを優先して提示します。<br />
              <strong>自社のWebサイトを見てもらう前の段階で大手に誘導されてしまう</strong>ため、機会損失に気付くことができません。
            </p>
            <div style={{ marginTop: "auto", background: "#ffffff", border: "1px solid #e2e8f0", padding: "10px 12px", borderRadius: "4px", fontSize: "0.78rem", color: "#475569", lineHeight: 1.6 }}>
              <strong>背景:</strong> 自社の店舗を見比べてもらう前に、大手チェーンの相談窓口へ顧客が直接案内されているような状態です。
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
