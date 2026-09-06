"use client";

interface ExecutiveDiagnosticSummaryProps {
  brandName: string;
  rank?: number;
  topCompetitor?: string;
  lostCount?: number;
  totalCount?: number;
}

export function ExecutiveDiagnosticSummary({
  brandName,
  rank = 93,
  topCompetitor = "全国展開の大手買取企業",
  lostCount = 12,
  totalCount = 12,
}: ExecutiveDiagnosticSummaryProps) {
  return (
    <section
      id="executive-summary"
      className="executive-summary-section shell"
      aria-label="AI診断要約と提供価値"
      style={{
        marginTop: "28px",
        marginBottom: "36px",
      }}
    >
      <div
        className="shadow-ambient-md"
        style={{
          background: "var(--bg-base, #ffffff)",
          borderRadius: "14px",
          color: "var(--text-primary, #0f172a)",
          padding: "clamp(24px, 3.5vw, 36px)",
          border: "1px solid var(--border-subtle, #e2e8f0)",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
        }}
      >
        {/* ヘッダーバッジ */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                background: "var(--bg-surface, #f1f5f9)",
                color: "var(--navy, #0f172a)",
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "0.72rem",
                fontWeight: 800,
                padding: "3px 10px",
                borderRadius: "4px",
                border: "1px solid var(--border-subtle, #e2e8f0)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Executive Summary / 経営要約
            </span>
            <span style={{ color: "var(--text-muted, #64748b)", fontSize: "0.82rem", fontWeight: 600 }}>
              AI推薦メカニズム解説 ＆ 施工価値
            </span>
          </div>
          <div
            style={{
              fontSize: "0.76rem",
              color: "var(--text-secondary, #475569)",
              background: "var(--bg-surface, #f8fafc)",
              border: "1px solid var(--border-subtle, #e2e8f0)",
              padding: "4px 12px",
              borderRadius: "6px",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            TARGET: <strong style={{ color: "var(--navy, #0f172a)" }}>{brandName}</strong>
          </div>
        </div>

        {/* メインヘッドライン */}
        <div style={{ marginBottom: "28px" }}>
          <h2
            style={{
              fontSize: "clamp(1.25rem, 2.4vw, 1.65rem)",
              fontWeight: 800,
              lineHeight: 1.35,
              letterSpacing: "-0.025em",
              margin: "0 0 10px",
              color: "var(--navy, #0f172a)",
            }}
          >
            なぜAIは御社を「100位中{rank}位」と判定したのか？<br />
            そして、本システムが「具体的にどう解決したのか」。
          </h2>
          <p style={{ margin: 0, fontSize: "0.92rem", color: "var(--text-secondary, #475569)", lineHeight: 1.75 }}>
            御社の実力や接客力が劣っているわけではありません。原因は<strong>「AI学習データの圧倒的な知名度偏向」</strong>と<strong>「AI探索ロボット専用台帳の欠如」</strong>という機械的な構造問題でした。
          </p>
        </div>

        {/* 根本原因の2大ボトルネック（文系比喩で直感解説） */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {/* 原因 01 */}
          <div
            className="shadow-ambient-sm"
            style={{
              background: "var(--bg-surface, #f8fafc)",
              border: "1px solid var(--border-subtle, #e2e8f0)",
              borderRadius: "10px",
              padding: "22px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.9rem",
                  fontWeight: 800,
                  color: "var(--orange, #ea580c)",
                  letterSpacing: "0.04em",
                }}
              >
                01
              </span>
              <strong style={{ fontSize: "0.98rem", color: "var(--navy, #0f172a)", lineHeight: 1.4 }}>
                データ量と知名度の圧倒的な偏り<br />
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted, #64748b)", fontWeight: 500 }}>（図書館の本棚の占有率の差）</span>
              </strong>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary, #475569)", lineHeight: 1.7, margin: 0 }}>
              AIの事前学習データにおいて、東証上場企業や全国大手チェーン（{topCompetitor}等）は、ネット上に<strong>数十万件のニュース記事やプレスリリース</strong>が存在します。<br />
              AIは知識の浅い計算機であるため、<strong>「本棚に大量の本がある会社＝信頼できる大手」と機械的に判断</strong>し、地域で誠実な実力を持つ中小企業を素通りして大手を自動推薦してしまいます。
            </p>
          </div>

          {/* 原因 02 */}
          <div
            className="shadow-ambient-sm"
            style={{
              background: "var(--bg-surface, #f8fafc)",
              border: "1px solid var(--border-subtle, #e2e8f0)",
              borderRadius: "10px",
              padding: "22px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.9rem",
                  fontWeight: 800,
                  color: "var(--orange, #ea580c)",
                  letterSpacing: "0.04em",
                }}
              >
                02
              </span>
              <strong style={{ fontSize: "0.98rem", color: "var(--navy, #0f172a)", lineHeight: 1.4 }}>
                AI探索ロボット専用台帳の欠如<br />
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted, #64748b)", fontWeight: 500 }}>（「写真・デザイン」 vs 「機械専用データ」）</span>
              </strong>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary, #475569)", lineHeight: 1.7, margin: 0 }}>
              自社サイトは「人間がスマホ画面で見るためのデザインや画像」で作られています。しかし、AI探索ロボット（GPTBot等）が必要とするのは画像ではなく<strong>「1秒で読める機械専用の規格化データ（JSON-LD）」</strong>です。<br />
              「大手が断る個別案件への対応条件」や「専門資格・実績」が機械向けに公開されていなかったため、AIは<strong>「誤案内を避けるための安全策」として推薦順位を{rank}位まで下げていた</strong>のです。
            </p>
          </div>
        </div>

        {/* 具体的にどう解決したか（施工アクション：完全自動） */}
        <div
          className="shadow-ambient-sm"
          style={{
            background: "var(--bg-base, #ffffff)",
            border: "1.5px solid var(--navy, #0f172a)",
            borderRadius: "10px",
            padding: "24px 26px",
            marginBottom: "26px",
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  background: "var(--navy, #0f172a)",
                  color: "#ffffff",
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  padding: "3px 8px",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                }}
              >
                Action
              </span>
              <strong style={{ fontSize: "1.05rem", color: "var(--navy, #0f172a)", letterSpacing: "-0.01em" }}>
                社長の作業は「社名を入力しただけ」。あとは自走システムで公式窓口が稼働
              </strong>
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary, #475569)", fontFamily: "var(--font-mono, monospace)", background: "var(--bg-surface, #f1f5f9)", border: "1px solid var(--border-subtle, #e2e8f0)", padding: "3px 10px", borderRadius: "4px" }}>
              作業工数: 0分（改修工事ゼロ）
            </span>
          </div>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary, #475569)", lineHeight: 1.75, margin: "0 0 16px" }}>
            ITの専門知識も、既存ホームページの改修工事も一切不要です。<br />
            Rovanが自社の公開情報と公的データベースを解析し、ChatGPTやPerplexity等のAI探索ロボットが1秒で読める<strong>「AI公式確定仕様台帳（国際規格JSON-LD・全データ出展証跡完備）」を自社サイトの外側に全自動配備</strong>しました。<br />
            「大手が対応しにくい親身な個別対応」や「地域密着の強み」が、主要AIのナレッジベースに直接常駐しています。
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", fontSize: "0.78rem" }}>
            <span style={{ background: "var(--bg-surface, #f8fafc)", border: "1px solid var(--border-subtle, #e2e8f0)", padding: "4px 10px", borderRadius: "6px", color: "var(--text-primary, #1e293b)", fontWeight: 600 }}>
              ✓ ユーザー作業: URL・社名を入力するだけ（自走運用）
            </span>
            <span style={{ background: "var(--bg-surface, #f8fafc)", border: "1px solid var(--border-subtle, #e2e8f0)", padding: "4px 10px", borderRadius: "6px", color: "var(--text-primary, #1e293b)", fontWeight: 600 }}>
              ✓ 国際標準構造化データ（Schema.org）自動常駐
            </span>
            <span style={{ background: "var(--bg-surface, #f8fafc)", border: "1px solid var(--border-subtle, #e2e8f0)", padding: "4px 10px", borderRadius: "6px", color: "var(--text-primary, #1e293b)", fontWeight: 600 }}>
              ✓ 確定事実・公的実測データの出展証跡を自動付与
            </span>
            <span style={{ background: "var(--bg-surface, #f8fafc)", border: "1px solid var(--border-subtle, #e2e8f0)", padding: "4px 10px", borderRadius: "6px", color: "var(--text-primary, #1e293b)", fontWeight: 600 }}>
              ✓ 毎週のAI回答変動監視・定期保守も全自動
            </span>
          </div>
        </div>

        {/* 提供価値のBefore / After 対比表 */}
        <div id="executive-summary-comparison">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <strong style={{ fontSize: "0.95rem", color: "var(--navy, #0f172a)" }}>
              提供価値の対比：Before（導入前） vs After（導入後）
            </strong>
            <span style={{ fontSize: "0.74rem", color: "var(--text-muted, #64748b)", fontFamily: "var(--font-mono, monospace)" }}>
              BEHAVIOR TRANSFORMATION
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "14px",
            }}
          >
            {/* Before */}
            <div
              className="shadow-ambient-sm"
              style={{
                background: "#fafafa",
                border: "1px solid var(--border-subtle, #e2e8f0)",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ color: "#dc2626", fontWeight: 800, fontSize: "0.78rem", fontFamily: "var(--font-mono, monospace)", background: "#fef2f2", border: "1px solid #fee2e2", padding: "2px 8px", borderRadius: "4px" }}>[ BEFORE / 導入前 ]</span>
                <span style={{ color: "var(--text-muted, #64748b)", fontSize: "0.76rem" }}>（AI推薦順位: {rank}位）</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.84rem", color: "var(--text-secondary, #475569)", lineHeight: 1.7 }}>
                <li>AIは「本棚にデータがない会社」と判定し、知名度だけで大手を推奨</li>
                <li>「確定条件」が分からないため、AIが誤案内を恐れて自社を除外</li>
                <li>対策方法が分からず、ブログ更新やサイト改修に手を取られる（または放置）</li>
                <li><strong style={{ color: "#991b1b" }}>結果: 御社を必要とする地域・専門の見込み客が、AI経由で大手に丸ごと流出</strong></li>
              </ul>
            </div>

            {/* After */}
            <div
              className="shadow-ambient-sm"
              style={{
                background: "var(--bg-base, #ffffff)",
                border: "1px solid #86efac",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(34, 197, 94, 0.08)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ color: "#16a34a", fontWeight: 800, fontSize: "0.78rem", fontFamily: "var(--font-mono, monospace)", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "2px 8px", borderRadius: "4px" }}>[ AFTER / 導入後 ]</span>
                <span style={{ color: "var(--text-muted, #64748b)", fontSize: "0.76rem" }}>（AI公式推薦データ常駐配備）</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.84rem", color: "var(--text-primary, #1e293b)", lineHeight: 1.7 }}>
                <li>AI探索ロボットが「大手が対応しにくい親身な個別対応の第一候補」として認識</li>
                <li>出展つきの確定台帳により、AIが自信を持って御社の電話番号や相談窓口を提示</li>
                <li><strong>社長は完全放置で成立</strong>: 自社サイトの改修も更新もゼロ。本業に100%集中可能</li>
                <li><strong style={{ color: "#166534" }}>結果: 「大手の画一対応では不安」な質の高い見込み客が直接御社へ流入</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 公式台帳への直通導線 */}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "18px",
            borderTop: "1px solid var(--border-subtle, #e2e8f0)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "14px",
          }}
        >
          <div style={{ fontSize: "0.84rem", color: "var(--text-secondary, #475569)" }}>
            配備された確定仕様台帳は、ステップ2の<strong>「AI公式推薦データ」</strong>からいつでも実物をご確認いただけます。
          </div>
          <a
            href="#step-2"
            style={{
              background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
              color: "#ffffff",
              fontSize: "0.82rem",
              fontWeight: 700,
              padding: "9px 18px",
              borderRadius: "6px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              boxShadow: "0 2px 4px rgba(15, 23, 42, 0.16)",
              transition: "all 0.15s ease",
            }}
          >
            ステップ2のAI公式推薦データを見る <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
