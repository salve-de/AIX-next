import { PageShell } from "@/components/ui";

export const metadata = { title: "AIXSignalBot" };

export default function BotPage() {
  return <PageShell><section className="public-page"><div className="container"><p className="kicker"><span/>AIXSIGNALBOT</p><h1>公開Webを、少数ページだけ読む。</h1><p className="lead">AIXSignalBotは、企業が入力したURLの市場・商品・競合・Evidenceを理解するために、同一Domain内の公開ページを優先順位付きで取得します。</p><div className="public-body"><h2>User-Agent</h2><p><code>AIXSignalBot/1.0 (+https://your-domain.example/bot)</code></p><h2>遵守すること</h2><p>robots.txt、同一Origin、ページ数・応答サイズ・Timeout上限を守ります。ログイン、Paywall、内部IP、Cloud metadata、認証情報付きURLへはアクセスしません。</p><h2>拒否方法</h2><pre>{`User-agent: AIXSignalBot\nDisallow: /`}</pre><h2>問い合わせ</h2><p>正式公開時に運営法人の連絡先と停止・訂正窓口を掲載します。</p></div></div></section></PageShell>;
}
