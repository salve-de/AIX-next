import { BRAND } from "@/lib/brand";
import { siteUrl } from "@/lib/site";

const organizationId = `${siteUrl}/#organization`;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: BRAND.name,
      alternateName: BRAND.nameJa,
      url: siteUrl,
      description: "AI回答と公開情報を同じ条件で確認し、参照元付きの情報整理を支援するサービス。",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: BRAND.name,
      alternateName: BRAND.nameJa,
      description: "指定した質問・AI・日時の観測結果と、公開情報の整理案を提供するサービス。",
      inLanguage: "ja-JP",
      publisher: { "@id": organizationId },
    },
  ],
};

function serialize(value: unknown) {
  // Keep any future environment-derived values from closing the script element.
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function StructuredData() {
  return <script id="rovan-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(structuredData) }} />;
}
