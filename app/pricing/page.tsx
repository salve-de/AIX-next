import Link from "next/link";
import { MarketingShell } from "@/components/marketing-shell";
import { ArrowIcon, CheckIcon } from "@/components/icons";

const free = [
  "社名・URL 1件のAI推薦状況の実測調査",
  "見込み客の相談質問 12問での勝敗比較",
  "大手ライバルが優先された判定理由の特定",
  "大手の隙間を突く「自社の看板」の選定",
  "自社サイト改修ゼロでのAI参照インデックス発行",
];
const paid = [
  "自社専用「AI参照インデックス」の常時公開・ホスティング維持（改修工事不要）",
  "主要AIの推薦枠とライバル動向を毎週自動追跡・通知",
  "競合の急浮上・推薦順位の変動アラート",
  "AI参照インデックス（強み仕様・FAQ）の定期自動メンテナンス",
  "社長の手間ゼロ：URLを入力した後は完全放置で自走運用",
  "契約期間の縛りなし：いつでも管理画面からワンクリック解約",
];

export default function PricingPage() {
  return <MarketingShell
    eyebrow="料金プラン"
    title="営業マンを雇う前に。AI新時代に取り残されないための投資。"
    lead="月30万円以上の営業人件費や、成果の出ない高額SEOに頼る時代は終わりました。URLや社名を入れるだけで、あとは完全放置。自社サイト改修ゼロで、AIから推薦されやすい専属窓口を即座に自動配備・自動運用します。"
  >
    <div className="pricing-compare" aria-label="料金比較">
      <div className="pricing-plan pricing-free">
        <header>
          <p>無料診断</p>
          <strong>¥0</strong>
          <span>まずは現状の推薦状況を確認</span>
        </header>
        <ul>{free.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul>
        <Link className="button button-secondary" href="/#scan">まずは無料で診断する <ArrowIcon /></Link>
      </div>
      <div className="pricing-plan pricing-paid">
        <header>
          <p>AI推薦・自動見守りプラン</p>
          <strong>¥10,780 <small>/月・税込</small></strong>
          <span>（税別 ¥9,800）専属営業マン代わりとして</span>
        </header>
        <ul>{paid.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul>
        <Link className="button button-primary" href="/#scan">無料診断から始める <ArrowIcon /></Link>
        <small className="pricing-plan-note">無料診断の結果画面から、いつでもワンクリックで開始できます。無理な自動課金はありません。</small>
      </div>
    </div>
    <div className="pricing-value-strip" aria-label="使うと得られるもの">
      <article>
        <small>いま</small>
        <strong>AI新時代の機会損失と自社の強みが分かる</strong>
        <span>ライバルが対応しきれない隙間を見つけ、AIが御社を推薦しやすくなる看板を確定します。</span>
      </article>
      <article>
        <small>次に</small>
        <strong>改修ゼロで「AI参照インデックス」をネット配備</strong>
        <span>自社サイトの改修やブログ更新はゼロ。AIクローラーが直接読み込む客観構造化データを配備し、ChatGPTやPerplexityが迷わず御社をおすすめ候補として認識する環境を整えます。</span>
      </article>
      <article>
        <small>その後</small>
        <strong>毎週の自動見守りで推薦状況を追跡</strong>
        <span>AI回答の更新やライバルの動きを毎週自動で追跡し、自社がおすすめ候補に入り続けているかを監視します。</span>
      </article>
    </div>
    {/* 公式特別優待制度（費用を抑えたい方へ） */}
    <div className="pricing-special-offers" style={{ margin: "40px 0 20px", background: "#ffffff", borderRadius: "8px", padding: "32px 28px", color: "#0f172a", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <span style={{ fontSize: "0.72rem", fontWeight: 700, background: "#f1f5f9", color: "#0f172a", border: "1px solid #e2e8f0", padding: "2px 8px", borderRadius: "3px" }}>
          公式特別優待制度
        </span>
        <h3 style={{ fontSize: "1.2rem", margin: 0, color: "#0f172a" }}>
          月額費用を抑えたい方へ。成果報告や仲間紹介で大幅割引
        </h3>
      </div>
      <p style={{ margin: "0 0 24px", fontSize: "0.85rem", color: "#475569", lineHeight: 1.6 }}>
        Rovanは営業マンを雇わずに、ユーザーの皆様の口コミと推薦実績で広がっています。以下の優待をご利用いただくことで、定期見守りプランをお得に開始・継続いただけます。
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
            <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>① X（旧Twitter）成果報告シェア割</strong>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "2px 6px", borderRadius: "3px" }}>初月 50% OFF</span>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#475569", lineHeight: 1.6, margin: "0 0 12px" }}>
            「AI公式推薦パス」の配備状況をXでご報告いただくと、定期見守りプランの初月料金が半額（10,780円 ➔ 5,390円）になります。
          </p>
          <small style={{ color: "#64748b", fontSize: "0.72rem" }}>※無料診断の結果画面からワンクリックで適用可能です。</small>
        </div>

        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
            <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>② 経営者仲間・同業への紹介割</strong>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f172a", background: "#f1f5f9", border: "1px solid #e2e8f0", padding: "2px 6px", borderRadius: "3px" }}>双方 ずっと割引</span>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#475569", lineHeight: 1.6, margin: "0 0 12px" }}>
            お知り合いの経営者様や士業・店舗仲間に専用リンクを共有し、仲間がRovanをご利用されると、双方の月額利用料が永年割引（毎月2,000円引き）となります。
          </p>
          <small style={{ color: "#64748b", fontSize: "0.72rem" }}>※診断結果画面および管理画面から専用リンクを発行できます。</small>
        </div>
      </div>
    </div>

    <section className="pricing-explanation">
      <h2>なぜ営業マンを雇うより効果的なのか</h2>
      <p>
        顧客の購買行動は「Google検索で比べる」ことから「ChatGPT等のAIに直接相談する」ことへと急速に移行しています。<br />
        営業マンが足で稼ぐよりも、顧客がAIに「おすすめの会社は？」と聞いた瞬間に御社が推薦候補に入る方が、確度の高い相談につながりやすくなります。<br />
        月30万円以上の人件費をかけることなく、月額わずか9,800円（税別）で24時間働くAI営業窓口が手に入ります。
      </p>
      <div className="pricing-steps">
        <div><strong>1</strong><span>URL・社名を入力</span><p>手入力はこれだけ。即時AI診断</p></div>
        <div><strong>2</strong><span>台帳自動開設</span><p>完全放置でAI専属窓口を配備</p></div>
        <div><strong>3</strong><span>全自動見守り</span><p>気に入ったら継続。毎週自動追跡</p></div>
      </div>
    </section>
    <section className="pricing-note">
      <h2>ご契約について</h2>
      <p>無料診断から勝手に有料課金されることは一切ありません。有料プランの開始前に料金と更新条件を明示し、解約や領収書の発行は世界標準の決済システム（Stripe）の管理画面からいつでもご自身でワンクリックで完了できます。</p>
      <p>本サービスはAI上での絶対的な順位や推薦、売上を保証するものではありません。公開情報と客観的な観測データに基づき、誠実な比較結果と改善のアドバイスをお届けします。</p>
    </section>
  </MarketingShell>;
}
