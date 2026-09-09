export function BuyingAuditLandingPreview() {
  const cards = [
    {
      label: "候補落ち",
      value: "4 / 10問",
      detail: "購入に近い質問で、御社より競合が候補に入っている場面を確認。",
      example: "例：『中小企業向けで料金を比較したおすすめは？』",
    },
    {
      label: "AIの誤情報",
      value: "2件",
      detail: "AI回答と公式サイトに明確な食い違いがある場合だけ検出。",
      example: "例：AI『無料体験なし』 / 公式『14日間無料』",
    },
    {
      label: "外部の参照元",
      value: "5ドメイン",
      detail: "AIが重要な購入前質問で参照している外部サイトを確認。",
      example: "古い比較記事や第三者情報の変化も追跡。",
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }} aria-label="AI購買監査で分かること">
      {cards.map((card) => (
        <article key={card.label} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "22px", background: "#fff", boxShadow: "0 2px 10px rgba(15,23,42,.04)" }}>
          <span style={{ display: "block", fontSize: ".72rem", fontWeight: 800, letterSpacing: ".06em", color: "#64748b", marginBottom: "8px" }}>{card.label}</span>
          <strong style={{ display: "block", fontSize: "1.7rem", color: "#0f172a", marginBottom: "10px" }}>{card.value}</strong>
          <p style={{ margin: "0 0 10px", color: "#334155", lineHeight: 1.7, fontSize: ".86rem" }}>{card.detail}</p>
          <small style={{ color: "#64748b", lineHeight: 1.6 }}>{card.example}</small>
        </article>
      ))}
    </div>
  );
}
