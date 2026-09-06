import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { ScanForm } from "@/components/scan-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { HeroChatDiagnosticCard, ProductOutputPreview, ProductProcessVisual, WatchTrendVisual } from "@/components/product-visuals";
import { VerifiedCompaniesGallery } from "@/components/verified-companies-gallery";
import { GoogleDeclineProblemSection } from "@/components/google-decline-problem-section";
import { ZeroEffortPromiseSection } from "@/components/zero-effort-promise-section";

export default function HomePage() {
  return (
    <main className="landing-page">
      <SiteHeader />

      {/* ================================================================= */}
      {/* 1. ファーストビュー：スクロール不要・1画面完結型シングルフォーカスヒーロー */}
      {/* ================================================================= */}
      <section className="landing-hero">
        <div className="shell landing-hero-inner">
          <div className="landing-hero-single">
            <div className="landing-hero-head-block">
              <p className="overline">ChatGPT・生成AI おすすめ獲得システム</p>
              <h1>
                お客さんがChatGPTに「おすすめ」を聞いた時、<br />
                <em>あなたの会社はスルーされ、大手が紹介されています。</em>
              </h1>
              <p className="landing-hero-lead">
                今のホームページの改修も、新たな開設も不要。<br />
                社名を入れるだけで、AI専用の推薦データを即日配備します。
              </p>
            </div>

            {/* 入力フォーム */}
            <div className="landing-hero-form-box" id="scan">
              <ScanForm hideExtraToggle />
            </div>

            {/* 3大安心マイクロコピー（丸ボタンを排した知的なインライン表示） */}
            <div className="hero-trust-row" aria-label="サービスの特長">
              <span className="trust-item">
                <svg className="trust-check" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8.5L6.5 12L13 4" />
                </svg>
                社名入力で10秒
              </span>
              <span className="trust-sep" aria-hidden="true">•</span>
              <span className="trust-item">
                <svg className="trust-check" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8.5L6.5 12L13 4" />
                </svg>
                HPの改修・開設も不要
              </span>
              <span className="trust-sep" aria-hidden="true">•</span>
              <span className="trust-item">
                <svg className="trust-check" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8.5L6.5 12L13 4" />
                </svg>
                完全無料（自動課金なし）
              </span>
            </div>

            {/* 調査対象AI（モデル番号なし・主要サービス名を堂々提示） */}
            <div className="hero-ai-targets-clean" aria-label="調査対象AI">
              <span className="ai-clean-caption">調査対象AI:</span>
              <span className="ai-clean-names">ChatGPT • Google Gemini • Perplexity • Claude • Copilot</span>
            </div>

            {/* 診断見本リンク */}
            <div className="hero-sample-link-wrapper">
              <Link className="hero-sample-link" href="/result?sample=1">
                実際の診断レポート見本を見る <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 2. AI回答シミュレーション：一目でわかるビフォーアフター比較 */}
      {/* ================================================================= */}
      <section className="landing-simulation-section shell" style={{ paddingTop: "64px", paddingBottom: "64px" }}>
        <div className="section-head-center" style={{ marginBottom: "32px" }}>
          <span className="pill-badge">導入前後の回答比較</span>
          <h2>お客さんがAIに相談した時、<br />回答はどう変わるのか？</h2>
          <p>
            ChatGPTやGeminiなど主要AIで、お客さんが相談した時の実際の回答を比較。<br />
            AI向けデータがない状態では知名度の高い大手が優先されますが、公式データを配備することで、御社の強みに合致した有力候補としてAIに認識・提案されるようになります。
          </p>
        </div>
        <div style={{ maxWidth: "880px", margin: "0 auto" }}>
          <HeroChatDiagnosticCard />
        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. なぜ今、こんなことが起きているのか？（理由が1秒でわかる3大危機） */}
      {/* ================================================================= */}
      <GoogleDeclineProblemSection />

      {/* ================================================================= */}
      {/* 3. このサービスで手に入るもの（社名を入れるだけで届く「2つの武器」） */}
      {/* ================================================================= */}
      <section className="landing-deliverables-section shell" style={{ marginTop: "48px", marginBottom: "48px" }}>
        <div className="section-head-center" style={{ marginBottom: "32px" }}>
          <span className="pill-badge">手に入る2つの確定成果物</span>
          <h2>社名を入力するだけで、<br />手元に届く「2つの武器」</h2>
          <p>
            今のホームページの改修も、専門知識も一切不要。<br />
            社名を入れるだけで、「自社の現状を暴く診断レポート」と「大手を逆転するAI公式データ」がその場で手に入ります。
          </p>
        </div>

        {/* 左右2大成果物プレミアムショーケース */}
        <div style={{ marginBottom: "32px" }}>
          <ProductOutputPreview />
        </div>

        {/* 法的免責・客観性保証の注記 */}
        <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#64748b", margin: "0 auto", maxWidth: "780px", lineHeight: 1.6 }}>
          ※ 各AIによる推薦・回答内容は利用者の質問や外部各社のアルゴリズムにより動的に生成されます。本システムはAI探索ロボットが御社を正しく選定できる客観的データ基盤を構築するものであり、特定の回答順位や成果を保証するものではありません。
        </p>
      </section>

      {/* ================================================================= */}
      {/* 4. ウチの業種だとどうなる？（主要業種シミュレーション） */}
      {/* ================================================================= */}
      <VerifiedCompaniesGallery />

      {/* ================================================================= */}
      {/* 5. なぜ社長は何もしなくていいのか？（完全放置の理由と4ステップ） */}
      {/* ================================================================= */}
      <section className="landing-architecture-section shell" style={{ marginTop: "48px", marginBottom: "48px" }}>
        <ZeroEffortPromiseSection />
        <div style={{ marginTop: "24px" }}>
          <ProductProcessVisual />
        </div>
      </section>

      {/* ================================================================= */}
      {/* 6. 継続的な安心と明朗価格（「これなら払うわ」の安心アンカー） */}
      {/* ================================================================= */}
      <section className="landing-watch-pricing-section shell" style={{ marginTop: "48px", marginBottom: "48px" }}>
        {/* 毎週の見守りビジュアル */}
        <div className="landing-watch-grid" style={{ marginBottom: "36px" }}>
          <WatchTrendVisual />
          <div className="section-intro">
            <span className="pill-badge">専属のAI見守り体制</span>
            <h2>AIの回答状況を、<br />毎週自動で追跡・チェック。</h2>
            <p>ChatGPTなどのAI回答は日々変わります。あなたの会社がお客さんにおすすめされ続けているか、ライバルが急に割り込んできていないかを、毎週月曜に自動で巡回チェックします。</p>
            <ul className="watch-feature-list">
              <li><strong>毎週月曜に自動チェック</strong>：主要AIの回答の変化を毎週自動で巡回</li>
              <li><strong>ライバル急浮上アラート</strong>：競合が急にお客を奪い始めたら即座にお知らせ</li>
              <li><strong>安心の完全放置</strong>：社長の手間ゼロで、おすすめデータを常に最新維持</li>
            </ul>
            <Link className="text-button" href="/watch?sample=1">追跡レポートの見本を見る <span aria-hidden="true">→</span></Link>
          </div>
        </div>

        {/* 明朗価格アンカーカード（専属営業マン代わりの圧倒的コストパフォーマンス） */}
        <div
          style={{
            background: "var(--bg-base, #ffffff)",
            border: "1px solid var(--border-subtle, #e2e8f0)",
            borderRadius: "var(--radius-card, 8px)",
            padding: "clamp(24px, 4vw, 40px)",
            boxShadow: "0 2px 12px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 32px" }}>
            <span className="pill-badge">明朗・適正な価格設定</span>
            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", margin: "0 0 10px", lineHeight: 1.35 }}>
              月30万円の営業マンを雇う代わりに。<br />いつでも安心できる明朗な料金体系
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary, #475569)", margin: 0, lineHeight: 1.75 }}>
              SEO業者への高額な依頼や広告費の垂れ流しはもう不要です。まずは無料診断で現状を確かめ、必要な場合だけ週次の自動見守りを開始できます。
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
              maxWidth: "840px",
              margin: "0 auto",
            }}
          >
            {/* プラン 1：無料診断 */}
            <div
              style={{
                background: "var(--bg-surface, #f8fafc)",
                border: "1px solid var(--border-subtle, #e2e8f0)",
                borderRadius: "var(--radius-card, 8px)",
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted, #64748b)", fontFamily: "var(--font-mono, monospace)", marginBottom: "6px" }}>
                現状把握とおすすめデータ発行
              </span>
              <h4 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", margin: "0 0 12px" }}>
                無料AI推薦 診断レポート
              </h4>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "16px" }}>
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary, #0f172a)" }}>0円</span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted, #64748b)" }}>（即日発行・完全無料）</span>
              </div>
              <ul style={{ margin: "0 0 24px", paddingLeft: "18px", fontSize: "0.84rem", color: "var(--text-secondary, #475569)", lineHeight: 1.8, flex: 1 }}>
                <li>買い手がAIにする12の質問での診断レポート</li>
                <li>自社専用のAI公式推薦データ（自動下書き）</li>
                <li>ホームページの改修・新たな開設も不要</li>
                <li>クレジットカード登録不要・自動課金なし</li>
              </ul>
              <a
                href="#scan"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: "var(--color-brand, #0f172a)",
                  color: "#ffffff",
                  fontSize: "0.86rem",
                  fontWeight: 700,
                  minHeight: "48px",
                  padding: "0 20px",
                  borderRadius: "var(--radius-btn, 6px)",
                  textDecoration: "none",
                  transition: "background 0.15s ease",
                }}
              >
                <span>まずは無料で診断してみる（10秒）</span>
                <ArrowIcon />
              </a>
            </div>

            {/* プラン 2：毎週の自動見守り */}
            <div
              style={{
                background: "var(--bg-base, #ffffff)",
                border: "2px solid var(--color-brand, #0f172a)",
                borderRadius: "var(--radius-card, 8px)",
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                boxShadow: "0 4px 16px rgba(15, 23, 42, 0.06)",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "-11px",
                  right: "20px",
                  background: "var(--color-brand, #0f172a)",
                  color: "#ffffff",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  padding: "2px 10px",
                  borderRadius: "var(--radius-badge, 4px)",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                おすすめ
              </span>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted, #64748b)", fontFamily: "var(--font-mono, monospace)", marginBottom: "6px" }}>
                継続運用・順位監視
              </span>
              <h4 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", margin: "0 0 12px" }}>
                毎週の自動見守りプラン
              </h4>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "16px" }}>
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary, #0f172a)" }}>月額 9,800円</span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted, #64748b)" }}>（1日あたり約320円）</span>
              </div>
              <ul style={{ margin: "0 0 24px", paddingLeft: "18px", fontSize: "0.84rem", color: "var(--text-secondary, #475569)", lineHeight: 1.8, flex: 1 }}>
                <li>毎週月曜にAIの推薦状況を自動で再チェック</li>
                <li>競合が急に浮上した場合の早期アラート</li>
                <li>AI公式推薦データの常時ホスティング・自動同期</li>
                <li>いつでもワンクリックで解約可能（契約縛りなし）</li>
              </ul>
              <Link
                href="/pricing"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: "var(--bg-surface, #f8fafc)",
                  border: "1px solid var(--border-subtle, #cbd5e1)",
                  color: "var(--text-primary, #0f172a)",
                  fontSize: "0.86rem",
                  fontWeight: 700,
                  minHeight: "48px",
                  padding: "0 20px",
                  borderRadius: "var(--radius-btn, 6px)",
                  textDecoration: "none",
                }}
              >
                <span>料金プランの詳細を見る</span>
                <ArrowIcon />
              </Link>
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: "0.74rem", color: "#94a3b8", margin: "20px 0 0" }}>
            ※ クレジットカード登録は不要です。無料診断のあとに自動で課金されることは一切ありません。継続的な見守りをご希望の方のみお申し込みいただけます。
          </p>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 7. 最終アクション：迷わず押せるワンアクション */}
      {/* ================================================================= */}
      <section className="landing-final-cta">
        <div className="shell">
          <span className="pill-badge">所要10秒・自社サイト改修ゼロ</span>
          <h2>御社はAIから「おすすめ」されていますか？<br />まずは無料診断で、自社の現状をご確認ください。</h2>
          <ScanForm compact />
          <div className="hero-trust-badges" style={{ justifyContent: "center", marginTop: "18px" }} aria-label="サービスの特長">
            <div className="trust-badge">
              <svg className="badge-check" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8.5L6.5 12L13 4" />
              </svg>
              <span>社名を入れるだけ（10秒）</span>
            </div>
            <div className="trust-badge">
              <svg className="badge-check" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8.5L6.5 12L13 4" />
              </svg>
              <span>HPの改修・開設も不要</span>
            </div>
            <div className="trust-badge">
              <svg className="badge-check" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8.5L6.5 12L13 4" />
              </svg>
              <span>完全無料・自動課金なし</span>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}


