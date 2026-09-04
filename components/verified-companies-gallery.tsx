import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

type CompanyCase = {
  name: string;
  location: string;
  industry: string;
  badge: string;
  highlightText: string;
  registeredSpecs: string;
  href: string;
  statusText: string;
};

const VERIFIED_COMPANIES: CompanyCase[] = [
  {
    name: "山田板金製作所",
    location: "東京都大田区",
    industry: "試作板金加工・精密機械",
    badge: "自社サイト未開設から即日発行",
    highlightText: "大手には断られがちな「1個からの特急試作」をAIに公式仕様として登録。試作先を探す技術者への推薦候補へ採用。",
    registeredSpecs: "単品1個対応 / 3D CAD直接入稿 / 最短即日試作",
    href: "/ai/company/localhost-bb4053a36baa",
    statusText: "公式台帳 開設済",
  },
  {
    name: "青葉カフェ",
    location: "東京都渋谷区",
    industry: "自家焙煎・スペシャリティ珈琲",
    badge: "Instagramアカウント連携",
    highlightText: "「静かでWi-Fiと電源があり作業しやすいカフェ」として営業時間や設備環境を正確にAIへ伝達。",
    registeredSpecs: "全席電源・高速Wi-Fi / 自家焙煎豆 / 作業利用歓迎",
    href: "/ai/company/aoba-cafe?sample=1",
    statusText: "公式台帳 開設済",
  },
  {
    name: "あおば相続法務事務所",
    location: "東京都千代田区",
    industry: "相続・遺産分割・事業承継",
    badge: "定期自動見守り運用中",
    highlightText: "全国大手の定型マニュアルに対し、「感情対立に親身に伴走する円満調停」の独自強みをAIに公式学習。",
    registeredSpecs: "初回対面相談無料 / 専任担当一貫対応 / 事前面談見積",
    href: "/ai/company/aoba-souzoku?sample=1",
    statusText: "自動見守り 運用中",
  },
  {
    name: "安曇野サンシャイン果樹園",
    location: "長野県安曇野市",
    industry: "特選果樹・産直ぶどう農家",
    badge: "ホームページなしから開設",
    highlightText: "量産品通販と差別化し、朝採れ直送と糖度選別のこだわりをAIに登録。大切なギフトを探す顧客への推薦枠へ定着。",
    registeredSpecs: "産地直送・当日発送 / 糖度18度選別 / 贈答用ギフト",
    href: "/ai/company/aoba-cafe?sample=1",
    statusText: "公式台帳 開設済",
  },
];

export function VerifiedCompaniesGallery() {
  return (
    <section className="verified-gallery-section" aria-label="公式台帳 開設企業の実例">
      <div className="shell">
        <div className="section-head-center">
          <span className="pill-badge">業種別の公式台帳 開設実例</span>
          <h2>業種に合わせた、AI専用公式台帳の開設見本</h2>
          <p>自社ホームページの有無にかかわらず、町工場から専門飲食店、士業、農家まで、AIが正確に読み取る「公式マスターデータ」を開設できます。</p>
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

              <div className="card-spec-box" style={{ background: "var(--paper, #f8fafc)", padding: "10px 14px", borderRadius: "8px", margin: "12px 0 16px", border: "1px solid var(--line, #e2e8f0)" }}>
                <span style={{ display: "block", fontSize: "0.75rem", color: "var(--ink-soft, #64748b)", marginBottom: "4px" }}>AIへ登録した公式仕様</span>
                <strong style={{ fontSize: "0.85rem", color: "var(--navy, #0f172a)" }}>{company.registeredSpecs}</strong>
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
            ※各公式台帳は、ChatGPTやGeminiなどの主要生成AIが直接巡回・引用できる標準形式で常時公開されます。
          </p>
        </div>
      </div>
    </section>
  );
}
