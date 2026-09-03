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
      description: "会社名・サービス名・商品名・URLから、AIが競合を先に勧めた購入前の質問と、その理由、最初に直す情報を確認するサービス。",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "AIX",
      description: "AIが競合を先に勧めた質問と、その理由、まず直す1か所を会社名やURLから確認します。",
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
