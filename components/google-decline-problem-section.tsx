"use client";

export function GoogleDeclineProblemSection() {
  return (
    <section
      id="google-decline"
      className="google-decline-section shell"
      aria-label="検索とAI回答の使い分け"
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
            AI回答時代に確認しておきたいこと
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
            検索だけでなく、AIに直接相談して比較する場面もあります
          </h2>
          <p style={{ fontSize: "0.92rem", color: "#475569", lineHeight: 1.75, margin: 0 }}>
            ChatGPTなどのAIに「どこが自分に合う？」と尋ねる場面では、質問・参照元・測定時点によって表示される候補が変わります。<br />
            ここでは、回答を測定する前に確認しておきたい3つのポイントを整理します。
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
                比較の入口が検索だけではなくなった
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#475569", lineHeight: 1.6, margin: 0 }}>
              一部の人は検索結果だけでなく、AIに条件を伝えて候補を比較するようになっています。
            </p>
            <div style={{ marginTop: "auto", background: "#fef2f2", border: "1px solid #fecaca", padding: "10px 12px", borderRadius: "6px", fontSize: "0.76rem", color: "#991b1b", lineHeight: 1.5 }}>
              <strong>確認点:</strong> AI経由の流入や問い合わせは、アクセス解析などで別に確認する必要があります。
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
                人向けの表示だけでは比較しにくいことがある
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#475569", lineHeight: 1.6, margin: 0 }}>
              写真やデザインだけでなく、名称・分野・条件・参照元を文章と構造化データで示すと、AIや人が確認しやすくなります。
            </p>
            <div style={{ marginTop: "auto", background: "#fef2f2", border: "1px solid #fecaca", padding: "10px 12px", borderRadius: "6px", fontSize: "0.76rem", color: "#991b1b", lineHeight: 1.5 }}>
              <strong>確認点:</strong> 掲載内容がどのページに書かれているか、参照元をたどれる状態にします。
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
                回答の候補は質問ごとに変わる
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#475569", lineHeight: 1.6, margin: 0 }}>
              AIは質問・参照元・モデルの更新によって異なる候補を表示します。自社が含まれるかは、同じ条件で測定して確認します。
            </p>
            <div style={{ marginTop: "auto", background: "#fef2f2", border: "1px solid #fecaca", padding: "10px 12px", borderRadius: "6px", fontSize: "0.76rem", color: "#991b1b", lineHeight: 1.5 }}>
              <strong>確認点:</strong> 1回の回答だけで判断せず、質問パネルと測定日をそろえて推移を見ます。
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
