import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { ScanForm } from "@/components/scan-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { HeroChatDiagnosticCard, ProductOutputPreview, ProductProcessVisual, WatchTrendVisual } from "@/components/product-visuals";
import { VerifiedCompaniesGallery } from "@/components/verified-companies-gallery";
import { GoogleDeclineProblemSection } from "@/components/google-decline-problem-section";
import { ZeroEffortPromiseSection } from "@/components/zero-effort-promise-section";
import { FREE_PANEL_SIZE } from "@/lib/prompt-panels";
import { WATCH_MONTHLY_PRICE_LABEL } from "@/lib/pricing";

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
              <p className="overline">生成AI向け公開情報の確認・整理</p>
              <h1>
                利用者がAIに相談した時、<br />
                <em>あなたの会社の情報は、比較できる形になっていますか。</em>
              </h1>
              <p className="landing-hero-lead">
                今のホームページの改修も、新たな開設も不要。<br />
                URLまたは社名を入力すると、公開情報とAI回答の現状を確認できます。<br />
                公開プロフィールは、内容を確認してから公開できます。
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
                URL・社名だけで開始
              </span>
              <span className="trust-sep" aria-hidden="true">•</span>
              <span className="trust-item">
                <svg className="trust-check" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8.5L6.5 12L13 4" />
                </svg>
                HPの改修は不要
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
              <span className="ai-clean-caption">測定対象のAI:</span>
              <span className="ai-clean-names">ChatGPT • Google Gemini • Perplexity</span>
            </div>

            {/* 診断見本リンク */}
            <div className="hero-sample-link-wrapper">
              <Link className="hero-sample-link" href="/result?sample=1">
                診断レポートの設計見本を見る <span aria-hidden="true">→</span>
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
          <span className="pill-badge">回答の表示例</span>
          <h2>利用者がAIに相談した時、<br />回答はどう変わるのか？</h2>
          <p>
            ChatGPTやGeminiなど主要AIで、利用者が相談した場合の回答例を比較。<br />
            AIの回答は質問・提供元・時点で変わります。Rovanは同じ条件で回答を測定し、公開情報を参照元付きで整理します。推薦・順位・売上の改善は保証しません。
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
      {/* 3. このサービスで手に入るもの（社名を入れるだけで届く「2大成果物」） */}
      {/* ================================================================= */}
      <section className="landing-deliverables-section shell" style={{ marginTop: "48px", marginBottom: "48px" }}>
        <div className="section-head-center" style={{ marginBottom: "32px" }}>
          <span className="pill-badge">確認できる2つのもの</span>
          <h2>URLまたは社名を入力すると、<br />現状と公開情報の整理案を確認できます</h2>
          <p>
            今のホームページの改修も、専門知識も一切不要。<br />
            URLまたは社名を入れるだけで、「自社の現状がわかる診断レポート」と「公開情報の整理案」を確認できます。
          </p>
        </div>

        {/* 左右2大成果物プレミアムショーケース */}
        <div style={{ marginBottom: "32px" }}>
          <ProductOutputPreview />
        </div>

        {/* 法的免責・客観性保証の注記 */}
        <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#64748b", margin: "0 auto", maxWidth: "780px", lineHeight: 1.6 }}>
          ※ 各AIの回答は質問・参照元・モデルの更新で変わります。Rovanは参照元付きの公開情報を整理し、同じ条件で回答を測定しますが、特定の回答・推薦・順位・成果を保証しません。
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
            <span className="pill-badge">週次のAI回答測定</span>
            <h2>AIの回答状況を、<br />同じ条件で毎週確認。</h2>
            <p>AIの回答は質問・参照元・モデルの更新で変わります。Rovanは同じ質問パネルで回答の変化と参照元を確認し、公開情報を見直す候補を整理します。</p>
            <ul className="watch-feature-list">
              <li><strong>毎週の再測定</strong>：同じ質問パネルでAI回答の変化を確認</li>
              <li><strong>比較候補の変化</strong>：候補の入れ替わりや参照元の差分を記録</li>
              <li><strong>公開は確認後</strong>：公開情報の変更は承認した内容だけを反映</li>
            </ul>
            <Link className="text-button" href="/watch?sample=1">追跡レポートの見本を見る <span aria-hidden="true">→</span></Link>
          </div>
        </div>

        {/* 明朗価格アンカーカード */}
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
            <span className="pill-badge">料金</span>
            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", margin: "0 0 10px", lineHeight: 1.35 }}>
              必要な範囲だけ選べる、<br />明朗な料金体系
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary, #475569)", margin: 0, lineHeight: 1.75 }}>
              まずは無料診断で現状を確かめ、必要な場合だけ週次の再測定を申し込めます。AIの回答や売上の改善は保証しません。
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
                現状把握と公開情報整理
              </span>
              <h4 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", margin: "0 0 12px" }}>
                無料AI回答 診断レポート
              </h4>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "16px" }}>
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary, #0f172a)" }}>0円</span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted, #64748b)" }}>（カード登録不要・自動課金なし）</span>
              </div>
              <ul style={{ margin: "0 0 24px", paddingLeft: "18px", fontSize: "0.84rem", color: "var(--text-secondary, #475569)", lineHeight: 1.8, flex: 1 }}>
                <li>固定した{FREE_PANEL_SIZE}問の質問パネルでの診断レポート</li>
                <li>参照元付きの公開情報整理案（自動下書き）</li>
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
                <span>まずは無料で診断してみる</span>
                <ArrowIcon />
              </a>
            </div>

            {/* プラン 2：週次測定 */}
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
                継続利用向け
              </span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted, #64748b)", fontFamily: "var(--font-mono, monospace)", marginBottom: "6px" }}>
                継続測定・差分確認
              </span>
              <h4 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", margin: "0 0 12px" }}>
                週次測定プラン
              </h4>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "16px" }}>
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary, #0f172a)" }}>{WATCH_MONTHLY_PRICE_LABEL}</span>
              </div>
              <ul style={{ margin: "0 0 24px", paddingLeft: "18px", fontSize: "0.84rem", color: "var(--text-secondary, #475569)", lineHeight: 1.8, flex: 1 }}>
                <li>同じ測定パネルでAI回答を毎週再チェック</li>
                <li>比較候補や参照元の変化を確認</li>
                <li>承認した公開プロフィールの維持</li>
                <li>月単位で利用でき、管理画面から解約手続きが可能</li>
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
            <span className="pill-badge">URL・社名だけで開始</span>
            <h2>AI回答で、自社が候補に含まれていますか？<br />まずは無料診断で現状をご確認ください。</h2>
          <ScanForm compact />
          <div className="hero-trust-badges" style={{ justifyContent: "center", marginTop: "18px" }} aria-label="サービスの特長">
            <div className="trust-badge">
              <svg className="badge-check" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8.5L6.5 12L13 4" />
              </svg>
              <span>URLまたは社名を入力</span>
            </div>
            <div className="trust-badge">
              <svg className="badge-check" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8.5L6.5 12L13 4" />
              </svg>
              <span>HPの改修は不要</span>
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
