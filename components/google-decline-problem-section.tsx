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
        className="shadow-ambient-md"
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          padding: "clamp(28px, 4vw, 44px) clamp(20px, 3.5vw, 36px)",
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
            従来のホームページが効かなくなった理由
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
            「Google検索」の利用が減り、顧客は「AIへの直接相談」へ移行しています
          </h2>
          <p style={{ fontSize: "0.92rem", color: "#475569", lineHeight: 1.75, margin: 0 }}>
            広告だらけの検索結果を見比べるのをやめ、ChatGPTなどのAIに「どこが一番いい？」と聞く客が急増。<br />
            自社のホームページがあるのに客足が遠のく、3つの見えない理由です。
          </p>
        </div>

        {/* 3大危機のカードグリッド（文字数を削ぎ落とし、0.5秒で刺さるフォーマット） */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: "20px",
            marginBottom: "16px",
          }}
        >
          {/* 理由 01 */}
          <div
            className="shadow-ambient-sm shadow-ambient-hover"
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  color: "#0f172a",
                  background: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  padding: "2px 7px",
                  borderRadius: "4px",
                  letterSpacing: "0.05em",
                }}
              >
                理由 01
              </span>
              <strong style={{ fontSize: "0.98rem", color: "#0f172a", lineHeight: 1.4 }}>
                検索が広告だらけになり、客がAIへ逃げた
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#475569", lineHeight: 1.6, margin: 0 }}>
              広告や比較サイトにうんざりした客は、忖度のないAIに直接おすすめを聞くようになりました。
            </p>
            <div style={{ marginTop: "auto", background: "#fef2f2", border: "1px solid #fecaca", padding: "10px 12px", borderRadius: "6px", fontSize: "0.76rem", color: "#991b1b", lineHeight: 1.5 }}>
              <strong>損失:</strong> 従来の検索経由の問い合わせが、静かに激減しています。
            </div>
          </div>

          {/* 理由 02 */}
          <div
            className="shadow-ambient-sm shadow-ambient-hover"
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  color: "#0f172a",
                  background: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  padding: "2px 7px",
                  borderRadius: "4px",
                  letterSpacing: "0.05em",
                }}
              >
                理由 02
              </span>
              <strong style={{ fontSize: "0.98rem", color: "#0f172a", lineHeight: 1.4 }}>
                綺麗なホームページほど、AIには読めない
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#475569", lineHeight: 1.6, margin: 0 }}>
              写真やデザイン中心のサイトは、文章を解析するAIロボットには強みが1文字も伝わりません。
            </p>
            <div style={{ marginTop: "auto", background: "#fef2f2", border: "1px solid #fecaca", padding: "10px 12px", borderRadius: "6px", fontSize: "0.76rem", color: "#991b1b", lineHeight: 1.5 }}>
              <strong>損失:</strong> 優れた実績があっても、AIからは「存在しない」扱いになります。
            </div>
          </div>

          {/* 理由 03 */}
          <div
            className="shadow-ambient-sm shadow-ambient-hover"
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  color: "#0f172a",
                  background: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  padding: "2px 7px",
                  borderRadius: "4px",
                  letterSpacing: "0.05em",
                }}
              >
                理由 03
              </span>
              <strong style={{ fontSize: "0.98rem", color: "#0f172a", lineHeight: 1.4 }}>
                気付かないうちに、客が大手チェーンへ全員流出
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#475569", lineHeight: 1.6, margin: 0 }}>
              AIは知名度のある大手ばかりを紹介するため、自社は比較される前に除外されます。
            </p>
            <div style={{ marginTop: "auto", background: "#fef2f2", border: "1px solid #fecaca", padding: "10px 12px", borderRadius: "6px", fontSize: "0.76rem", color: "#991b1b", lineHeight: 1.5 }}>
              <strong>損失:</strong> 問い合わせが来ないため、客を奪われた事実にすら気付けません。
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
