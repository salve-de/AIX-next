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
            検索からAI相談へ：購買行動の地殻変動
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
            お客さんはGoogleで探すのをやめ、AIに「どこが良い？」と直接聞く時代へ。
          </h2>
          <p style={{ fontSize: "0.92rem", color: "#475569", lineHeight: 1.75, margin: 0 }}>
            広告や比較サイトが並ぶ検索結果よりも、中立で的確な答えをくれる生成AIへ相談する顧客が急速に増えています。<br />
            しかし、AIが検証できる確定データがWeb上に整っていなければ、御社は候補にすら挙がらず、静かに競合や大手へ顧客が流出します。<br />
            今、中小企業が直面している「3つの現実」を整理しました。
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
          {/* 現実 01 */}
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
                現実 01
              </span>
              <strong style={{ fontSize: "0.98rem", color: "#0f172a", lineHeight: 1.4 }}>
                検索で1位でも、AIに無視されれば客は来ない
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              広告や比較サイトが並ぶ検索エンジンを避け、顧客はChatGPTに「どこが良い？」と直接相談する時代へ移りました。従来のSEOで上位にいても、AIが顧客に推薦する候補に入っていなければ、顧客の視界にすら入りません。
            </p>
            <div style={{ marginTop: "auto", background: "#f8fafc", border: "1px solid #e2e8f0", borderLeft: "3px solid #0f172a", padding: "10px 14px", borderRadius: "0 6px 6px 0", fontSize: "0.78rem", color: "#334155", lineHeight: 1.55 }}>
              <strong style={{ color: "#0f172a" }}>見えない顧客流出:</strong> 自社サイトのアクセス数だけを見ていても、AIの段階でライバルに奪われた顧客の存在には気付けません。
            </div>
          </div>

          {/* 現実 02 */}
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
                現実 02
              </span>
              <strong style={{ fontSize: "0.98rem", color: "#0f172a", lineHeight: 1.4 }}>
                人間向けの「綺麗なホームページ」は、AIには届かない
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              写真やイメージ中心のパンフレットのようなウェブサイトは、AIにとっては中身の検証できない画像にすぎません。AIが推薦の根拠にするのは、機械が客観的に検証できる確定仕様データ（取扱分野・実績・対応条件）です。
            </p>
            <div style={{ marginTop: "auto", background: "#f8fafc", border: "1px solid #e2e8f0", borderLeft: "3px solid #0f172a", padding: "10px 14px", borderRadius: "0 6px 6px 0", fontSize: "0.78rem", color: "#334155", lineHeight: 1.55 }}>
              <strong style={{ color: "#0f172a" }}>構造的な死角:</strong> ホームページを多額の費用でリニューアルしても、AIが解釈できる確定データがなければ推薦対象になりません。
            </div>
          </div>

          {/* 現実 03 */}
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
                現実 03
              </span>
              <strong style={{ fontSize: "0.98rem", color: "#0f172a", lineHeight: 1.4 }}>
                対策を放置すると、大手やライバルへの送客が固定化する
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
              AIは「客観的な根拠が確認できる安全な事業者」を優先して推薦します。自社の強みや専門性がデータ化されていない場合、AIはすでに情報の揃っている大手チェーンや競合他社を顧客に案内し続けます。
            </p>
            <div style={{ marginTop: "auto", background: "#f8fafc", border: "1px solid #e2e8f0", borderLeft: "3px solid #0f172a", padding: "10px 14px", borderRadius: "0 6px 6px 0", fontSize: "0.78rem", color: "#334155", lineHeight: 1.55 }}>
              <strong style={{ color: "#0f172a" }}>手遅れになる前に:</strong> AIの回答傾向（「この地域・分野なら○○社」）が固定化する前に、AIが参照できる専用データを配備・維持することが不可欠です。
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
