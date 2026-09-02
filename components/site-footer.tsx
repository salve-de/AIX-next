import Link from "next/link";
import { Brand } from "@/components/brand";

export function SiteFooter() {
  return <footer className="site-footer"><div className="shell footer-grid"><div><Brand /><p>ChatGPTなどのAI比較で競合に先に選ばれる質問を見つけ、直す内容と改善後の変化まで追う。</p></div><nav aria-label="製品"><strong>Product</strong><Link href="/result?sample=1">診断サンプル</Link><Link href="/watch?sample=1">改善Watchサンプル</Link><Link href="/pricing">料金</Link><Link href="/methodology">測定方法</Link></nav><nav aria-label="信頼"><strong>Trust</strong><Link href="/privacy">プライバシー</Link><Link href="/terms">利用規約</Link><Link href="/commerce">特商法表記</Link><Link href="/data-rights">データ管理</Link><Link href="/support">サポート</Link></nav><div className="footer-meta"><span>© 2026 AIX</span><span>株式会社ジュジュベコンサルティング</span></div></div></footer>;
}
