import Link from "next/link";
import { Brand } from "@/components/brand";

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="shell footer-grid">
      <div>
        <Brand />
        <p>AIの比較で自社が外れる質問を見つけ、直す内容と改善後の変化まで確認するB2B向け診断サービス。</p>
      </div>
      <nav aria-label="製品">
        <strong>Product</strong>
        <Link href="/result?sample=1">サンプル結果</Link>
        <Link href="/watch?sample=1">継続モニタリング</Link>
        <Link href="/pricing">料金</Link>
        <Link href="/methodology">測定方法</Link>
      </nav>
      <nav aria-label="信頼・サポート">
        <strong>Trust</strong>
        <Link href="/support">サポート</Link>
        <Link href="/privacy">プライバシー</Link>
        <Link href="/terms">利用規約</Link>
        <Link href="/commerce">特商法表記</Link>
        <Link href="/data-rights">データ管理</Link>
      </nav>
      <div className="footer-meta"><span>© 2026 AIX</span><span>株式会社ジュジュベコンサルティング</span></div>
    </div>
  </footer>;
}
