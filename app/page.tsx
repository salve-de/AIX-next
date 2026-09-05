import Link from "next/link";
import { ScanForm } from "@/components/scan-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ChatGptComparisonVisual, HeroChatDiagnosticCard, ProductOutputPreview, ProductProcessVisual, WatchTrendVisual } from "@/components/product-visuals";
import { VerifiedCompaniesGallery } from "@/components/verified-companies-gallery";
import { GoogleDeclineProblemSection } from "@/components/google-decline-problem-section";
import { ZeroEffortPromiseSection } from "@/components/zero-effort-promise-section";

export default function HomePage() {
  return (
    <main className="landing-page">
      <SiteHeader />

      {/* ================================================================= */}
      {/* 1. ファーストビュー：1行の事実 ＋ 迷いのない診断フォーム ＋ リアル見本 */}
      {/* ================================================================= */}
      <section className="landing-hero">
        <div className="shell landing-hero-inner">
          <div className="landing-hero-grid">
            
            {/* 左カラム：問題提起・入力フォーム・安心シグナル */}
            <div className="landing-hero-col-left">
              <div className="landing-hero-head-block">
                <p className="overline">ChatGPT・生成AI 推薦獲得システム</p>
                <h1>
                  ChatGPTは、あなたの会社をスルーして<br />
                  <em>ライバルを「おすすめ」しています。</em>
                </h1>
                <p className="landing-hero-lead">
                  自社サイト改修ゼロ・完全放置。名前やアカウントを入力するだけで、<br />
                  AIがあなたや御社を優先推薦する公式台帳を即日配備します。
                </p>
              </div>

              {/* 入力フォーム */}
              <div className="landing-hero-form-box" id="scan">
                <ScanForm />
              </div>

              {/* 3大安心マイクロバッジ（Stripe/Apple水準の重厚な信頼シグナル） */}
              <div className="hero-trust-badges" aria-label="サービスの特長">
                <div className="trust-badge">
                  <svg className="badge-check" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 8.5L6.5 12L13 4" />
                  </svg>
                  <span>所要10秒（名前・URLのみ）</span>
                </div>
                <div className="trust-badge">
                  <svg className="badge-check" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 8.5L6.5 12L13 4" />
                  </svg>
                  <span>サイト改修ゼロ</span>
                </div>
                <div className="trust-badge">
                  <svg className="badge-check" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 8.5L6.5 12L13 4" />
                  </svg>
                  <span>完全無料・自動課金なし</span>
                </div>
              </div>

              {/* 診断見本リンク */}
              <div className="hero-sample-link-wrapper">
                <Link className="hero-sample-link" href="/result?sample=1">
                  実際の診断カルテを見る <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* 右カラム：0.1秒で伝わるChatGPTリアル比較＆診断プレビュー */}
            <div className="landing-hero-col-right">
              <HeroChatDiagnosticCard />
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 2. 市場の変化と3大危機：Google検索の衰退 ➔ AI直接相談への大移動 */}
      {/* ================================================================= */}
      <section className="landing-shift-section shell" style={{ marginTop: "48px", marginBottom: "48px" }}>
        <div className="section-head-center" style={{ marginBottom: "28px" }}>
          <span className="pill-badge">なぜ今、対策が必要なのか</span>
          <h2>「Google検索」が終わり、顧客は「AIへの直接相談」へ移行しています</h2>
          <p>AI専用の確定データを持たない企業は、AIの回答候補から素通りされてしまいます。<br />自社サイト改修ゼロで公式台帳を配備し、AI新時代において自社が正しく認知・推薦されやすい環境を整えましょう。</p>
        </div>
        
        {/* Google vs ChatGPT 対比ビジュアル */}
        <ChatGptComparisonVisual />

        {/* 中小企業が直面する3大危機（広告汚染・SEO無力化・客の無言流出） */}
        <div style={{ marginTop: "24px" }}>
          <GoogleDeclineProblemSection />
        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. 完全放置の約束：なぜURLだけで成立するのか？（全自動アーキテクチャ） */}
      {/* ================================================================= */}
      <section className="landing-architecture-section shell" style={{ marginTop: "48px", marginBottom: "48px" }}>
        <ZeroEffortPromiseSection />
        <div style={{ marginTop: "24px" }}>
          <ProductProcessVisual />
        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. 無料診断で手に入る【2大確定成果物】 */}
      {/* ================================================================= */}
      <section className="landing-deliverables-section shell" style={{ marginTop: "48px", marginBottom: "48px" }}>
        <div className="section-head-center" style={{ marginBottom: "32px" }}>
          <span className="pill-badge">無料診断で手に入るもの</span>
          <h2>社名を入れるだけ（所要10秒）。<br />あなたの手元に届く「2つの確定納品物」</h2>
          <p>自社ホームページの改修は一切不要。AIが御社をスルーしている原因を突き止める「診断カルテ」と、<br />ChatGPTが明日から御社を優先推薦するための「AI公式確定台帳」が即日手に入ります。</p>
        </div>

        {/* 診断で手に入る2大確定成果物プレビュー */}
        <div style={{ display: "grid", gap: "28px", marginBottom: "40px" }}>
          {/* 成果物 01：AI診断カルテ */}
          <ProductOutputPreview />

          {/* 成果物 02：AI公式推薦台帳 */}
          <figure
            style={{
              margin: 0,
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "12px",
              boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.08)",
              overflow: "hidden",
            }}
            aria-label="成果物02：自社専用 AI公式台帳"
          >
            {/* ヘッダー */}
            <div
              style={{
                background: "#0f172a",
                color: "#ffffff",
                padding: "12px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    background: "#16a34a",
                    color: "#ffffff",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: "3px",
                    letterSpacing: "0.04em",
                  }}
                >
                  成果物 02
                </span>
                <strong style={{ fontSize: "0.88rem", letterSpacing: "-0.01em" }}>
                  自社専用 AI公式推薦台帳（即日自動配備）
                </strong>
              </div>
              <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                ※ 自社サイト改修ゼロ・ブログ更新ゼロでネット上に常時公開
              </span>
            </div>

            {/* 内容 */}
            <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#16a34a", display: "block", marginBottom: "4px" }}>
                  主要生成AI（ChatGPT / Gemini / Perplexity）専用の公認データ拠点
                </span>
                <h4 style={{ margin: "0 0 10px", fontSize: "1.15rem", color: "#0f172a", fontWeight: 800, lineHeight: 1.4 }}>
                  AIが「この会社をおすすめして間違いがない」と確信する確定仕様を配備
                </h4>
                <p style={{ margin: "0 0 16px", fontSize: "0.82rem", color: "#475569", lineHeight: 1.7 }}>
                  カルテで特定された「自社の真の強み（例：親身な個別伴走）」を、AIが一番好む構造化規格でネット上に即日公開。自社サイトを1行も触ることなく、明日からAIが優先推薦できる環境が整います。
                </p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <Link
                    href="/ai/company/aoba-souzoku?sample=1"
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: "#ffffff",
                      background: "#0f172a",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    実際の公式台帳を見る ➔
                  </Link>
                  <Link
                    href="/result?sample=1"
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: "#0f172a",
                      background: "#f1f5f9",
                      border: "1px solid #cbd5e1",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      textDecoration: "none",
                    }}
                  >
                    診断カルテの実物を見る
                  </Link>
                </div>
              </div>

              {/* 右側：仕様ダイジェスト */}
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "18px 20px" }}>
                <span style={{ fontSize: "0.72rem", color: "#64748b", display: "block", marginBottom: "8px", fontWeight: 700 }}>
                  台帳に記録される確定仕様（抜粋）
                </span>
                <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.8rem", color: "#334155", lineHeight: 1.8 }}>
                  <li><strong>事業者名</strong>：あおば相続法務事務所</li>
                  <li><strong>AI認定看板</strong>：親身な個別伴走・複雑案件特化</li>
                  <li><strong>一次検証証跡</strong>：公的資格番号・面談実績認証済</li>
                  <li><strong>AI連携形式</strong>：Schema.org JSON-LD / llms.txt 完全準拠</li>
                </ul>
              </div>
            </div>
          </figure>
        </div>

        {/* わかりやすい実業の変革事例 */}
        <div className="story-grid" style={{ marginBottom: "40px" }}>
          <article className="story-card">
            <div className="story-card-header">
              <span className="category">専門士業法人（相続・事業承継）</span>
              <h3>「広告費ゼロで、AIの推薦候補入りを実現」</h3>
            </div>
            <div className="story-query-snippet">
              <span className="query-snippet-label">相談者のAI検索：</span>
              <p>「大手の事務的な対応ではなく、親身に相談に乗ってくれる相続の窓口は？」</p>
            </div>
            <div className="story-timeline">
              <div className="story-before">
                <strong>導入前の状況：</strong><br />
                AIで「相続の相談窓口」を聞いても大手ばかりが推薦され、自社の存在は認知されていなかった。
              </div>
              <div className="story-after">
                <strong>AIX導入後の変化：</strong><br />
                自社サイト改修ゼロで公式台帳を開設。「親身な個別伴走体制」をAIに公式登録したことで、AIが『手厚い個別対応の専門家』として認識し、相談の回答候補に挙がりやすくなった。
              </div>
            </div>
          </article>

          <article className="story-card">
            <div className="story-card-header">
              <span className="category">精密板金加工所（試作・小ロット）</span>
              <h3>「価格競争から脱出。自社の仕様がAIに正確に伝わる状態へ」</h3>
            </div>
            <div className="story-query-snippet">
              <span className="query-snippet-label">発注者のAI検索：</span>
              <p>「特殊形状の単品試作。短納期で相談できる板金加工会社は？」</p>
            </div>
            <div className="story-timeline">
              <div className="story-before">
                <strong>導入前の状況：</strong><br />
                営業マンがおらず、ネットからの問い合わせも値下げを強いられる相見積もりばかりだった。
              </div>
              <div className="story-after">
                <strong>AIX導入後の変化：</strong><br />
                大手が対応できない「1点からの特急試作」を公式台帳に明記。AIが『短納期に強い工場』として仕様を認識し、開発者への推薦候補に浮上しやすくなった。
              </div>
            </div>
          </article>
        </div>

        {/* 全国の事業者による公式台帳 開設・運用実績ギャラリー */}
        <VerifiedCompaniesGallery />

        {/* 定期見守り体制の可視化 */}
        <div style={{ marginTop: "40px" }}>
          <div className="landing-watch-grid">
            <WatchTrendVisual />
            <div className="section-intro">
              <span className="pill-badge">専属のAI見守り体制</span>
              <h2>AIの推薦状況を、<br />毎週自動で追跡・チェック。</h2>
              <p>ChatGPTなどのAI回答は日々更新されます。自社が推薦候補に入り続けているか、ライバルの回答状況に変化がないかを毎週自動で追跡調査します。</p>
              <ul className="watch-feature-list">
                <li><strong>毎週月曜に自動巡回</strong>：主要AIの回答変動を定期チェック</li>
                <li><strong>ライバル変動アラート</strong>：競合の急浮上や推薦順位の変化を検知</li>
                <li><strong>安心の完全自動</strong>：社長の手間ゼロで台帳を常に最新維持</li>
              </ul>
              <Link className="text-button" href="/watch?sample=1">追跡レポートの見本を見る <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 5. 最終CTAエリア：純白で余白の広いアクションエリア */}
      {/* ================================================================= */}
      <section className="landing-final-cta">
        <div className="shell">
          <span className="pill-badge">AI新時代に取り残されないために</span>
          <h2>御社はAIから「おすすめ」されていますか？<br />まずは無料診断で、自社の現状をご確認ください。</h2>
          <ScanForm compact />
          <div className="hero-trust-badges" style={{ justifyContent: "center", marginTop: "18px" }} aria-label="サービスの特長">
            <div className="trust-badge">
              <svg className="badge-check" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8.5L6.5 12L13 4" />
              </svg>
              <span>所要10秒（社名のみ）</span>
            </div>
            <div className="trust-badge">
              <svg className="badge-check" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8.5L6.5 12L13 4" />
              </svg>
              <span>自社サイト改修ゼロ</span>
            </div>
            <div className="trust-badge">
              <svg className="badge-check" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8.5L6.5 12L13 4" />
              </svg>
              <span>完全無料・自動課金なし</span>
            </div>
          </div>
          <div style={{ marginTop: "16px" }}>
            <Link className="final-secondary-link" href="/pricing">料金プランの詳細を見る <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
