import { BRAND } from "@/lib/brand";
import { siteUrl } from "@/lib/site";

const organizationId = `${siteUrl}/#organization`;
const description = "購入前の重要な質問で自社が候補から落ちていないか、AIが公式情報と違う説明をしていないか、競合・参照元に変化がないかを継続監視するAI購買監査サービスです。";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: BRAND.name,
      alternateName: BRAND.nameJa,
      url: siteUrl,
      description,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: BRAND.name,
      alternateName: BRAND.nameJa,
      description,
      inLanguage: "ja-JP",
      publisher: { "@id": organizationId },
    },
  ],
};

function serialize(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function StructuredData() {
  return <script id="rovan-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(structuredData) }} />;
}
