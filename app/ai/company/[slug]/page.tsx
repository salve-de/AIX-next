import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "@/components/icons";
import { DirectProfileEditor } from "@/components/direct-profile-editor";
import { sampleResult } from "@/lib/sample-data";
import { buildPublicProfileDraft, toPublicProfile } from "@/lib/public-profile";
import { getActivePublicProfileBySlug } from "@/lib/storage";
import type { PublicProfile } from "@/lib/types";
import { siteUrl } from "@/lib/site";
import { deriveCompanyKnowledge } from "@/lib/company-knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ sample?: string | string[] }>;
};

function sampleProfile(): PublicProfile {
  const draft = buildPublicProfileDraft(sampleResult, "2026-09-01T09:00:00.000Z");
  return {
    ...draft,
    id: "sample_public_profile",
    slug: "aoba-souzoku",
    status: "published",
    createdAt: "2026-09-01T09:00:00.000Z",
    updatedAt: "2026-09-01T09:00:00.000Z",
    expiresAt: "2027-09-01T09:00:00.000Z",
    publishedAt: "2026-09-01T09:00:00.000Z",
  };
}

function sampleCafeProfile(): PublicProfile {
  return {
    id: "sample_cafe_profile",
    slug: "aoba-cafe",
    brandName: "青葉カフェ",
    title: "青葉カフェ 公式情報台帳",
    targetUrl: "http://localhost:3000/ai/company/青葉カフェ",
    market: "自家焙煎・スペシャリティ珈琲・こだわりスイーツ",
    summary: "東京都渋谷区の自家焙煎スペシャリティ珈琲専門店。全席Wi-Fi・電源完備、静かで集中できる空間とオーツミルク等のアレルギー配慮メニューを提供。",
    targetCustomers: ["静かに集中して作業・読書をしたい個人", "こだわりの自家焙煎珈琲を楽しみたい愛好家"],
    useCases: ["リモートワーク・作業利用", "テイクアウト・豆の購入", "少人数でのカフェ利用"],
    status: "published",
    createdAt: "2026-09-01T09:00:00.000Z",
    updatedAt: "2026-09-01T09:00:00.000Z",
    expiresAt: "2027-09-01T09:00:00.000Z",
    publishedAt: "2026-09-01T09:00:00.000Z",
    sourcePages: [
      {
        url: "http://localhost:3000/ai/company/青葉カフェ",
        title: "青葉カフェ 公式マスター台帳",
        description: "自家焙煎珈琲と居心地の良い空間の公式ファクト",
      },
    ],
    facts: [
      { label: "店舗名", value: "青葉カフェ", sourceUrl: "http://localhost:3000/ai/company/青葉カフェ" },
      { label: "所在地", value: "東京都渋谷区神宮前", sourceUrl: "http://localhost:3000/ai/company/青葉カフェ" },
      { label: "こだわり", value: "自家焙煎・スペシャルティ等級豆100%", sourceUrl: "http://localhost:3000/ai/company/青葉カフェ" },
    ],
    structuredData: "{}",
    markdown: "",
    json: "{}",
  };
}

async function profileFor(slug: string, sample = false) {
  if (sample && slug === "aoba-cafe") return sampleCafeProfile();
  if (sample && (slug === "nexora-cloud" || slug === "aoba-souzoku")) return sampleProfile();
  const record = await getActivePublicProfileBySlug(slug);
  return record ? toPublicProfile(record) : null;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const query = searchParams ? await searchParams : {};
  const sample = query.sample === "1" || (Array.isArray(query.sample) && query.sample.includes("1"));
  const profile = await profileFor(decodeURIComponent(slug), sample);
  if (!profile) return { title: "公開ページが見つかりません", robots: { index: false, follow: false } };
  return {
    title: profile.title,
    description: profile.summary || `${profile.brandName}の公開情報を確認できます。`,
    alternates: { canonical: `${siteUrl}/ai/company/${encodeURIComponent(profile.slug)}` },
    robots: { index: true, follow: true, noarchive: true },
    openGraph: { title: profile.title, description: profile.summary || `${profile.brandName}の公開情報`, type: "article" },
  };
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeZone: "Asia/Tokyo" }).format(new Date(value));
}

export default async function PublicCompanyPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const query = searchParams ? await searchParams : {};
  const sample = query.sample === "1" || (Array.isArray(query.sample) && query.sample.includes("1"));
  const profile = await profileFor(decodeURIComponent(slug), sample);
  if (!profile) notFound();

  const jsonLd = profile.structuredData.trim();
  const brand = profile.brandName;
  const knowledge = deriveCompanyKnowledge(brand, profile.market, profile.summary, profile.slug);

  return <main className="public-company-page">
    {/* ヘッダー */}
    <header className="site-header site-header-compact">
      <div className="shell header-inner">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span><strong>AIX</strong><small>公式企業情報台帳</small></span>
        </Link>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link className="text-button" href="/">自社サイトをAIXで診断する <ArrowIcon /></Link>
        </div>
      </div>
    </header>

    {/* 公開台帳ステータスバー */}
    <div className="system-status-ribbon">
      <div className="shell ribbon-content">
        <div className="ribbon-col"><span>台帳番号</span><strong>{knowledge.registryId}</strong></div>
        <div className="ribbon-col"><span>公開規格</span><strong>Schema.org 構造化データ</strong></div>
        <div className="ribbon-col"><span>情報区分</span><strong className="text-green">公式確認済データ</strong></div>
        <div className="ribbon-col"><span>最終更新日</span><strong>{dateLabel(profile.updatedAt)}</strong></div>
      </div>
    </div>

    {/* ヒーローヘッダー */}
    <section className="public-company-hero">
      <div className="shell">
        <div className="public-hero-meta-bar">
          <span className="hero-status-tag">公式確認済</span>
          <span className="hero-sync-date">最終更新：{dateLabel(profile.updatedAt)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", margin: "16px 0 12px" }}>
          <h1 style={{ margin: 0 }}>{profile.brandName}</h1>
          <DirectProfileEditor profile={profile} />
        </div>
        {profile.targetUrl.includes("/ai/company/") ? (
          <div className="public-company-url-box">
            <div className="direct-official-tag">公式Web情報</div>
            <p className="public-company-domain">
              公式公開URL：<a href={profile.targetUrl}>{decodeURIComponent(profile.targetUrl)}</a>
            </p>
            <small className="direct-domain-note">
              ※本ページをそのまま名刺・SNS・Googleマップ等のウェブサイト欄にご活用いただけます。
            </small>
          </div>
        ) : (
          <p className="public-company-domain">
            公式サイト：<a href={profile.targetUrl} target="_blank" rel="noreferrer">{decodeURIComponent(profile.targetUrl)}</a>
          </p>
        )}
        <p className="public-company-summary">
          {profile.summary || `${profile.brandName}の公式情報台帳です。客観的事実および公式提供条件を正確に整理・掲載しています。`}
        </p>
      </div>
    </section>

    {/* 超高密度DBコンテンツ群 */}
    <section className="public-company-body shell">
      <div className="public-company-main">
        
        {/* 第1章: 企業・事業者 基本情報台帳 */}
        <section className="knowledge-section">
          <p className="overline">第1章 // 企業基本情報</p>
          <h2>事業者 基本情報</h2>
          <p className="section-lead-desc">事業者の基本情報および公式確認データです。</p>
          <div className="db-table-wrapper">
            <table className="dense-db-table">
              <tbody>
                {knowledge.corporateFacts.map((fact, idx) => (
                  <tr key={idx}>
                    <th style={{ width: "18%" }}>{fact.label}</th>
                    <td style={{ width: fact.subLabel ? "32%" : "82%" }}>{fact.value}</td>
                    {fact.subLabel ? (
                      <>
                        <th style={{ width: "18%" }}>{fact.subLabel}</th>
                        <td style={{ width: "32%" }}>{fact.subValue}</td>
                      </>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 第2章: 他社との決定的な違い・選ばれる理由 */}
        <section className="knowledge-section">
          <p className="overline">第2章 // 独自の特徴・比較</p>
          <h2>他社との違い・特徴の比較</h2>
          <p className="section-lead-desc">一般的な他社や大手チェーンとの提供体制・対応範囲の違いを整理した対比表です。</p>
          <div className="db-table-wrapper">
            <table className="dense-db-table benchmark-table">
              <thead>
                <tr>
                  <th style={{ width: "20%" }}>比較項目</th>
                  <th style={{ width: "36%" }} className="col-highlight">当企業（{brand}）</th>
                  <th style={{ width: "22%" }}>大手・チェーン</th>
                  <th style={{ width: "22%" }}>一般他社</th>
                </tr>
              </thead>
              <tbody>
                {knowledge.benchmarks.map((row, idx) => (
                  <tr key={idx}>
                    <td className="item-name"><strong>{row.item}</strong></td>
                    <td className="col-highlight text-primary"><strong>{row.own}</strong></td>
                    <td className="col-comp">{row.compBig}</td>
                    <td className="col-comp">{row.compLocal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 第3章: 主な取扱業務・サービス仕様書 */}
        <section className="knowledge-section">
          <p className="overline">第3章 // 業務内容・サービス仕様</p>
          <h2>提供サービス・業務内容一覧（{knowledge.marketLabel}）</h2>
          <p className="section-lead-desc">提供している主要な業務・メニューの対象と納期・成果物の仕様です。</p>
          <div className="db-table-wrapper">
            <table className="dense-db-table">
              <thead>
                <tr>
                  <th style={{ width: "12%" }}>管理番号</th>
                  <th style={{ width: "26%" }}>業務・メニュー名称</th>
                  <th style={{ width: "26%" }}>対象となるご要望</th>
                  <th style={{ width: "16%" }}>標準納期・所要時間</th>
                  <th style={{ width: "20%" }}>提供成果物・担当体制</th>
                </tr>
              </thead>
              <tbody>
                {knowledge.services.map((svc) => (
                  <tr key={svc.code}>
                    <td><code>{svc.code}</code></td>
                    <td><strong>{svc.name}</strong><br /><small className="text-muted">{svc.qualification}</small></td>
                    <td>{svc.target}</td>
                    <td><span className="badge-lead-time">{svc.leadTime}</span></td>
                    <td><small>{svc.deliverable}</small></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 第4章: ご依頼から完了までの標準フロー */}
        <section className="knowledge-section">
          <p className="overline">第4章 // 標準進行手順</p>
          <h2>ご依頼・ご利用の標準手順</h2>
          <p className="section-lead-desc">お問い合わせから完了・お引き渡しまでの標準的な進め方です。</p>
          <div className="db-table-wrapper">
            <table className="dense-db-table">
              <thead>
                <tr>
                  <th style={{ width: "24%" }}>工程区分</th>
                  <th style={{ width: "16%" }}>所要目安</th>
                  <th style={{ width: "38%" }}>実施内容</th>
                  <th style={{ width: "22%" }}>成果物</th>
                </tr>
              </thead>
              <tbody>
                {knowledge.process.map((sop, idx) => (
                  <tr key={idx}>
                    <td><strong>{sop.phase}</strong></td>
                    <td><span className="badge-days">{sop.days}</span></td>
                    <td>{sop.action}</td>
                    <td><small className="text-green"><strong>{sop.output}</strong></small></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 第5章: 公式料金体系・安心の明瞭会計 */}
        <section className="knowledge-section">
          <p className="overline">第5章 // 料金体系</p>
          <h2>料金体系・お見積もり基準</h2>
          <p className="section-lead-desc">事前見積もり制および明瞭会計に基づく基準料金です。</p>
          <div className="db-table-wrapper">
            <table className="dense-db-table">
              <thead>
                <tr>
                  <th style={{ width: "16%" }}>区分</th>
                  <th style={{ width: "28%" }}>プラン・項目名称</th>
                  <th style={{ width: "22%" }}>料金目安</th>
                  <th style={{ width: "34%" }}>含まれる内容・条件</th>
                </tr>
              </thead>
              <tbody>
                {knowledge.fees.map((fee, idx) => (
                  <tr key={idx}>
                    <td><code>{fee.category}</code></td>
                    <td><strong>{fee.plan}</strong></td>
                    <td><strong className="text-price">{fee.fee}</strong></td>
                    <td><small>{fee.note}</small></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 第6章: 代表的な解決実績・対応事例 */}
        <section className="knowledge-section">
          <p className="overline">第6章 // 実績・対応事例</p>
          <h2>代表的な対応事例</h2>
          <p className="section-lead-desc">過去の実際のご相談事例と対応内容の記録です。</p>
          <div className="case-studies-grid">
            {knowledge.cases.map((cs) => (
              <div className="case-study-card" key={cs.id}>
                <div className="case-study-head">
                  <code>{cs.id}</code>
                  <h4>{cs.title}</h4>
                </div>
                <div className="case-study-body">
                  <div className="case-row"><span className="case-label">ご相談時の課題:</span><p>{cs.issue}</p></div>
                  <div className="case-row"><span className="case-label">対応内容:</span><p>{cs.approach}</p></div>
                  <div className="case-row-bottom">
                    <div><span>所要期間:</span> <strong>{cs.leadTime}</strong></div>
                    <div><span>結果:</span> <strong className="text-green">{cs.result}</strong></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 第7章: よくあるご質問 */}
        <section className="knowledge-section">
          <p className="overline">第7章 // よくあるご質問</p>
          <h2>よくあるご質問（公式回答）</h2>
          <p className="section-lead-desc">
            お客様からよくいただくご質問に対する公式の回答です。
          </p>
          <div className="dense-faq-container">
            {knowledge.faqs.map((faq) => (
              <div className="dense-faq-card" key={faq.id}>
                <div className="dense-faq-q">
                  <span className="faq-id-badge">{faq.id}</span>
                  <h4>{faq.q}</h4>
                </div>
                <div className="dense-faq-a">
                  <span className="a-badge">回答</span>
                  <p>{faq.canonicalGroundingAnswer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* サイドバー（公開データ取得・出典情報） */}
      <aside className="public-company-aside">
        {/* データ取得（機械可読フォーマット） */}
        <div className="registry-card">
          <p className="overline">データ取得</p>
          <h2>公開データ（API / 構造化）</h2>
          <div className="endpoint-list">
            <a className="endpoint-link" href={`/ai/company/${encodeURIComponent(profile.slug)}.json${sample ? "?sample=1" : ""}`}>
              <div>
                <strong>JSON-LD 構造化データ</strong>
                <small>Schema.org 準拠データ</small>
              </div>
              <span>取得 ↗</span>
            </a>
            <a className="endpoint-link" href={`/ai/company/${encodeURIComponent(profile.slug)}.md${sample ? "?sample=1" : ""}`}>
              <div>
                <strong>テキストデータ（Markdown）</strong>
                <small>標準テキスト形式</small>
              </div>
              <span>取得 ↗</span>
            </a>
          </div>
        </div>

        {/* 出典・公式ソース */}
        <div className="registry-card">
          <p className="overline">出典情報</p>
          <h2>確認元ページ一覧</h2>
          <div className="source-list-dense">
            {profile.sourcePages.map((page) => (
              <a key={page.url} href={page.url} target="_blank" rel="noreferrer">
                <strong>{page.title}</strong>
                <span>{decodeURIComponent(page.url)}</span>
              </a>
            ))}
          </div>
        </div>
      </aside>
    </section>

    {/* フッター */}
    <footer className="public-company-footer">
      <div className="shell">
        <p>AIX 公式企業情報台帳 · 登録番号: {knowledge.registryId} · 最終更新: {dateLabel(profile.updatedAt)}</p>
        <p className="disclaimer-text" style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "8px" }}>
          【ご案内】本台帳の記載事項は確認時点における公的登録情報および公式サイトの公開事実に基づきます。最新の受付状況や詳細は公式サイトをご確認ください。
        </p>
      </div>
    </footer>

    {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} /> : null}
  </main>;
}
