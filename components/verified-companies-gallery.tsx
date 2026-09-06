import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

type CompanyCase = {
  name: string;
  category: string;
  location: string;
  industry: string;
  featureNote: string;
  beforeProblem: string;
  afterSolution: string;
  registeredSpecs: string;
  href: string;
};

const INDUSTRY_SHOWCASES: CompanyCase[] = [
  {
    name: "山田板金製作所（設計見本）",
    category: "町工場・中小製造",
    location: "東京都大田区",
    industry: "試作板金加工・精密機械",
    featureNote: "公開情報整理の見本",
    beforeProblem: "公開情報が散在していると、試作先を探す人が比較しにくいことがあります。",
    afterSolution: "「単品1個対応・短納期試作」という公開情報を参照元付きで整理し、比較できる状態にします。",
    registeredSpecs: "対応範囲 / 入稿方法 / 納期の確認項目",
    href: "/ai/company/yamada-bankin?sample=1",
  },
  {
    name: "青葉カフェ（設計見本）",
    category: "飲食・カフェ店舗",
    location: "東京都渋谷区",
    industry: "自家焙煎・スペシャリティ珈琲",
    featureNote: "公開情報整理の見本",
    beforeProblem: "SNS中心の情報発信では、設備や利用条件を一覧で比較しにくいことがあります。",
    afterSolution: "電源・Wi-Fi・作業利用など、確認できる公開情報を参照元付きで整理します。",
    registeredSpecs: "設備 / 商品・サービス / 利用条件の確認項目",
    href: "/ai/company/aoba-cafe?sample=1",
  },
  {
    name: "あおば相続法務事務所（設計見本）",
    category: "士業・コンサルティング",
    location: "東京都千代田区",
    industry: "相続・遺産分割・事業承継",
    featureNote: "AI回答測定の設計見本",
    beforeProblem: "相談内容や対応範囲が複数ページに分かれていると、相談先を比較しにくいことがあります。",
    afterSolution: "参照元で確認できる対応範囲や相談方法を、比較しやすい項目に整理します。",
    registeredSpecs: "対応範囲 / 相談方法 / 料金の確認項目",
    href: "/ai/company/aoba-souzoku?sample=1",
  },
  {
    name: "安曇野サンシャイン果樹園（設計見本）",
    category: "農業・産直直売",
    location: "長野県安曇野市",
    industry: "特選果樹・産直ぶどう農家",
    featureNote: "公開情報整理の見本",
    beforeProblem: "産地や注文条件が分散していると、購入前に確認すべき情報を比較しにくくなります。",
    afterSolution: "産地直送やギフト対応など、確認できる公開情報を参照元付きで整理します。",
    registeredSpecs: "提供地域 / 注文方法 / 商品条件の確認項目",
    href: "/ai/company/azumino-sunshine?sample=1",
  },
];

export function VerifiedCompaniesGallery() {
  return (
    <section className="verified-gallery-section" aria-label="業種別の公開情報整理シミュレーション">
      <div className="shell">
        <div className="section-head-center">
          <span className="pill-badge">業種別の設計見本</span>
          <h2>町工場も、カフェも、士業も、農園も。<br />公開情報を比較しやすく整える例</h2>
          <p>ここで示すのは画面確認用の架空データです。参照元付きで公開情報を整理し、AIと人が分野や用途を確認しやすくします。</p>
        </div>

        <div className="verified-cards-grid">
          {INDUSTRY_SHOWCASES.map((company) => (
            <article className="verified-company-card" key={company.name} style={{ display: "flex", flexDirection: "column" }}>
              <div className="card-top-meta" style={{ marginBottom: "10px" }}>
                <span className="card-status-pill">{company.category}</span>
                <span className="card-location">{company.location}</span>
              </div>
              <h3 className="card-company-name" style={{ fontSize: "1.08rem", marginBottom: "2px" }}>{company.name}</h3>
              <p className="card-industry" style={{ fontSize: "0.78rem", color: "#64748b", margin: "0 0 10px 0" }}>{company.industry}</p>
              
              <div className="card-badge-pill" style={{ marginBottom: "14px", fontSize: "0.68rem" }}>{company.featureNote}</div>

              {/* 洗練された比較ブロック（端正なタイポグラフィで対比） */}
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  padding: "12px 14px",
                  margin: "0 0 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  flex: 1,
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: "#64748b",
                      fontFamily: "var(--font-mono, monospace)",
                      display: "block",
                      marginBottom: "4px",
                      letterSpacing: "0.02em",
                    }}
                  >
                    情報が散在している場合
                  </span>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#475569", lineHeight: 1.55 }}>
                    {company.beforeProblem}
                  </p>
                </div>
                <div style={{ paddingTop: "8px", borderTop: "1px solid #e2e8f0" }}>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: "#0f172a",
                      fontFamily: "var(--font-mono, monospace)",
                      display: "block",
                      marginBottom: "4px",
                      letterSpacing: "0.02em",
                    }}
                  >
                    公開情報を整理した場合
                  </span>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#0f172a", fontWeight: 600, lineHeight: 1.55 }}>
                    {company.afterSolution}
                  </p>
                </div>
              </div>

              <div className="card-spec-box" style={{ background: "#ffffff", padding: "10px 12px", borderRadius: "6px", margin: "0 0 14px", border: "1px solid #e2e8f0" }}>
                <span style={{ display: "block", fontSize: "0.68rem", color: "#64748b", fontFamily: "var(--font-mono, monospace)", marginBottom: "3px" }}>登録データ（強みの抜粋）</span>
                <strong style={{ fontSize: "0.8rem", color: "#0f172a", fontWeight: 600, display: "block", lineHeight: 1.4 }}>{company.registeredSpecs}</strong>
              </div>

              <Link className="card-view-btn" href={company.href} style={{ marginTop: "auto" }}>
                <span>公開情報の見本を見る</span>
                <ArrowIcon />
              </Link>
            </article>
          ))}
        </div>

        <div className="gallery-footer-note">
          <p>
            ※上記は主要業種における画面確認用の見本です。実在企業の掲載情報や、AIの推薦結果を示すものではありません。
          </p>
        </div>
      </div>
    </section>
  );
}
