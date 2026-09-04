import Link from "next/link";
import { MarketingShell } from "@/components/marketing-shell";
import { ArrowIcon, CheckIcon } from "@/components/icons";

const free = [
  "商品名・会社名1件のAI推薦調査",
  "見込み客の相談質問12問での比較判定",
  "なぜ大手ライバルが選ばれたかの理由特定",
  "大手ライバルの対応できない隙間を分析",
  "AI営業マンに持たせる「自社の看板」の選定",
  "自社サイト改修ゼロでのAI公式台帳発行",
];
const paid = [
  "ユーザー作業は完全ゼロ：URLを入れるだけで、あとは完全放置で自動運用",
  "自社専用の「AI公式台帳Webページ」を常時公開・ホスティング維持（改修工事不要）",
  "毎週ライバルの動向とAI推薦枠の獲得状況を自動追跡・通知",
  "ライバルの急浮上・推薦枠の変動アラート通知",
  "公式台帳（FAQ・強み仕様）の週次定期自動メンテナンス",
  "いつでも管理画面からワンクリック解約可能",
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
        <strong>改修ゼロで「AI公式推薦パス」をネット配備</strong>
        <span>自社サイトの改修やブログ更新はゼロ。AIクローラーが直接読み込む公認確定データを配備し、ChatGPTやPerplexityが迷わず御社をおすすめする環境を整えます。</span>
      </article>
      <article>
        <small>その後</small>
        <strong>毎週の自動見守りで推薦状況を追跡</strong>
        <span>AI回答の更新やライバルの動きを毎週自動で追跡し、自社がおすすめ候補に入り続けているかを監視します。</span>
      </article>
    </div>
    {/* 公式特別優待制度（費用を抑えたい方へ） */}
    <div className="pricing-special-offers" style={{ margin: "40px 0 20px", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", borderRadius: "12px", padding: "32px 28px", color: "#ffffff", border: "1px solid #334155" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <span style={{ fontSize: "0.72rem", fontWeight: 800, background: "#f59e0b", color: "#0f172a", padding: "2px 8px", borderRadius: "4px" }}>
          公式特別優待制度
        </span>
        <h3 style={{ fontSize: "1.2rem", margin: 0, color: "#ffffff" }}>
          月額費用を抑えたい方へ。成果報告や仲間紹介で大幅割引
        </h3>
      </div>
      <p style={{ margin: "0 0 24px", fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.6 }}>
        AIXは営業マンを雇わずに、ユーザーの皆様の口コミと推薦実績で広がっています。以下の優待をご利用いただくことで、定期見守りプランをお得に開始・継続いただけます。
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
            <strong style={{ fontSize: "1rem", color: "#38bdf8" }}>① X（旧Twitter）成果報告シェア割</strong>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4ade80", background: "rgba(74,222,128,0.15)", padding: "2px 6px", borderRadius: "4px" }}>初月 50% OFF</span>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.55, margin: "0 0 12px" }}>
            「AI公式推薦パス」の配備状況をXでご報告いただくと、定期見守りプランの初月料金が半額（10,780円 ➔ 5,390円）になります。
          </p>
          <small style={{ color: "#94a3b8", fontSize: "0.72rem" }}>※無料診断の結果画面からワンクリックで適用可能です。</small>
        </div>

        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
            <strong style={{ fontSize: "1rem", color: "#fbbf24" }}>② 経営者仲間・同業への紹介割</strong>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#facc15", background: "rgba(250,204,21,0.15)", padding: "2px 6px", borderRadius: "4px" }}>双方 ずっと割引</span>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.55, margin: "0 0 12px" }}>
            お知り合いの経営者様や士業・店舗仲間に専用リンクを共有し、仲間がAIXをご利用されると、双方の月額利用料が永年割引（毎月2,000円引き）となります。
          </p>
          <small style={{ color: "#94a3b8", fontSize: "0.72rem" }}>※診断結果画面および管理画面から専用リンクを発行できます。</small>
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
