import Link from "next/link";
import { Brand } from "@/components/brand";

export function SiteFooter({ watchToken = "" }: { watchToken?: string }) {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Brand />
          <p>購入前の重要な質問で、御社が候補から落ちていないか、AIが公式情報と違う説明をしていないか、競合・参照元に変化がないかを継続監視するAI購買監査サービスです。</p>
        </div>
        <nav aria-label="製品">
          <strong>製品</strong>
          <Link href="/result?sample=1">AI購買監査の見本</Link>
          <Link href="/watch?sample=1">Watchの変化の見本</Link>
          <Link href="/login">ログイン</Link>
          <Link href="/manage">管理画面を開く</Link>
          <Link href="/pricing">料金</Link>
          <Link href="/methodology">調べ方</Link>
        </nav>
        <nav aria-label="サポート">
          <strong>サポート</strong>
          <Link href="/privacy">プライバシー</Link>
          <Link href="/terms">利用規約</Link>
          <Link prefetch={false} href={watchToken ? `/data-rights?token=${encodeURIComponent(watchToken)}` : "/data-rights"}>データ管理</Link>
          <Link href="/partners">パートナー制度</Link>
        </nav>
        <div className="footer-meta"><span>© 2026 Rovan</span></div>
      </div>
      <div className="shell" style={{ borderTop: "1px solid var(--line, #e2e8f0)", paddingTop: "16px", marginTop: "24px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <p style={{ fontSize: "0.75rem", color: "var(--muted, #64748b)", lineHeight: 1.6, margin: 0 }}>
          ※ ChatGPTはOpenAI OpCo, LLC、GeminiはGoogle LLC、PerplexityはPerplexity AI, Inc.、ClaudeはAnthropic PBCの商標または登録商標です。当サービスは各社との提携、公認、推奨関係を示すものではありません。
        </p>
        <p style={{ fontSize: "0.75rem", color: "var(--muted, #64748b)", lineHeight: 1.6, margin: 0 }}>
          ※ 指定した質問・AI・日時の観測であり、全利用者の会話、AI内部順位、実際の顧客流出を取得するものではありません。推薦・引用・顧客獲得・売上は保証しません。
        </p>
      </div>
    </footer>
  );
}
