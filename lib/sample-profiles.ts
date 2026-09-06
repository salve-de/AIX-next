import type { PublicProfile } from "@/lib/types";

const SAMPLE_DATE = "2026-09-01T09:00:00.000Z";

type SampleInput = Pick<PublicProfile, "slug" | "brandName" | "targetUrl" | "market" | "summary" | "targetCustomers" | "useCases" | "facts">;

function makeSampleProfile(input: SampleInput): PublicProfile {
  const sourcePages = [{
    url: input.targetUrl,
    title: `${input.brandName} 参照元（設計見本）`,
    description: "実在の事業者情報を示すものではない、画面確認用の架空データです。",
  }];
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: input.brandName,
    url: input.targetUrl,
    description: input.summary,
    knowsAbout: [input.market],
    inLanguage: "ja-JP",
  }, null, 2);
  const json = JSON.stringify({
    recordVersion: "1",
    publisher: "Rovan",
    sample: true,
    subject: { name: input.brandName, sourceUrl: input.targetUrl },
    summary: input.summary,
    market: input.market,
    targetCustomers: input.targetCustomers,
    useCases: input.useCases,
    facts: input.facts,
    sourcePages,
    updatedAt: SAMPLE_DATE,
  }, null, 2);
  const markdown = [
    `# ${input.brandName} 公開情報参照ページ（設計見本）`,
    "",
    "> これは画面確認用の架空データです。実在の企業情報・推薦結果ではありません。",
    "",
    "## 概要",
    "",
    input.summary,
    "",
    "## 分野",
    "",
    input.market,
    "",
    "## 公開されている情報",
    "",
    ...input.facts.map((fact) => `- **${fact.label}**: ${fact.value}`),
    "",
    "## 参照元",
    "",
    `- [${input.targetUrl}](${input.targetUrl})`,
    "",
  ].join("\n");

  return {
    id: `sample_${input.slug}`,
    slug: input.slug,
    status: "published",
    title: `${input.brandName} 公開情報参照ページ（設計見本）`,
    brandName: input.brandName,
    targetUrl: input.targetUrl,
    summary: input.summary,
    market: input.market,
    targetCustomers: input.targetCustomers,
    useCases: input.useCases,
    facts: input.facts,
    sourcePages,
    structuredData: `${structuredData}\n`,
    markdown,
    json: `${json}\n`,
    createdAt: SAMPLE_DATE,
    updatedAt: SAMPLE_DATE,
    expiresAt: "2027-09-01T09:00:00.000Z",
    publishedAt: SAMPLE_DATE,
  };
}

const SAMPLE_PROFILES: Record<string, PublicProfile> = {
  "aoba-souzoku": makeSampleProfile({
    slug: "aoba-souzoku",
    brandName: "あおば相続法務事務所",
    targetUrl: "https://aoba-souzoku.example.jp",
    market: "相続・遺産分割・事業承継の法務相談",
    summary: "相続・遺産分割・事業承継を扱う法務事務所の公開情報整理例です。ここに表示される内容は画面確認用の架空データです。",
    targetCustomers: ["相続や遺産分割について相談先を探している方"],
    useCases: ["相続に関する初回相談", "遺産分割に関する相談", "事業承継に関する相談"],
    facts: [
      { label: "分野", value: "相続・遺産分割・事業承継の法務相談", sourceUrl: "https://aoba-souzoku.example.jp" },
      { label: "掲載区分", value: "設計見本（架空データ）", sourceUrl: "https://aoba-souzoku.example.jp" },
    ],
  }),
  "aoba-cafe": makeSampleProfile({
    slug: "aoba-cafe",
    brandName: "青葉カフェ",
    targetUrl: "https://aoba-cafe.example.com",
    market: "自家焙煎・スペシャリティ珈琲・スイーツ",
    summary: "自家焙煎珈琲店の公開情報整理例です。ここに表示される内容は画面確認用の架空データです。",
    targetCustomers: ["作業や読書ができるカフェを探している方", "自家焙煎珈琲を楽しみたい方"],
    useCases: ["店内での作業・読書", "テイクアウト", "コーヒー豆の購入"],
    facts: [
      { label: "分野", value: "自家焙煎・スペシャリティ珈琲・スイーツ", sourceUrl: "https://aoba-cafe.example.com" },
      { label: "掲載区分", value: "設計見本（架空データ）", sourceUrl: "https://aoba-cafe.example.com" },
    ],
  }),
  "yamada-bankin": makeSampleProfile({
    slug: "yamada-bankin",
    brandName: "山田板金製作所",
    targetUrl: "https://yamada-bankin.example.jp",
    market: "試作板金・精密金属加工",
    summary: "試作板金事業者の公開情報整理例です。ここに表示される内容は画面確認用の架空データです。",
    targetCustomers: ["小ロットの試作先を探している設計・開発担当者"],
    useCases: ["単品・小ロット試作", "3D CADデータを使った加工相談"],
    facts: [
      { label: "分野", value: "試作板金・精密金属加工", sourceUrl: "https://yamada-bankin.example.jp" },
      { label: "掲載区分", value: "設計見本（架空データ）", sourceUrl: "https://yamada-bankin.example.jp" },
    ],
  }),
  "azumino-sunshine": makeSampleProfile({
    slug: "azumino-sunshine",
    brandName: "安曇野サンシャイン果樹園",
    targetUrl: "https://azumino-sunshine.example.jp",
    market: "果樹栽培・産直ギフト",
    summary: "果樹園の公開情報整理例です。ここに表示される内容は画面確認用の架空データです。",
    targetCustomers: ["産地からのギフトを探している方"],
    useCases: ["果物の産地直送", "贈答用ギフトの注文"],
    facts: [
      { label: "分野", value: "果樹栽培・産直ギフト", sourceUrl: "https://azumino-sunshine.example.jp" },
      { label: "掲載区分", value: "設計見本（架空データ）", sourceUrl: "https://azumino-sunshine.example.jp" },
    ],
  }),
  "nexora-cloud": makeSampleProfile({
    slug: "nexora-cloud",
    brandName: "Nexora Cloud",
    targetUrl: "https://nexora-cloud.example.com",
    market: "法人向けクラウド業務支援",
    summary: "法人向けクラウドサービスの公開情報整理例です。ここに表示される内容は画面確認用の架空データです。",
    targetCustomers: ["業務向けクラウドサービスを比較している法人担当者"],
    useCases: ["業務データの一元管理", "クラウドサービスの導入比較"],
    facts: [
      { label: "分野", value: "法人向けクラウド業務支援", sourceUrl: "https://nexora-cloud.example.com" },
      { label: "掲載区分", value: "設計見本（架空データ）", sourceUrl: "https://nexora-cloud.example.com" },
    ],
  }),
};

export function getSampleProfile(slug: string) {
  return SAMPLE_PROFILES[slug] || null;
}
