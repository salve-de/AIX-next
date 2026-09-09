import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { BuyingAuditLandingPreview } from "@/components/buying-audit-landing-preview";
import { ScanForm } from "@/components/scan-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { FREE_PANEL_SIZE } from "@/lib/prompt-panels";
import { WATCH_MONTHLY_PRICE_LABEL } from "@/lib/pricing";

export default function HomePage() {
  return (
    <main className="landing-page">
      <SiteHeader />

      <section className="landing-hero">
        <div className="shell landing-hero-inner">
          <div className="landing-hero-single">
            <div className="landing-hero-head-block">
              <p className="overline">ChatGPT・Gemini・PerplexityのAI購買監査</p>
              <h1>
                客がAIに相談した時、<br />
                <em>御社が候補から落ちていないか、間違って説明されていないか。</em>
              </h1>
              <p className="landing-hero-lead">
                Rovanは、購入前の重要な質問をAIで継続調査し、候補落ち・競合・AIの誤情報・参照元の変化を監視します。<br />
                問題が見つかった時は、公式情報を根拠に「どこを何に直すか」まで整理します。
              </p>
            </div>

            <div className="landing-hero-form-box" id="scan">
              <ScanForm hideExtraToggle />
            </div>

            <div className="hero-trust-row" aria-label="サービスの特長">
              <span className="trust-item">
                <svg className="trust-check" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8.5L6.5 12L13 4" /></svg>
                URL・社名だけで開始
              </span>
              <span className="trust-sep" aria-hidden="true">•</span>
              <span className="trust-item">
                <svg className="trust-check" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8.5L6.5 12L13 4" /></svg>
                診断にサイト権限不要
              </span>
              <span className="trust-sep" aria-hidden="true">•</span>
              <span className="trust-item">
                <svg className="trust-check" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8.5L6.5 12L13 4" /></svg>
                無料診断・自動課金なし
              </span>
            </div>

            <div className="hero-ai-targets-clean" aria-label="調査対象AI">
              <span className="ai-clean-caption">調査対象:</span>
              <span className="ai-clean-names">OpenAI • Google Gemini • Perplexity</span>
            </div>

            <div className="hero-sample-link-wrapper">
              <Link className="hero-sample-link" href="/result?sample=1">
                AI購買監査の見本を見る <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-deliverables-section shell" style={{ marginTop: "56px", marginBottom: "56px" }}>
        <div className="section-head-center" style={{ marginBottom: "32px" }}>
          <span className="pill-badge">無料診断で分かること</span>
          <h2>「AIで見つかるか」だけではなく、<br />「どう選ばれ、どう説明されているか」まで見る。</h2>
          <p>
            重要な購入前質問を優先し、御社が候補から外れる場面、AIの説明と公式情報の食い違い、回答に使われた外部情報源をまとめます。
          </p>
        </div>
        <BuyingAuditLandingPreview />
        <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#64748b", margin: "20px auto 0", maxWidth: "800px", lineHeight: 1.7 }}>
          ※ AI回答は質問・提供元・測定時点で変わります。候補外を実際の顧客流出とは扱わず、公式サイトに記載がないだけで「誤情報」とは判定しません。
        </p>
      </section>

      <section className="shell" style={{ marginTop: "56px", marginBottom: "56px" }}>
        <div className="section-head-center" style={{ marginBottom: "32px" }}>
          <span className="pill-badge">仕組み</span>
          <h2>社名かURLを入れた後は、<br />Rovanが調査・比較・監視する。</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          {[
            ["01", "購入前の質問を作る", "会社・商品・市場を公開情報から読み、比較・価格・用途・対象顧客など、購入判断に近い質問を優先します。"],
            ["02", "主要AIで実測する", "同じ質問をOpenAI・Gemini・Perplexityで観測し、御社・競合・引用元を記録します。"],
            ["03", "公式情報と照合する", "AIが料金・機能・利用条件などを明確に誤って説明している場合、公式ページの原文と並べて表示します。"],
            ["04", "変化があれば知らせる", "候補落ち、新しい競合、新しい誤情報、参照元の変化をWatchで追い、重要な変化を通知します。"],
          ].map(([number, title, body]) => (
            <article key={number} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "22px", background: "#fff" }}>
              <span style={{ display: "block", fontSize: ".74rem", fontWeight: 800, color: "#64748b", marginBottom: "10px" }}>{number}</span>
              <h3 style={{ margin: "0 0 9px", fontSize: "1rem", color: "#0f172a" }}>{title}</h3>
              <p style={{ margin: 0, color: "#475569", fontSize: ".84rem", lineHeight: 1.75 }}>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shell" style={{ marginTop: "56px", marginBottom: "56px" }}>
        <div className="section-head-center" style={{ marginBottom: "30px" }}>
          <span className="pill-badge">問題が見つかった時</span>
          <h2>「改善してください」で終わらせず、<br />実装できる変更内容まで出す。</h2>
          <p>対象ページ、見出し、本文、FAQ、必要に応じた構造化データなどを、確認できた事実だけで下書きします。顧客サイトへ勝手に書き込みません。</p>
        </div>
        <div style={{ maxWidth: "860px", margin: "0 auto", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "24px", background: "#f8fafc" }}>
          <p style={{ margin: "0 0 8px", fontSize: ".74rem", color: "#64748b", fontWeight: 800 }}>変更例</p>
          <h3 style={{ margin: "0 0 12px", fontSize: "1.05rem", color: "#0f172a" }}>/service の「対応企業」セクション</h3>
          <p style={{ margin: "0 0 12px", color: "#475569", lineHeight: 1.7, fontSize: ".86rem" }}>購入前質問で確認できなかった対応条件を、公式情報に根拠がある範囲で明確にする案を作成。</p>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px", fontSize: ".84rem", color: "#334155", lineHeight: 1.7 }}>
            <strong>出力:</strong> 変更先URL / 変更箇所 / 新しい見出し / 本文 / FAQ / 使用した根拠URL / 関係する購入前質問
          </div>
        </div>
      </section>

      <section className="landing-watch-pricing-section shell" style={{ marginTop: "56px", marginBottom: "56px" }}>
        <div className="section-head-center" style={{ marginBottom: "30px" }}>
          <span className="pill-badge">継続監視</span>
          <h2>毎週レポートを読むサービスではなく、<br />重要な変化を見逃さないためのWatch。</h2>
          <p>平常時は作業不要。候補落ち・AI誤情報・新しい競合など、確認すべき変化が出た時に分かる状態を維持します。</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", maxWidth: "920px", margin: "0 auto 32px" }}>
          {[
            ["候補落ち", "前回は候補入りしていた重要質問で、今回候補外が優勢になった変化を検出。"],
            ["AI誤情報", "料金・利用条件・機能など、公式情報と明確に矛盾する新しい説明を検出。"],
            ["競合・参照元", "新しく現れた競合候補や、AIが使う外部情報源の変化を記録。"],
          ].map(([title, body]) => (
            <article key={title} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "20px", background: "#fff" }}>
              <h3 style={{ margin: "0 0 8px", fontSize: ".98rem", color: "#0f172a" }}>{title}</h3>
              <p style={{ margin: 0, color: "#475569", fontSize: ".83rem", lineHeight: 1.7 }}>{body}</p>
            </article>
          ))}
        </div>

        <div style={{ background: "#fff", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "clamp(24px, 4vw, 38px)", maxWidth: "860px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "26px" }}>
            <span className="pill-badge">料金</span>
            <h3 style={{ margin: "10px 0 8px", fontSize: "1.35rem", color: "#0f172a" }}>まず無料で現状確認。必要なら継続監視。</h3>
            <p style={{ margin: 0, color: "#64748b", fontSize: ".84rem" }}>無料診断から自動で課金されることはありません。</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px" }}>
            <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "22px" }}>
              <span style={{ fontSize: ".74rem", fontWeight: 800, color: "#64748b" }}>無料診断</span>
              <strong style={{ display: "block", fontSize: "1.8rem", margin: "8px 0 14px", color: "#0f172a" }}>0円</strong>
              <ul style={{ paddingLeft: "18px", margin: "0 0 20px", color: "#475569", fontSize: ".82rem", lineHeight: 1.8 }}>
                <li>{FREE_PANEL_SIZE}問の購入前質問で初回診断</li>
                <li>候補落ち・競合・参照元を確認</li>
                <li>取得できた公式情報との事実照合</li>
              </ul>
              <a href="#scan" style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontWeight: 800, color: "#0f172a", textDecoration: "none" }}>無料で診断する <ArrowIcon /></a>
            </div>
            <div style={{ border: "2px solid #0f172a", borderRadius: "10px", padding: "22px" }}>
              <span style={{ fontSize: ".74rem", fontWeight: 800, color: "#64748b" }}>Watch</span>
              <strong style={{ display: "block", fontSize: "1.5rem", margin: "8px 0 14px", color: "#0f172a" }}>{WATCH_MONTHLY_PRICE_LABEL}</strong>
              <ul style={{ paddingLeft: "18px", margin: "0 0 20px", color: "#475569", fontSize: ".82rem", lineHeight: 1.8 }}>
                <li>重要な購入前質問を継続観測</li>
                <li>候補落ち・誤情報・新競合の異常検知</li>
                <li>問題発生時のChange Pack</li>
              </ul>
              <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontWeight: 800, color: "#0f172a", textDecoration: "none" }}>料金の詳細を見る <ArrowIcon /></Link>
            </div>
          </div>
          <p style={{ textAlign: "center", fontSize: ".72rem", color: "#94a3b8", margin: "18px 0 0", lineHeight: 1.6 }}>※ 表示価格に対応するStripe Price IDは本番公開前に設定確認が必要です。</p>
        </div>
      </section>

      <section className="landing-final-cta">
        <div className="shell">
          <span className="pill-badge">URL・社名だけで開始</span>
          <h2>AIの中で、御社がどう扱われているか。<br />まず無料で確認する。</h2>
          <ScanForm compact />
          <div className="hero-trust-badges" style={{ justifyContent: "center", marginTop: "18px" }} aria-label="サービスの特長">
            <div className="trust-badge"><span>サイト権限不要</span></div>
            <div className="trust-badge"><span>カード登録不要</span></div>
            <div className="trust-badge"><span>自動課金なし</span></div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
