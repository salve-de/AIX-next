import Link from "next/link";
import { Brand } from "@/components/brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Brand />
          <p>サイト改修ゼロで24時間働くAI専属営業窓口を配備し、AI新時代における生成AIからの優先推薦を支援するサービスです。</p>
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
          <Link href="/support">お問い合わせ</Link>
        </nav>
        <div className="footer-meta">
          <span>© 2026 AIX</span>
          <span>株式会社ジュジュベコンサルティング</span>
        </div>
      </div>
      <div className="shell" style={{ borderTop: "1px solid var(--line, #e2e8f0)", paddingTop: "16px", marginTop: "24px" }}>
        <p style={{ fontSize: "0.75rem", color: "var(--muted, #64748b)", lineHeight: 1.6, margin: 0 }}>
          ※ ChatGPTはOpenAI OpCo, LLC、GeminiはGoogle LLC、PerplexityはPerplexity AI, Inc.の商標または登録商標です。当サービスは各社との提携、公認、推奨関係を示すものではありません。
        </p>
      </div>
    </footer>
  );
}
