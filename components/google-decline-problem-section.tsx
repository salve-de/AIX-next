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
                「検索して比較する」から「AIに選んでもらう」へ
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#475569", lineHeight: 1.6, margin: 0 }}>
              検索順位を争う時代から、AIが最適な候補を直接選定して提案する時代へシフトしています。顧客の最初の相談窓口が、検索エンジンからChatGPTなどの対話型AIへ移行しています。
            </p>
            <div style={{ marginTop: "auto", background: "#fef2f2", border: "1px solid #fecaca", padding: "10px 12px", borderRadius: "6px", fontSize: "0.76rem", color: "#991b1b", lineHeight: 1.5 }}>
              <strong>見落としがちな盲点:</strong> 自社サイトのアクセス解析だけを見ていても、AIの推薦段階で候補から漏れて奪われた顧客には気付けません。
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
                人間向けに飾ったホームページは、AIには読まれない
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#475569", lineHeight: 1.6, margin: 0 }}>
              写真やイメージ中心の美しいデザインも、AIにとっては中身の読み取れない画像にすぎません。AIが推薦の根拠とするのは、機械が客観的に検証できる確定仕様データ（取扱分野・実績・対応条件）です。
            </p>
            <div style={{ marginTop: "auto", background: "#fef2f2", border: "1px solid #fecaca", padding: "10px 12px", borderRadius: "6px", fontSize: "0.76rem", color: "#991b1b", lineHeight: 1.5 }}>
              <strong>構造的な課題:</strong> ホームページをいくら多額の費用でリニューアルしても、AIが解釈できる構造化データがなければ推薦対象になりません。
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
                対策を怠ると、ライバルや大手チェーンへ自動で送客される
              </strong>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#475569", lineHeight: 1.6, margin: 0 }}>
              AIは「客観的な根拠が明確な事業者」を優先して推薦します。御社の強みや専門性がデータ化されていない場合、AIはすでに情報の揃っている競合他社を顧客に提案し続けます。
            </p>
            <div style={{ marginTop: "auto", background: "#fef2f2", border: "1px solid #fecaca", padding: "10px 12px", borderRadius: "6px", fontSize: "0.76rem", color: "#991b1b", lineHeight: 1.5 }}>
              <strong>必要な対策:</strong> AIが自社を正しく把握しているかを定期的に確認し、AIが参照できる専用データを配備・維持することが不可欠です。
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
