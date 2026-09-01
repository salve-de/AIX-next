import Link from "next/link";
import { Brand } from "@/components/brand";

export function SiteFooter() {
  return <footer className="site-footer"><div className="shell footer-grid"><div><Brand /><p>AIがベンダーを比較する瞬間を、監査可能な購買インテリジェンスへ。</p></div><nav aria-label="製品"><strong>Product</strong><Link href="/result?sample=1">サンプル結果</Link><Link href="/watch?sample=1">Watchサンプル</Link><Link href="/pricing">料金</Link></nav><nav aria-label="信頼"><strong>Trust</strong><Link href="/methodology">測定方法</Link><Link href="/privacy">プライバシー</Link><Link href="/terms">利用規約</Link></nav><div className="footer-meta"><span>© 2026 AIX</span><span>株式会社ジュジュベコンサルティング</span></div></div></footer>;
}
