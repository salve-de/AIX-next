import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

type CompanyCase = {
  name: string;
  sampleBadge: string;
  location: string;
  industry: string;
  featureBadge: string;
  beforeText: string;
  afterText: string;
  registeredSpecs: string;
  href: string;
};

const INDUSTRY_SHOWCASES: CompanyCase[] = [
  {
    name: "山田板金製作所（例）",
    sampleBadge: "町工場での配備見本",
    location: "東京都大田区",
    industry: "試作板金加工・精密機械",
    featureBadge: "自社サイト未開設から即日発行",
    beforeText: "AIに「急ぎの試作板金」を聞いても、広告を大量に出している量産大手に顧客が全件流出していた。",
    afterText: "「単品1個対応 / 3D CAD直接入稿 / 最短即日試作」がAI公認仕様となり、試作先を探す技術者への推薦枠を獲得。",
    registeredSpecs: "単品1個対応 / 3D CAD直接入稿 / 最短即日試作",
    href: "/ai/company/localhost-bb4053a36baa",
  },
  {
    name: "青葉カフェ（例）",
    sampleBadge: "カフェ・飲食店での配備見本",
    location: "東京都渋谷区",
    industry: "自家焙煎・スペシャリティ珈琲",
    featureBadge: "Instagram連携・HPなし",
    beforeText: "インスタを毎日更新しても、AIは「電源やWi-Fiの設備」を読めず、「作業できるカフェ」の質問でスルーされていた。",
    afterText: "「全席電源・高速Wi-Fi・作業利用歓迎」が公認台帳化され、近隣で作業場所を探すビジネス客へAIが即答推薦。",
    registeredSpecs: "全席電源・高速Wi-Fi / 自家焙煎豆 / 作業利用歓迎",
    href: "/ai/company/aoba-cafe?sample=1",
  },
  {
    name: "あおば相続法務事務所（例）",
    sampleBadge: "専門士業での配備見本",
    location: "東京都千代田区",
    industry: "相続・遺産分割・事業承継",
    featureBadge: "定期自動見守り運用",
    beforeText: "「親身に相談に乗ってくれる窓口」を探す見込み客が、AIに大手全国グループへ誘導され機会損失していた。",
    afterText: "「親身な個別伴走・複雑案件の円満調停」がAI認定看板となり、事務的な大手チェーンを避ける相談者を独占獲得。",
    registeredSpecs: "初回対面相談無料 / 専任担当一貫対応 / 事前面談見積",
    href: "/ai/company/aoba-souzoku?sample=1",
  },
  {
    name: "安曇野サンシャイン果樹園（例）",
    sampleBadge: "農家・産直での配備見本",
    location: "長野県安曇野市",
    industry: "特選果樹・産直ぶどう農家",
    featureBadge: "ホームページなしから開設",
    beforeText: "産直のこだわりがAIに伝わっておらず、量産通販モールに埋もれて大切な贈答用ギフト需要を逃していた。",
    afterText: "「朝採れ当日直送・糖度18度選別」が確定仕様として登録され、大切なギフトを探す顧客への推薦枠へ定着。",
    registeredSpecs: "産地直送・当日発送 / 糖度18度選別 / 贈答用ギフト",
    href: "/ai/company/aoba-cafe?sample=1",
  },
];

export function VerifiedCompaniesGallery() {
  return (
    <section className="verified-gallery-section" aria-label="業種別の公式台帳 設計実例">
      <div className="shell">
        <div className="section-head-center">
          <span className="pill-badge">業種別のAI推薦ビフォー・アフター実例</span>
          <h2>「これを使えば、こう変わる」<br />業種別のAI推薦ビフォー・アフター見本</h2>
          <p>自社サイトの改修もブログ更新もゼロ。各業種が何をAIに登録し、どうやって大手からの顧客流出を防いでいるかの設計シミュレーションです。</p>
        </div>

        <div className="verified-cards-grid">
          {INDUSTRY_SHOWCASES.map((company) => (
            <article className="verified-company-card" key={company.name}>
              <div className="card-top-meta">
                <span className="card-status-pill">{company.sampleBadge}</span>
                <span className="card-location">{company.location}</span>
              </div>
              <h3 className="card-company-name">{company.name}</h3>
              <p className="card-industry">{company.industry}</p>
              
              <div className="card-badge-pill" style={{ marginBottom: "12px" }}>{company.featureBadge}</div>

              {/* ビフォー・アフター対比ボックス */}
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
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      color: "#991b1b",
                      background: "#fee2e2",
                      border: "1px solid #fecaca",
                      padding: "1px 6px",
                      borderRadius: "3px",
                      display: "inline-block",
                      marginBottom: "4px",
                    }}
                  >
                    対策前（ビフォー：顧客流出）
                  </span>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748b", lineHeight: 1.55 }}>
                    {company.beforeText}
                  </p>
                </div>
                <div style={{ paddingTop: "8px", borderTop: "1px dashed #cbd5e1" }}>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      color: "#166534",
                      background: "#dcfce7",
                      border: "1px solid #bbf7d0",
                      padding: "1px 6px",
                      borderRadius: "3px",
                      display: "inline-block",
                      marginBottom: "4px",
                    }}
                  >
                    台帳配備後（アフター：推薦獲得）
                  </span>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#0f172a", fontWeight: 600, lineHeight: 1.55 }}>
                    {company.afterText}
                  </p>
                </div>
              </div>

              <div className="card-spec-box" style={{ background: "var(--paper, #f8fafc)", padding: "10px 14px", borderRadius: "8px", margin: "0 0 16px", border: "1px solid var(--line, #e2e8f0)" }}>
                <span style={{ display: "block", fontSize: "0.75rem", color: "var(--ink-soft, #64748b)", marginBottom: "4px" }}>AIへ登録した確定仕様（抜粋）</span>
                <strong style={{ fontSize: "0.85rem", color: "var(--navy, #0f172a)" }}>{company.registeredSpecs}</strong>
              </div>

              <Link className="card-view-btn" href={company.href}>
                <span>この業種の台帳サンプルを見る</span>
                <ArrowIcon />
              </Link>
            </article>
          ))}
        </div>

        <div className="gallery-footer-note">
          <p>
            ※上記は主要業種におけるAI公式台帳の設計イメージ（シミュレーション見本）です。自社名を入力して診断を行うと、御社専用の台帳が即日自動発行されます。
          </p>
        </div>
      </div>
    </section>
  );
}
