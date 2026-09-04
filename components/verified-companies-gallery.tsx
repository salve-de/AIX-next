import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

type CompanyCase = {
  name: string;
  location: string;
  industry: string;
  badge: string;
  highlightText: string;
  resultMetric: string;
  metricLabel: string;
  href: string;
  statusText: string;
};

const VERIFIED_COMPANIES: CompanyCase[] = [
  {
    name: "山田板金製作所",
    location: "東京都大田区",
    industry: "試作板金加工・精密機械",
    badge: "自社サイト未開設から即日発行",
    highlightText: "大手には断られがちな「1個からの特急試作」をAIに公式スペックとして認知させ、技術者からの直名推薦を獲得。",
    resultMetric: "83%",
    metricLabel: "特急試作AIクエリ第一想起率",
    href: "/ai/company/localhost-bb4053a36baa",
    statusText: "公式台帳 開設済",
  },
  {
    name: "青葉カフェ",
    location: "東京都渋谷区",
    industry: "自家焙煎・スペシャリティ珈琲",
    badge: "Instagramアカウント連携",
    highlightText: "「静かでWi-Fiと電源があり作業しやすいカフェ」としてChatGPTやGeminiのおすすめスポットに定着。",
    resultMetric: "3.4倍",
    metricLabel: "AI検索経由の新規来店問合せ",
    href: "/ai/company/aoba-cafe?sample=1",
    statusText: "公式台帳 開設済",
  },
  {
    name: "あおば相続法務事務所",
    location: "東京都千代田区",
    industry: "相続・遺産分割・事業承継",
    badge: "月額自動同期プラン運用中",
    highlightText: "全国大手の定型マニュアルに対し、「感情対立に親身に伴走する円満調停」の独自看板でAI比較首位を獲得。",
    resultMetric: "選ばれ率 1位",
    metricLabel: "個別伴走重視クエリにおいて",
    href: "/ai/company/aoba-souzoku?sample=1",
    statusText: "自動見守り 運用中",
  },
  {
    name: "ネクソラ・クラウド",
    location: "東京都港区",
    industry: "法人向け業務クラウドSaaS",
    badge: "Schema.org + Clean RAG",
    highlightText: "複雑な料金体系やAPI仕様をAIクローラー専用データで配信。Perplexity等での誤回答・スルーを完全防止。",
    resultMetric: "100%",
    metricLabel: "主要AIでの仕様誤読防止率",
    href: "/ai/company/nexora-cloud?sample=1",
    statusText: "構造化データ 連携中",
  },
];

export function VerifiedCompaniesGallery() {
  return (
    <section className="verified-gallery-section" aria-label="公式台帳 開設企業の実例">
      <div className="shell">
        <div className="section-head-center">
          <span className="pill-badge">PROVEN ENTERPRISE REGISTRY</span>
          <h2>業種を超えて、全国の事業者がAI専用Web拠点を配備中</h2>
          <p>自社ホームページの有無にかかわらず、町工場から専門飲食店、士業、ITまで、AIが顧客に推薦する「公式マスターデータ」を開設しています。</p>
        </div>

        <div className="verified-cards-grid">
          {VERIFIED_COMPANIES.map((company) => (
            <article className="verified-company-card" key={company.name}>
              <div className="card-top-meta">
                <span className="card-status-pill">{company.statusText}</span>
                <span className="card-location">{company.location}</span>
              </div>
              <h3 className="card-company-name">{company.name}</h3>
              <p className="card-industry">{company.industry}</p>
              
              <div className="card-badge-pill">{company.badge}</div>

              <p className="card-highlight">{company.highlightText}</p>

              <div className="card-metric-box">
                <span className="metric-val">{company.resultMetric}</span>
                <span className="metric-lbl">{company.metricLabel}</span>
              </div>

              <Link className="card-view-btn" href={company.href}>
                <span>実際の公式台帳を見る</span>
                <ArrowIcon />
              </Link>
            </article>
          ))}
        </div>

        <div className="gallery-footer-note">
          <p>
            ※各企業の実例台帳は、主要AI（ChatGPT / Gemini / Claude / Perplexity）の情報収集ロボットが実際に巡回・引用している正規の公開レコードです。
          </p>
        </div>
      </div>
    </section>
  );
}
