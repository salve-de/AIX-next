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
            AI向けデータがない状態では知名度の高い大手が優先され、公式データを配備すると御社が名指しで推薦されます。
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
      {/* 3. このサービスで何が起きるのか？（社名を入れるだけで起きる3つの変化） */}
      {/* ================================================================= */}
      <section className="landing-deliverables-section shell" style={{ marginTop: "48px", marginBottom: "48px" }}>
        <div className="section-head-center" style={{ marginBottom: "32px" }}>
          <span className="pill-badge">このサービスで起きること</span>
          <h2>社名を入力するだけで、<br />御社に起きる「3つの変化」</h2>
          <p>
            ホームページの改修も、専門知識も一切不要。<br />
            社名を入れた瞬間から、AIに選ばれる会社へと自動で切り替わります。
          </p>
        </div>

        {/* 3ステップの直感ストーリーカード（何がどうなるかが0.1秒でわかる） */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
            gap: "16px",
            marginBottom: "36px",
          }}
        >
          {/* Step 1 */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              padding: "22px 20px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#475569", background: "#f1f5f9", padding: "2px 8px", borderRadius: "3px", fontFamily: "var(--font-mono, monospace)" }}>
                STEP 01
              </span>
              <span style={{ fontSize: "0.72rem", color: "#64748b" }}>所要10秒・無料</span>
            </div>
            <strong style={{ fontSize: "1.02rem", color: "#0f172a", lineHeight: 1.4, marginBottom: "8px" }}>
              10秒で「自社の現状」が判明
            </strong>
            <p style={{ fontSize: "0.82rem", color: "#475569", lineHeight: 1.6, margin: "0 0 14px" }}>
              主要AIで御社を実際に検索し、「客を他社に奪われていないか」を客観的に白黒判定します。
            </p>
            <div style={{ marginTop: "auto", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "8px 10px", borderRadius: "4px", fontSize: "0.74rem", color: "#334155", fontWeight: 600 }}>
              届くもの：自社専用 AI診断レポート
            </div>
          </div>

          {/* Step 2 */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              padding: "22px 20px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#0f172a", background: "#e2e8f0", padding: "2px 8px", borderRadius: "3px", fontFamily: "var(--font-mono, monospace)" }}>
                STEP 02
              </span>
              <span style={{ fontSize: "0.72rem", color: "#0284c7", fontWeight: 600 }}>作業ゼロ・即日開設</span>
            </div>
            <strong style={{ fontSize: "1.02rem", color: "#0f172a", lineHeight: 1.4, marginBottom: "8px" }}>
              専用データをネット上に即日配備
            </strong>
            <p style={{ fontSize: "0.82rem", color: "#475569", lineHeight: 1.6, margin: "0 0 14px" }}>
              自社サイトはいじらず、AIが一番読み取りやすい「御社の本当の強み」を自動公開します。
            </p>
            <div style={{ marginTop: "auto", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "8px 10px", borderRadius: "4px", fontSize: "0.74rem", color: "#334155", fontWeight: 600 }}>
              配備されるもの：自社専用 AI公式推薦データ
            </div>
          </div>

          {/* Step 3 */}
          <div
            style={{
              background: "#0f172a",
              color: "#ffffff",
              border: "1px solid #0f172a",
              borderRadius: "8px",
              padding: "22px 20px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 14px rgba(15, 23, 42, 0.12)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#38bdf8", background: "#1e293b", padding: "2px 8px", borderRadius: "3px", fontFamily: "var(--font-mono, monospace)" }}>
                STEP 03
              </span>
              <span style={{ fontSize: "0.72rem", color: "#38bdf8", fontWeight: 600 }}>最終ゴール</span>
            </div>
            <strong style={{ fontSize: "1.02rem", color: "#ffffff", lineHeight: 1.4, marginBottom: "8px" }}>
              明日から「AIが御社を名指し推薦」
            </strong>
            <p style={{ fontSize: "0.82rem", color: "#cbd5e1", lineHeight: 1.6, margin: "0 0 14px" }}>
              お客さんがAIに相談した際、大手を押しのけて御社が名指しで案内され始めます。
            </p>
            <div style={{ marginTop: "auto", background: "#1e293b", border: "1px solid #334155", padding: "8px 10px", borderRadius: "4px", fontSize: "0.74rem", color: "#38bdf8", fontWeight: 700 }}>
              得られる成果：大手に奪われていた推薦客を奪還
            </div>
          </div>
        </div>

        {/* 診断で手に入る2つの実物見本プレビュー */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <span style={{ fontSize: "0.76rem", color: "#64748b", fontWeight: 700, letterSpacing: "0.04em" }}>
            ▼ 実際に手元に届く「2つの実物見本」
          </span>
        </div>
        <div style={{ display: "grid", gap: "24px", marginBottom: "32px" }}>
          {/* 成果物 01：AI診断レポート */}
          <ProductOutputPreview />

          {/* 成果物 02：AI公式推薦データ */}
          <figure
            style={{
              margin: 0,
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              boxShadow: "0 2px 12px rgba(15, 23, 42, 0.05)",
              overflow: "hidden",
            }}
            aria-label="手に入るもの 02：自社専用 AI公式推薦データ"
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
                    background: "#1e293b",
                    border: "1px solid #475569",
                    color: "#ffffff",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: "3px",
                    fontFamily: "var(--font-mono, monospace)",
                    letterSpacing: "0.05em",
                  }}
                >
                  手に入るもの 02
                </span>
                <strong style={{ fontSize: "0.88rem", letterSpacing: "-0.01em" }}>
                  自社専用 AI公式推薦データ（即日開設）
                </strong>
              </div>
              <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                ※ ホームページの改修・新たな開設は不要。1文字も作業する必要はありません
              </span>
            </div>

            {/* 内容 */}
            <div style={{ padding: "22px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b", fontFamily: "var(--font-mono, monospace)", display: "block", marginBottom: "4px" }}>
                  ChatGPTなどのAIが常時参照する「公式推薦データ」
                </span>
                <h4 style={{ margin: "0 0 10px", fontSize: "1.08rem", color: "#0f172a", fontWeight: 700, lineHeight: 1.4 }}>
                  AIが御社の強みを正しく理解し、推薦候補として認識するデータを配備
                </h4>
                <p style={{ margin: "0 0 16px", fontSize: "0.8rem", color: "#475569", lineHeight: 1.7 }}>
                  御社ならではの「本当の強み（例：親身な個別対応、1個からの特急試作など）」を、AIが一番読みやすい形式でネット上に自動公開。今のホームページはいじらず、明日からAIがお客さんに御社をおすすめし始める状態を作ります。
                </p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <Link
                    href="/ai/company/aoba-souzoku?sample=1"
                    style={{
                      fontSize: "0.8rem",
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
                    <span>公式推薦データの実例を見る</span>
                    <ArrowIcon />
                  </Link>
                  <Link
                    href="/result?sample=1"
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#0f172a",
                      background: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      textDecoration: "none",
                    }}
                  >
                    診断レポートの実例を見る
                  </Link>
                </div>
              </div>

              {/* 右側：強みダイジェスト */}
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "16px 18px" }}>
                <span style={{ fontSize: "0.68rem", color: "#64748b", display: "block", marginBottom: "8px", fontWeight: 700, fontFamily: "var(--font-mono, monospace)" }}>
                  AIが参照する御社の強み（例）
                </span>
                <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.78rem", color: "#334155", lineHeight: 1.8 }}>
                  <li><strong>会社名・屋号</strong>：あおば相続法務事務所</li>
                  <li><strong>AI向け公式データ</strong>：親身な個別対応・複雑な相続トラブル特化</li>
                  <li><strong>安心の裏付け</strong>：国家資格・相談実績などの公的データ</li>
                  <li><strong>対応AI</strong>：ChatGPT • Google Gemini • Perplexity • Claude • Copilot</li>
                </ul>
              </div>
            </div>
          </figure>
        </div>
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
            background: "#ffffff",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            padding: "clamp(24px, 3.5vw, 36px)",
            boxShadow: "0 2px 12px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 28px" }}>
            <span className="pill-badge">明朗・適正な価格設定</span>
            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", margin: "0 0 10px" }}>
              月30万円の営業マンを雇う代わりに。<br />いつでも安心できる明朗な料金体系
            </h3>
            <p style={{ fontSize: "0.86rem", color: "#475569", margin: 0, lineHeight: 1.65 }}>
              SEO業者への高額な依頼や広告費の垂れ流しはもう不要です。まずは無料診断で現状を確かめ、必要な場合だけ週次の自動見守りを開始できます。
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
              maxWidth: "840px",
              margin: "0 auto",
            }}
          >
            {/* プラン 1：無料診断 */}
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                padding: "24px 22px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", fontFamily: "var(--font-mono, monospace)", marginBottom: "4px" }}>
                現状把握とおすすめデータ発行
              </span>
              <h4 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: "0 0 12px" }}>
                無料AI推薦 診断レポート
              </h4>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "16px" }}>
                <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a" }}>0円</span>
                <span style={{ fontSize: "0.76rem", color: "#64748b" }}>（即日発行・完全無料）</span>
              </div>
              <ul style={{ margin: "0 0 20px", paddingLeft: "16px", fontSize: "0.8rem", color: "#475569", lineHeight: 1.8, flex: 1 }}>
                <li>買い手がAIにする12の質問での実況レポート</li>
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
                  gap: "6px",
                  background: "#0f172a",
                  color: "#ffffff",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  padding: "10px 16px",
                  borderRadius: "4px",
                  textDecoration: "none",
                }}
              >
                <span>まずは無料で診断してみる（10秒）</span>
                <ArrowIcon />
              </a>
            </div>

            {/* プラン 2：毎週の自動見守り */}
            <div
              style={{
                background: "#ffffff",
                border: "1.5px solid #0f172a",
                borderRadius: "6px",
                padding: "24px 22px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "18px",
                  background: "#0f172a",
                  color: "#ffffff",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: "3px",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                おすすめ
              </span>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", fontFamily: "var(--font-mono, monospace)", marginBottom: "4px" }}>
                継続運用・順位監視
              </span>
              <h4 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: "0 0 12px" }}>
                毎週の自動見守りプラン
              </h4>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "16px" }}>
                <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a" }}>月額 9,800円</span>
                <span style={{ fontSize: "0.76rem", color: "#64748b" }}>（1日あたり約320円）</span>
              </div>
              <ul style={{ margin: "0 0 20px", paddingLeft: "16px", fontSize: "0.8rem", color: "#475569", lineHeight: 1.8, flex: 1 }}>
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
                  gap: "6px",
                  background: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  color: "#0f172a",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  padding: "10px 16px",
                  borderRadius: "4px",
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


