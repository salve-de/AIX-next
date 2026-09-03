import { ArrowIcon, EvidenceIcon, TrendIcon } from "@/components/icons";

export function ProductOutputPreview() {
  return <figure className="demo-window" aria-label="AIX診断結果の架空サンプル">
    <header className="demo-window-bar"><span className="window-dots"><i /><i /><i /></span><strong>集客機会レポート</strong><small>診断結果の例</small></header>
    <div className="demo-window-toolbar"><div><small>対象サイト</small><strong>NEXORA Cloud</strong></div><span>購入前の比較質問を12件確認</span></div>
    <div className="demo-outcome"><div><small>AIの候補に入った質問</small><strong>12問中 <b>2問</b></strong><span>競合に流れた質問を特定</span></div><p>AIはNEXORA Cloudより先にTrustOrbitを勧めました。どの顧客の比較で負けたか、理由と最初の改善機会を示します。</p></div>
    <div className="demo-metrics"><div><small>自社が候補に入った質問</small><strong>2 / 12</strong></div><div><small>先に選ばれた競合</small><strong>TrustOrbit <em>7 / 12</em></strong></div><div className="demo-negative"><small>取り戻す余地</small><strong>10 / 12</strong></div></div>
      <div className="demo-result-grid"><div className="demo-question"><small>顧客がAIに聞いた比較質問</small><h3>「従業員300名の企業に合う取引先審査ツールは？」</h3><div className="demo-winner-row"><span>先に選ばれた競合<strong>TrustOrbit</strong></span><span>自社<strong className="demo-lost">候補外</strong></span></div><p>TrustOrbitには同じ規模の導入事例がありました。NEXORA Cloudでは確認できませんでした。</p></div><div className="demo-next"><div><EvidenceIcon /><span><small>競合が選ばれた理由</small><strong>同規模企業の導入実績</strong></span></div><div><TrendIcon /><span><small>集客の改善機会</small><strong>導入事例を比べられる形にする</strong></span><ArrowIcon /></div></div></div>
  </figure>;
}

export function ProductProcessVisual() {
  const steps = [
    { label: "01", title: "対象を入力する", body: "会社名・商品名・URLから公開情報を整理" },
    { label: "02", title: "負けている比較を特定", body: "AIが先に勧めた競合を確認" },
    { label: "03", title: "選ばれた理由を比べる", body: "集客を逃している情報の差を確認" },
    { label: "04", title: "次の施策を決める", body: "1か所を見直し、同じ質問で再確認" },
  ];
  return <ol className="process-visual">{steps.map((step) => <li key={step.label}><span>{step.label}</span><h3>{step.title}</h3><p>{step.body}</p></li>)}</ol>;
}

export function WatchTrendVisual() {
  return <figure className="watch-demo-window" aria-label="競合から取り返せたかの架空サンプル">
    <header><strong>集客機会の変化</strong><span>改善後の結果</span></header>
    <div className="watch-demo-rank"><small>自社が候補に入った質問</small><strong><span>2問</span><ArrowIcon /><b>4問</b></strong><p>同じ比較質問を再確認</p></div>
    <div className="watch-demo-rows"><div><span>候補に入った質問</span><strong>2　→　4</strong></div><div><span>まだ競合が先の質問</span><strong>10　→　8</strong></div><div><span>新しく参照されたページ</span><strong>+3</strong></div></div>
    <footer><TrendIcon /><span><small>取り戻せた比較</small><strong>2つの質問で、自社が新しく候補に入りました</strong></span></footer>
  </figure>;
}
