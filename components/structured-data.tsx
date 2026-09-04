import { siteUrl } from "@/lib/site";

const organizationId = `${siteUrl}/#organization`;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: "AIX",
      url: siteUrl,
      description: "自社サイト改修ゼロで24時間働くAI専属営業窓口を配備し、AI新時代における生成AIからの優先推薦を支援するサービス。",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "AIX",
      description: "もう、新しい営業マンを雇う必要はありません。自社サイト改修ゼロ・ブログ更新ゼロでChatGPTなどの生成AIから優先推薦される公式台帳を自動配備するシステム。",
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
  return <script id="aix-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(structuredData) }} />;
}
