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
      description: "自社サイト改修ゼロで、御社の強みを伝えるAI推薦データを配備。AIからの推薦獲得に向けて、競合診断と毎週の自動見守りを行うシステムです。",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: BRAND.name,
      alternateName: BRAND.nameJa,
      description: "自社サイトの改修・新規開設は不要。社名からAI推薦の現状を診断し、御社の強みを伝えるAI推薦データを作成。公開後の推薦状況を毎週追跡します。",
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
