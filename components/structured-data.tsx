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
      description: "大手に埋もれず、御社の専門性でAIのおすすめ獲得を目指す。自社サイト改修なしで、公開情報の整備と継続測定を支援するサービス。",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: BRAND.name,
      alternateName: BRAND.nameJa,
      description: "URLまたは社名から、AI推薦の現状診断・参照元付きの公開情報の整備・継続測定まで。御社の専門性で推薦候補に入ることを目指すサービス。",
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
