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
    featureNote: "自社サイト未開設から即日発行",
    beforeProblem: "「急ぎの試作板金」の相談に対し、ネット広告量の多い大手量産工場へ顧客が誘導されていた。",
    afterSolution: "「単品1個対応・最短即日試作」がAI公式データとして認知され、試作先を探す技術者への推薦候補へ定着。",
    registeredSpecs: "単品1個対応 / 3D CAD直接入稿 / 最短即日試作",
    href: "/ai/company/localhost-bb4053a36baa",
  },
  {
    name: "青葉カフェ（設計見本）",
    category: "飲食・カフェ店舗",
    location: "東京都渋谷区",
    industry: "自家焙煎・スペシャリティ珈琲",
    featureNote: "SNS運用中心・HPなし",
    beforeProblem: "SNSを更新しても設備データがAIに伝わらず、「作業できるカフェ」の質問で候補から除外されていた。",
    afterSolution: "「全席電源・高速Wi-Fi・作業利用歓迎」がAI公式データとなり、近隣で作業場所を探すビジネス客へ推薦候補として提示。",
    registeredSpecs: "全席電源・高速Wi-Fi / 自家焙煎豆 / 作業利用歓迎",
    href: "/ai/company/aoba-cafe?sample=1",
  },
  {
    name: "あおば相続法務事務所（設計見本）",
    category: "士業・コンサルティング",
    location: "東京都千代田区",
    industry: "相続・遺産分割・事業承継",
    featureNote: "週次自動見守り運用",
    beforeProblem: "親身な個別伴走を求める相談者が、AIのアルゴリズムによって大手全国チェーンへ送客されていた。",
    afterSolution: "「親身な個別伴走・複雑案件の円満調停」がAI公式推薦データとなり、定型的な大手チェーンを避けたい相談者を推薦獲得。",
    registeredSpecs: "初回対面相談無料 / 専任担当一貫対応 / 事前面談見積",
    href: "/ai/company/aoba-souzoku?sample=1",
  },
  {
    name: "安曇野サンシャイン果樹園（設計見本）",
    category: "農業・産直直売",
    location: "長野県安曇野市",
    industry: "特選果樹・産直ぶどう農家",
    featureNote: "ホームページなしから開設",
    beforeProblem: "産直のこだわりがAIに認識されず、量産通販モールに埋もれて大切な贈答用ギフト需要を逃していた。",
    afterSolution: "「朝採れ当日直送・糖度18度選別」がAI公式データとして登録され、高品質ギフトを探す買い手への推薦候補に定着。",
    registeredSpecs: "産地直送・当日発送 / 糖度18度選別 / 贈答用ギフト",
    href: "/ai/company/aoba-cafe?sample=1",
  },
];

export function VerifiedCompaniesGallery() {
  return (
    <section className="verified-gallery-section" aria-label="業種別のAI推薦 実例シミュレーション">
      <div className="shell">
        <div className="section-head-center">
          <span className="pill-badge">業種別の実例シミュレーション</span>
          <h2>町工場も、カフェも、士業も、農園も。<br />AIが客に「ここがおすすめ」と言い始める実例</h2>
          <p>ホームページの改修も、新たな開設も不要。AI向け公式推薦データを配備することで、AIの回答が大手優先から自社おすすめへどう変化するかの実例見本です。</p>
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
                    未対策時の課題（大手優先）
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
                    公式データ配備後（強みで選定）
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
                <span>AI推薦データを見る</span>
                <ArrowIcon />
              </Link>
            </article>
          ))}
        </div>

        <div className="gallery-footer-note">
          <p>
            ※上記は主要業種におけるシミュレーション見本です。会社名を入力して無料診断を行うと、御社専用の推薦データがその場で自動発行されます。
          </p>
        </div>
      </div>
    </section>
  );
}

