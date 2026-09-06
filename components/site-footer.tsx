import Link from "next/link";
import { Brand } from "@/components/brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Brand />
          <p>サイト改修ゼロで24時間働くAI専属営業窓口を配備し、AI新時代における生成AIからの正確な参照・推薦を支援するシステムです。</p>
        </div>
        <nav aria-label="製品">
          <strong>製品</strong>
          <Link href="/result?sample=1">結果の例</Link>
          <Link href="/watch?sample=1">推薦の変化</Link>
          <Link href="/pricing">料金</Link>
          <Link href="/methodology">調べ方</Link>
        </nav>
        <nav aria-label="サポート">
          <strong>サポート</strong>
          <Link href="/privacy">プライバシー</Link>
          <Link href="/terms">利用規約</Link>
          <Link href="/commerce">特商法表記</Link>
          <Link href="/data-rights">データ管理</Link>
          <Link href="/partners">パートナー制度</Link>
          <Link href="/support">お問い合わせ</Link>
        </nav>
        <div className="footer-meta">
          <span>© 2026 Rovan</span>
        </div>
      </div>
      <div className="shell" style={{ borderTop: "1px solid var(--line, #e2e8f0)", paddingTop: "16px", marginTop: "24px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <p style={{ fontSize: "0.75rem", color: "var(--muted, #64748b)", lineHeight: 1.6, margin: 0 }}>
          ※ ChatGPTはOpenAI OpCo, LLC、GeminiはGoogle LLC、PerplexityはPerplexity AI, Inc.、ClaudeはAnthropic PBCの商標または登録商標です。当サービスは各社との提携、公認、推奨関係を示すものではありません。
        </p>
        <p style={{ fontSize: "0.75rem", color: "var(--muted, #64748b)", lineHeight: 1.6, margin: 0 }}>
          ※ 本サービスは、生成AIの探索ロボットが参照しやすい公開仕様データおよび客観的分析を提供するものであり、外部AIにおける特定の回答結果や推薦順位を永続的または絶対的に保証するものではありません。
        </p>
      </div>
    </footer>
  );
}
