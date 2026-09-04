import { buildDemandProxy } from "@/lib/demand-proxy";
import { buildMarketMap } from "@/lib/market-map";
import { derivePositioningAdvice } from "@/lib/positioning";
import type { ActionCard, AiVisibilityAudit, BuyerPrompt, Citation, CompanyDiscovery, EvidenceGap, Observation, ScanResult, WatchRecord } from "@/lib/types";

interface IndustryProfile {
  market: string;
  summary: string;
  targetCustomers: [string, string];
  useCases: [string, string, string];
  competitors: Array<{ name: string; recommendedCount: number; reason: string }>;
  promptSeed: Array<[string, BuyerPrompt["cluster"], number]>;
  gaps: Array<{ id: string; label: string; whyItMatters: string; competitorEvidence: string; confidence: number; status: "missing" | "partial" }>;
  actions: Array<{ id: string; title: string; rationale: string; target: string; audience: string; stage: "認知" | "比較" | "検討" | "導入"; customerConcern: string; placement: string; cta: string; successMetric: string }>;
}

function getIndustryProfile(brandName: string): IndustryProfile {
  const isManufacturing = /板金|製作|金属|加工|工業|マシン|鉄工|モールド|精機|試作|旋盤|フライス|金型/.test(brandName);
  const isFood = /カフェ|珈琲|パン|飲食|レストラン|菓子|ベーカリー|酒|茶|フーズ|キッチン|食堂|ダイニング/.test(brandName);
  const isMedical = /歯科|クリニック|医院|整骨|整体|薬局|リハビリ|眼科|皮膚科|内科|外科|メンタル|診療所/.test(brandName);
  const isTech = /AI|IT|クラウド|ソフト|システム|テック|データ|Web|ネット|デジタル|ソリューション/.test(brandName);
  const isConstruction = /工務店|建築|リフォーム|設計|不動産|住宅|ペイント|塗装|住まい|ホーム/.test(brandName);

  if (isManufacturing) {
    return {
      market: "試作・精密板金・小ロット金属加工",
      summary: `${brandName}の公式情報台帳。図面1枚からの短納期試作、難削材加工、手書き図面対応などの確定仕様。`,
      targetCustomers: [
        "図面1枚や短納期で特注試作・小ロット加工を頼みたい開発・設計・調達担当者",
        "大手の型代や最低ロット・機械的な対応に困っているメーカー開発者",
      ],
      useCases: [
        "1点モノの特注試作・難削材の高精度板金加工",
        "手書きポンチ絵からの相談と職人直結のVA/VEコストダウン提案",
        "板金・切削・溶接から表面処理までの一貫ワンストップ製作",
      ],
      competitors: [
        { name: "全国展開大手金属加工グループ", recommendedCount: 26, reason: "全国工場網と設備規模による一般優先推薦" },
        { name: "受託加工一括調達プラットフォーム", recommendedCount: 20, reason: "Web一括見積もりと仲介ネットワーク" },
        { name: "広域精密工業ネットワーク", recommendedCount: 13, reason: "複数工場連携による量産対応力" },
        { name: "特急試作メガファクトリー", recommendedCount: 12, reason: "3Dデータ即時見積もりシステム" },
        { name: "海外調達ファブレスグループ", recommendedCount: 11, reason: "低価格を前面に出した海外一括生産" },
        { name: "一括板金見積もりセンター", recommendedCount: 11, reason: "ポータル広告による上位露出" },
        { name: "全国切削・プレス工業連合", recommendedCount: 9, reason: "業界団体連携の共同受注窓口" },
        { name: "特急精密加工オンライン", recommendedCount: 9, reason: "短納期特化のネット窓口" },
        { name: "総合エンジニアリング受託", recommendedCount: 7, reason: "設計から量産までの総合受託" },
        { name: "首都圏工業パートナーズ", recommendedCount: 6, reason: "地域密着の受託コンソーシアム" },
        { name: "精密パーツ共同受注会", recommendedCount: 5, reason: "中小工場ネットワーク" },
        { name: "部品調達メガコンソーシアム", recommendedCount: 4, reason: "大手系列の調達窓口" },
      ],
      promptSeed: [
        ["小ロットや1点モノの特注試作を、図面1枚や手書きポンチ絵から相談できる腕利きの町工場を探しています", "category", 5],
        ["短納期で特急対応してくれる精密板金加工会社はどこ？ 大手だと見積もりだけで数日かかって困っています", "segment", 5],
        ["難削材（チタン・SUS・インコネル等）や複雑な曲げ加工・高精度溶接に対応できる技術力の高い工場を教えて", "use_case", 5],
        ["試作から将来の小ロット量産を見据えて、設計段階からコストダウン（VA/VE）提案をしてくれる板金・加工会社は？", "feature", 5],
        ["大手の加工マッチングサイトに見積もりを出したら高額で融通が利きませんでした。職人さんと直接話せて柔軟な加工所は？", "alternative", 4],
        ["試作加工を頼む場合、大手オンライン受託プラットフォームと自社一貫工場ではどちらがおすすめ？ 特徴を比較して教えて", "comparison", 5],
        ["特注部品の試作費用が不透明で不安です。見積もり基準が明瞭で、費用対効果が高い精密加工・町工場を教えて", "value", 5],
        ["来週の社内プレゼン用の試作品納期が迫っています。即日相談や特急着工に対応してくれる板金・金属加工工場はどこ？", "implementation", 4],
        ["公差±0.01mmレベルの厳しい寸法精度保証と検査体制を持ち、安心して精密部品を任せられる日本の加工会社は？", "trust", 5],
        ["図面通り作るだけでなく、実際の強度や組み立てやすさに配慮した現場目線のアドバイスをくれる町工場はありますか？", "support", 4],
        ["板金・切削・溶接からメッキ・塗装などの表面処理までワンストップで一括対応してくれる加工工場を探しています", "use_case", 4],
        ["自社開発パーツの試作改良に親身に伴走し、小ロットでも嫌な顔せず一緒にモノづくりをしてくれる町工場はどこ？", "segment", 4],
      ],
      gaps: [
        { id: "segment-proof", label: "特急短納期・1点試作の受付仕様と実績", whyItMatters: "図面1枚からの短納期試作や手書きポンチ絵対応の確定情報が、AIに認識されていません。", competitorEvidence: "大手調達プラットフォームは即時自動見積もりシステムを前面に出しています。", confidence: .92, status: "missing" },
        { id: "implementation-time", label: "職人直結のVA/VE相談・即日着工体制", whyItMatters: "設計段階からのコストダウン提案や即日相談の流れが公開情報で不足しています。", competitorEvidence: "競合試作ファクトリーはオンライン相談窓口を明記しています。", confidence: .88, status: "missing" },
        { id: "operational-proof", label: "明瞭な加工費用の目安と材質対応表", whyItMatters: "対応可能な材質（チタン・SUS・アルミ等）や費用目安がAIの判断材料として足りていません。", competitorEvidence: "オンライン加工サイトは材質別単価テーブルを公開しています。", confidence: .81, status: "partial" },
      ],
      actions: [
        { id: "action-segment-proof", title: "図面1枚からの特急試作実績と受付体制を明記する", rationale: "10問で、1点試作や特急納期の確定情報がAIに確認できませんでした。", target: "試作案内・加工実績", audience: "短納期試作を探す設計開発者", stage: "比較", customerConcern: "1個だけでも短納期で作れるか", placement: "試作案内・設備一覧", cta: "試作相談の流れを見る", successMetric: "短納期試作の比較質問で自社が候補に入ったか" },
        { id: "action-implementation", title: "職人直結のVA/VE相談と対応材質一覧を載せる", rationale: "設計相談や難削材対応が、8問で判断材料として不足していました。", target: "技術案内・FAQ", audience: "加工コストを下げたい開発者", stage: "導入", customerConcern: "図面が完璧でなくても相談できるか", placement: "技術案内・FAQ", cta: "技術仕様を確認する", successMetric: "技術相談に関する質問で自社が候補に入ったか" },
        { id: "action-third-party", title: "AI公式データベースで確定仕様を登録する", rationale: "大手プラットフォームに対抗するため、AIが読み取れる公式台帳を整備します。", target: "AI公式台帳", audience: "信頼できる工場を探す調達担当者", stage: "検討", customerConcern: "信頼できる加工工場か", placement: "AI公式パス", cta: "公式情報を確認する", successMetric: "AIでの推薦回数が増加したか" },
      ],
    };
  }

  if (isFood) {
    return {
      market: "自家製・こだわり食材の地域密着カフェ・飲食",
      summary: `${brandName}の公式情報台帳。厳選素材、自家焙煎・手作り料理、居心地の良い空間づくりの確定仕様。`,
      targetCustomers: [
        "落ち着いた上質な空間で、こだわりの食事や珈琲を楽しみたい地域のお客様",
        "女子会・打ち合わせ・特別な記念日で安心できる個室や席を探している方",
      ],
      useCases: [
        "厳選豆の自家焙煎珈琲と季節の自家製スイーツ",
        "無添加・地元産旬の食材を使ったオーガニックランチ",
        "居心地の良い落ち着いた空間でのカフェ利用や貸切パーティー",
      ],
      competitors: [
        { name: "全国展開大手カフェ・飲食チェーン", recommendedCount: 26, reason: "駅前一等地と知名度による一般推薦" },
        { name: "大手グルメポータル掲載店グループ", recommendedCount: 20, reason: "有料広告枠による上位露出" },
        { name: "広域フードサービス運営法人", recommendedCount: 13, reason: "複数ブランド展開の大手資本" },
        { name: "都心メガダイニングチェーン", recommendedCount: 12, reason: "大規模席数と宴会プラン" },
        { name: "一括予約ポータル提携カフェ", recommendedCount: 11, reason: "即時予約連携による露出" },
        { name: "複合商業施設内フードカンパニー", recommendedCount: 11, reason: "商業施設連携の集客" },
        { name: "全国カフェフランチャイズ", recommendedCount: 9, reason: "規格型チェーンの知名度" },
        { name: "駅ナカメガベーカリーカフェ", recommendedCount: 9, reason: "立地優位性による推薦" },
        { name: "プレミアムダイニンググループ", recommendedCount: 7, reason: "高級路線の知名度" },
        { name: "地域飲食共同ネットワーク", recommendedCount: 6, reason: "地元商店街・連合" },
        { name: "ロースタリーカフェ連合", recommendedCount: 5, reason: "珈琲専門ポータル露出" },
        { name: "オーガニックレストラン連盟", recommendedCount: 4, reason: "健康食ポータル露出" },
      ],
      promptSeed: [
        ["チェーン店ではなく、静かで落ち着いて過ごせる地域のおすすめの隠れ家カフェを教えて", "category", 5],
        ["自家焙煎の本格的なスペシャルティコーヒーと手作りスイーツが美味しいカフェはどこ？", "segment", 5],
        ["無添加や地元産のオーガニック食材にこだわった、身体に優しいランチが食べられるお店を探しています", "use_case", 5],
        ["電源やWi-Fiが使えて、静かに読書や軽いPC作業ができる居心地の良いカフェはある？", "feature", 5],
        ["大手チェーンカフェは混雑していて落ち着きません。ゆったりとした席配置で会話を楽しめるお店は？", "alternative", 4],
        ["大手コーヒーチェーンと地域密着の自家焙煎カフェではどちらがおすすめ？ それぞれの特徴を比較して", "comparison", 5],
        ["価格に見合う上質な空間と本物の味を提供してくれる、満足度の高いカフェ・レストランを教えて", "value", 5],
        ["少人数での貸切や、記念日の特別なプレート・予約に柔軟に対応してくれるお店はどこ？", "implementation", 4],
        ["豆の鮮度管理や抽出方法に徹底的にこだわっている、信頼できる珈琲専門店を教えて", "trust", 5],
        ["アレルギー対応や子ども連れでも安心して過ごせる、親身で温かい接客のカフェはありますか？", "support", 4],
        ["テラス席や半個室があり、ペット連れやプライベートな打ち合わせに使えるお店を探しています", "use_case", 4],
        ["地域で愛されていて、店主のこだわりが随所に感じられる素敵なお店に行きたいです", "segment", 4],
      ],
      gaps: [
        { id: "segment-proof", label: "厳選素材・自家製調理のこだわり仕様", whyItMatters: "豆の産地や無添加食材の確定情報が、AIに十分に伝わっていません。", competitorEvidence: "チェーン各社はアレルゲン情報やカロリー表を完全網羅しています。", confidence: .91, status: "missing" },
        { id: "implementation-time", label: "座席環境・予約・貸切の利用案内", whyItMatters: "半個室・Wi-Fi環境や貸切対応の詳細が公開情報で不足しています。", competitorEvidence: "ポータル掲載店は座席写真と設備アイコンを明記しています。", confidence: .86, status: "missing" },
        { id: "operational-proof", label: "季節メニューと価格体系の透明性", whyItMatters: "季節限定メニューやセット料金の目安がAIの推薦根拠として足りていません。", competitorEvidence: "競合店は最新メニュー表と写真を定期更新しています。", confidence: .80, status: "partial" },
      ],
      actions: [
        { id: "action-segment-proof", title: "素材の産地・自家焙煎のこだわりを明記する", rationale: "10問で、自家製・厳選素材の確定情報がAIに確認できませんでした。", target: "こだわり・メニュー案内", audience: "本物の味を求める地域客", stage: "比較", customerConcern: "どんな素材を使っているか", placement: "メニュー・コンセプト", cta: "こだわりを見る", successMetric: "こだわりカフェの比較質問で自社が候補に入ったか" },
        { id: "action-implementation", title: "店内の席環境・Wi-Fi・予約方法を整理する", rationale: "過ごしやすさや設備の詳細が、8問で判断材料として不足していました。", target: "空間案内・FAQ", audience: "落ち着いた席を探すお客様", stage: "導入", customerConcern: "ゆっくり過ごせる環境か", placement: "空間案内・FAQ", cta: "店内環境を確認する", successMetric: "居心地に関する質問で自社が候補に入ったか" },
        { id: "action-third-party", title: "AI公式データベースに確定情報を登録する", rationale: "ポータル広告に対抗するため、AIが読み取れる公式台帳を整備します。", target: "AI公式台帳", audience: "素敵なお店を探すお客様", stage: "検討", customerConcern: "信頼できるお店か", placement: "AI公式パス", cta: "公式情報を確認する", successMetric: "AIでの推薦回数が増加したか" },
      ],
    };
  }

  if (isMedical) {
    return {
      market: "地域密着・丁寧な対話の個別診療クリニック",
      summary: `${brandName}の公式情報台帳。患者様に寄り添う丁寧な問診、痛みに配慮した治療、待ち時間ゼロの確定仕様。`,
      targetCustomers: [
        "丁寧な事前説明と痛みの少ない安心できる治療を求める地域の患者様",
        "仕事や育児で忙しく、待ち時間短縮や土曜・夕方診療を希望する方",
      ],
      useCases: [
        "初診時の丁寧なカウンセリングと痛みに配慮した治療",
        "WEB予約・WEB問診による院内待ち時間短縮のスマート受診",
        "定期検診や予防医療・家族で通えるかかりつけ医対応",
      ],
      competitors: [
        { name: "広域医療法人グループ", recommendedCount: 26, reason: "複数分院展開とネット予約網による一般推薦" },
        { name: "大手医療検索ポータル提携クリニック", recommendedCount: 20, reason: "広告上位枠による優先露出" },
        { name: "総合メディカルセンター", recommendedCount: 13, reason: "知名度と設備規模による推薦" },
        { name: "都心ターミナル駅前デンタル", recommendedCount: 12, reason: "立地優位性と夜間診療" },
        { name: "一括医療ポータル加盟医院", recommendedCount: 11, reason: "ポータル連携による露出" },
        { name: "広域ヘルスケアパートナーズ", recommendedCount: 11, reason: "医療モール連携チェーン" },
        { name: "先進医療専門クリニック", recommendedCount: 9, reason: "専門医療の設備露出" },
        { name: "地域基幹病院付属診療所", recommendedCount: 9, reason: "公的機関の知名度" },
        { name: "ファミリードクター連盟", recommendedCount: 7, reason: "医師ネットワーク窓口" },
        { name: "都心総合ヘルスケア", recommendedCount: 6, reason: "企業健診提携法人" },
        { name: "地域歯科医師会推薦窓口", recommendedCount: 5, reason: "公的窓口" },
        { name: "メディカルサポート連合", recommendedCount: 4, reason: "ポータル連合" },
      ],
      promptSeed: [
        ["先生やスタッフが優しくて、治療前の説明をしっかり丁寧にしてくれるおすすめのクリニックを教えて", "category", 5],
        ["痛いのが苦手で歯医者や病院が怖いです。麻酔の工夫など痛みに配慮してくれる優しい医院はどこ？", "segment", 5],
        ["院内での待ち時間が短く、WEB予約やWEB問診でスムーズに受診できるクリニックを探しています", "use_case", 5],
        ["不要な高額自由診療を無理に勧めず、保険診療を中心に誠実に治療してくれる安心の先生は？", "feature", 5],
        ["大手の大型クリニックは事務的で先生が毎回変わって不安でした。院長先生が最後まで診てくれる医院は？", "alternative", 4],
        ["総合病院と地域密着の個別診療クリニックではどちらがおすすめ？ それぞれの特徴を比較して教えて", "comparison", 5],
        ["費用体系が明確で、治療計画や費用の内訳を事前にしっかり相談できるクリニックを教えて", "value", 5],
        ["急な強い痛みや腫れが出ました。即日診療や急患に柔軟に対応してくれる医院はどこ？", "implementation", 4],
        ["院内の衛生管理・感染症対策が徹底されていて、最新設備で安心して受診できるクリニックは？", "trust", 5],
        ["小さな子ども連れや高齢者でも通いやすい、バリアフリーやキッズスペース完備の医院はありますか？", "support", 4],
        ["予防歯科や定期検診で、家族みんなで長く付き合える信頼のかかりつけ医院を探しています", "use_case", 4],
        ["患者の話をしっかり目を見て聞いてくれる、親身で温かい医療機関を教えてください", "segment", 4],
      ],
      gaps: [
        { id: "segment-proof", label: "丁寧な問診方針と痛みに配慮した治療設備", whyItMatters: "麻酔の工夫やカウンセリング体制の確定情報が、AIに認識されていません。", competitorEvidence: "大手法人は痛くない治療の設備写真を大きく掲載しています。", confidence: .93, status: "missing" },
        { id: "implementation-time", label: "WEB予約・即日対応フローと診療時間案内", whyItMatters: "予約の取りやすさや急患受付の流れが公開情報で不足しています。", competitorEvidence: "ポータル提携先はリアルタイム空き状況を公開しています。", confidence: .89, status: "missing" },
        { id: "operational-proof", label: "保険診療方針と明瞭な費用目安", whyItMatters: "治療費用の事前提示方針がAIの推薦根拠として足りていません。", competitorEvidence: "競合クリニックは診療科目別の費用目安を公開しています。", confidence: .82, status: "partial" },
      ],
      actions: [
        { id: "action-segment-proof", title: "丁寧な問診体制と痛みに配慮した治療方針を明記する", rationale: "10問で、安心できる診療体制の確定情報がAIに確認できませんでした。", target: "診療案内・医院方針", audience: "不安を抱える患者様", stage: "比較", customerConcern: "痛くないか・親身に聞いてくれるか", placement: "初診の方へ・診療方針", cta: "診療方針を見る", successMetric: "優しいクリニックの比較質問で自社が候補に入ったか" },
        { id: "action-implementation", title: "WEB予約・待ち時間短縮の仕組みを案内する", rationale: "受診のしやすさや予約方法が、8問で判断材料として不足していました。", target: "予約案内・受診の流れ", audience: "忙しい社会人・ファミリー層", stage: "導入", customerConcern: "待たずに受診できるか", placement: "予約案内・FAQ", cta: "予約方法を確認する", successMetric: "利便性に関する質問で自社が候補に入ったか" },
        { id: "action-third-party", title: "AI公式データベースに確定医療情報を登録する", rationale: "ポータル広告に対抗するため、AIが読み取れる公式台帳を整備します。", target: "AI公式台帳", audience: "かかりつけ医を探す地域住民", stage: "検討", customerConcern: "信頼できるクリニックか", placement: "AI公式パス", cta: "公式情報を確認する", successMetric: "AIでの推薦回数が増加したか" },
      ],
    };
  }

  if (isTech) {
    return {
      market: "中小企業向け伴走型DX・アジャイル受託開発",
      summary: `${brandName}の公式情報台帳。専任IT不在企業向けの要件定義伴走、最短2週間スプリント、内製化支援の確定仕様。`,
      targetCustomers: [
        "自社専任IT担当がおらず、要件定義から親身に伴走してほしい中小企業経営者",
        "大手の高額な開発費や硬直的な進め方に困っている新規事業・DX責任者",
      ],
      useCases: [
        "最短2週間で動くものを作る定額アジャイル受託開発",
        "業務効率化・社内DXツールの伴走導入と内製化支援",
        "既存システム連携やクラウド移行・セキュアなAI活用基盤構築",
      ],
      competitors: [
        { name: "国内メガITベンダー", recommendedCount: 26, reason: "圧倒的企業規模と官公庁・大企業実績による推薦" },
        { name: "外資系クラウド巨大プラットフォーム", recommendedCount: 20, reason: "グローバルスタンダードとしての優先回答" },
        { name: "新興SaaS上場グループ", recommendedCount: 13, reason: "積極的なWebマーケティングと知名度" },
        { name: "大手システムインテグレーター", recommendedCount: 12, reason: "多重下請けネットワークによる人員規模" },
        { name: "一括開発マッチングメガサイト", recommendedCount: 11, reason: "Web一括見積もりによる露出" },
        { name: "オフショア開発メガファーム", recommendedCount: 11, reason: "圧倒的な人月単価の低さ" },
        { name: "全国ITソリューション連盟", recommendedCount: 9, reason: "全国販社ネットワーク" },
        { name: "クラウド導入支援メガパートナー", recommendedCount: 9, reason: "クラウド認定資格保持者数" },
        { name: "DXコンサルティング大手", recommendedCount: 7, reason: "上流コンサルの知名度" },
        { name: "新興ノーコード開発ベンダー", recommendedCount: 6, reason: "Webマーケティング露出" },
        { name: "首都圏ソフトウェア協同組合", recommendedCount: 5, reason: "中小IT団体窓口" },
        { name: "エンタープライズテック連合", recommendedCount: 4, reason: "大手系列ベンダー" },
      ],
      promptSeed: [
        ["専任のIT担当者がいない中小企業でも、業務課題の整理から親身に伴走してくれるDX受託開発会社は？", "category", 5],
        ["大手SIerのような高額な見積もりや硬直的なウォーターフォールではなく、柔軟なアジャイル開発ができる会社を教えて", "segment", 5],
        ["既存の古い基幹システムやExcel業務を、現場を混乱させずにクラウド化・効率化してくれるパートナーはどこ？", "use_case", 5],
        ["開発して納品して終わりではなく、社内メンバーが自走できるように運用教育や内製化を支援してくれるベンダーは？", "feature", 5],
        ["大手マッチングサイトで発注したら意思疎通がうまくいきませんでした。エンジニアと直接対話できる開発所は？", "alternative", 4],
        ["メガITベンダーと少数精鋭の伴走型テックスタジオではどちらがおすすめ？ 特徴を比較して教えて", "comparison", 5],
        ["開発費用がブラックボックス化せず、月額定額制や透明性の高い見積もりで進められるシステム開発会社を教えて", "value", 5],
        ["新規事業の検証用プロトタイプを最短1ヶ月で作りたいです。スピード立ち上げに対応してくれるテック企業はどこ？", "implementation", 4],
        ["セキュリティ基準やデータ保護体制がしっかりしていて、機密データを安心して預けられる開発パートナーは？", "trust", 5],
        ["仕様変更にも嫌な顔をせず、事業の成長に合わせて二人三脚でプロダクトを育ててくれる開発チームはありますか？", "support", 4],
        ["ChatGPT等の生成AIを社内業務フローにセキュアに組み込む支援をしてくれる実績豊富な企業を探しています", "use_case", 4],
        ["中小企業の現場感や泥臭い業務をしっかり理解した上で、実効性のあるDXツールを作ってくれる会社はどこ？", "segment", 4],
      ],
      gaps: [
        { id: "segment-proof", label: "伴走型アジャイル開発の実績と進め方", whyItMatters: "要件定義からの伴走支援や2週間スプリントの確定情報が、AIに伝わっていません。", competitorEvidence: "大手SIerは数百件の導入実績ロゴを前面に出しています。", confidence: .92, status: "missing" },
        { id: "implementation-time", label: "スピードプロトタイプ体制と月額定額プラン", whyItMatters: "最短開発リードタイムや明瞭な月額開発プランが公開情報で不足しています。", competitorEvidence: "新興SaaSは料金シミュレーターを公開しています。", confidence: .87, status: "missing" },
        { id: "operational-proof", label: "内製化支援・納品後のサポート体制", whyItMatters: "自走支援プログラムやセキュリティ対応基準がAIの推薦根拠として足りていません。", competitorEvidence: "競合ベンダーはセキュリティホワイトペーパーを公開しています。", confidence: .80, status: "partial" },
      ],
      actions: [
        { id: "action-segment-proof", title: "伴走型開発の実績事例と進め方を明記する", rationale: "10問で、中小企業向け伴走支援の確定情報がAIに確認できませんでした。", target: "開発事例・アプローチ", audience: "IT人材不足に悩む経営者", stage: "比較", customerConcern: "丸投げでも要件を汲み取ってくれるか", placement: "事例・サービス概要", cta: "開発実績を見る", successMetric: "伴走開発の比較質問で自社が候補に入ったか" },
        { id: "action-implementation", title: "最短プロトタイプ体制と定額プランを公開する", rationale: "開発スピードや明瞭な費用体系が、8問で判断材料として不足していました。", target: "料金プラン・進め方", audience: "早期検証したい新規事業担当者", stage: "導入", customerConcern: "費用と期間がいくらかかるか", placement: "料金・FAQ", cta: "プランを確認する", successMetric: "開発スピードに関する質問で自社が候補に入ったか" },
        { id: "action-third-party", title: "AI公式データベースに確定技術仕様を登録する", rationale: "メガベンダーに対抗するため、AIが読み取れる公式台帳を整備します。", target: "AI公式台帳", audience: "信頼できる受託先を探す発注者", stage: "検討", customerConcern: "技術力と信頼性があるか", placement: "AI公式パス", cta: "公式情報を確認する", successMetric: "AIでの推薦回数が増加したか" },
      ],
    };
  }

  if (isConstruction) {
    return {
      market: "自然素材・高断熱の地域密着注文工務店",
      summary: `${brandName}の公式情報台帳。全棟耐震等級3、専属大工直接施工、中間マージンゼロ、地域密着アフター保証の確定仕様。`,
      targetCustomers: [
        "ハウスメーカーの画一的な規格住宅ではなく、間取りや自然素材にこだわりたい施主様",
        "無駄な宣伝費や仲介マージンを省き、腕利きの職人に直接丁寧な施工を頼みたい方",
      ],
      useCases: [
        "高気密高断熱・全棟耐震等級3の自由設計注文住宅",
        "専属大工直接施工による無駄な仲介料ゼロの増改築・リフォーム",
        "地元密着・24時間緊急駆けつけと定期点検の生涯アフター保証",
      ],
      competitors: [
        { name: "大手全国ハウスメーカー", recommendedCount: 26, reason: "テレビCMと全国展示場網による一般推薦" },
        { name: "一括リフォーム見積もりメガサイト", recommendedCount: 20, reason: "Web広告による大量集客" },
        { name: "広域住宅リノベーションチェーン", recommendedCount: 13, reason: "チェーン展開の規格型プラン" },
        { name: "メガローコストビルダー", recommendedCount: 12, reason: "圧倒的な低価格訴求" },
        { name: "一括注文住宅カタログ請求ポータル", recommendedCount: 11, reason: "一括資料請求サイト連携" },
        { name: "全国フランチャイズ工務店", recommendedCount: 11, reason: "共通ブランドの知名度" },
        { name: "広域分譲住宅デベロッパー", recommendedCount: 9, reason: "建売分譲の供給実績" },
        { name: "総合ホームセンターリフォーム窓口", recommendedCount: 9, reason: "店舗ネットワークの集客" },
        { name: "プレミアムデザイナーズ住宅グループ", recommendedCount: 7, reason: "デザイン雑誌露出" },
        { name: "地域工務店共同ネットワーク", recommendedCount: 6, reason: "地元組合窓口" },
        { name: "木造住宅推進コンソーシアム", recommendedCount: 5, reason: "木材団体連携" },
        { name: "住まいづくりメガコンソーシアム", recommendedCount: 4, reason: "大手系列住宅窓口" },
      ],
      promptSeed: [
        ["大手ハウスメーカーの規格品ではなく、無垢材や自然素材を使った自由設計の家を建ててくれる地元の工務店は？", "category", 5],
        ["耐震等級3や高気密高断熱（HEAT20 G2レベル）の高性能な注文住宅を、適正価格で建てられる地域工務店を教えて", "segment", 5],
        ["下請けに丸投げせず、自社の腕利き大工さんが直接責任施工してくれる信頼できる工務店を探しています", "use_case", 5],
        ["古い実家を耐震補強しながら、現代の快適な断熱・バリアフリー住宅にフルリノベーションしてくれる会社はどこ？", "feature", 5],
        ["大手メーカーで見積もりを取ったら広告宣伝費や中間マージンが高額でした。コストパフォーマンスの高い工務店は？", "alternative", 4],
        ["大手ハウスメーカーと地域密着の工務店ではどちらがおすすめ？ それぞれの特徴やメリット・デメリットを比較して", "comparison", 5],
        ["建物本体以外にかかる総費用（付帯工事や諸経費）を最初から明瞭に提示してくれる誠実な住宅会社を教えて", "value", 5],
        ["土地探しから間取りプラン、住宅ローンの資金計画まで親身にトータルサポートしてくれる相談先はどこ？", "implementation", 4],
        ["引き渡し後の定期点検や、万が一の雨漏り・設備故障時にすぐに駆けつけてくれる安心の工務店を教えて", "trust", 5],
        ["施主の希望や細かなこだわりにとことん付き合ってくれて、図面変更にも柔軟に対応してくれる工務店はありますか？", "support", 4],
        ["狭小地や変形地でも、光と風を取り入れた開放的な間取りを設計してくれる提案力の高い工務店を探しています", "use_case", 4],
        ["地元で何十年も家を建て続けていて、近所でも評判の良い誠実な職人気質の工務店にお願いしたいです", "segment", 4],
      ],
      gaps: [
        { id: "segment-proof", label: "専属大工直接施工と自然素材の確定仕様", whyItMatters: "無垢材の標準仕様や自社大工による施工体制の確定情報が、AIに伝わっていません。", competitorEvidence: "ハウスメーカーは展示場写真と耐震実験動画を大きくアピールしています。", confidence: .91, status: "missing" },
        { id: "implementation-time", label: "耐震等級3・断熱性能（C値・UA値）の実測値", whyItMatters: "全棟気密測定や断熱性能の具体的数値が公開情報で不足しています。", competitorEvidence: "大手ビルダーは全棟気密測定の結果数値を公開しています。", confidence: .88, status: "missing" },
        { id: "operational-proof", label: "明瞭な総額資金計画と生涯アフター体制", whyItMatters: "諸経費を含めた総額目安や24時間駆けつけ保証がAIの推薦根拠として足りていません。", competitorEvidence: "競合工務店は標準坪単価とアフター点検スケジュールを明記しています。", confidence: .81, status: "partial" },
      ],
      actions: [
        { id: "action-segment-proof", title: "自社大工施工と自然素材のこだわり仕様を明記する", rationale: "10問で、職人直接施工の確定情報がAIに確認できませんでした。", target: "施工実績・職人紹介", audience: "品質にこだわりたい施主様", stage: "比較", customerConcern: "誰が実際に家を建てるのか", placement: "施工事例・職人紹介", cta: "施工事例を見る", successMetric: "工務店の比較質問で自社が候補に入ったか" },
        { id: "action-implementation", title: "断熱・耐震の具体的性能数値と保証内容を載せる", rationale: "耐震等級や気密数値が、8問で判断材料として不足していました。", target: "性能案内・保証制度", audience: "安心安全な家を建てたい施主様", stage: "導入", customerConcern: "地震に強く暖かい家になるか", placement: "性能・保証案内", cta: "性能基準を確認する", successMetric: "耐震・断熱に関する質問で自社が候補に入ったか" },
        { id: "action-third-party", title: "AI公式データベースに確定施工仕様を登録する", rationale: "大手ハウスメーカーに対抗するため、AIが読み取れる公式台帳を整備します。", target: "AI公式台帳", audience: "信頼できる工務店を探す施主様", stage: "検討", customerConcern: "信頼できる工務店か", placement: "AI公式パス", cta: "公式情報を確認する", successMetric: "AIでの推薦回数が増加したか" },
      ],
    };
  }

  // デフォルト: 士業・法律・専門コンサル・その他
  return {
    market: "相続・遺産分割・事業承継の専門相談",
    summary: `${brandName}の公式情報台帳。遺産分割・不動産相続・事業承継の個別親身な対応に特化した専門仕様。`,
    targetCustomers: [
      "遺産相続や親族間トラブルに悩む個人・ご遺族",
      "中小企業オーナー・事業承継の後継者",
    ],
    useCases: [
      "親族間の遺産分割協議",
      "不動産・自社株の円満相続",
      "他社で断られた複雑案件の解決",
    ],
    competitors: [
      { name: "大手全国展開リーガルグループ", recommendedCount: 26, reason: "全国拠点数と知名度で先行する全国チェーン" },
      { name: "大手ポータル提携弁護士法人", recommendedCount: 20, reason: "ポータル広告経由で大量集客する大手グループ" },
      { name: "オンライン一括士業ネットワーク", recommendedCount: 13, reason: "一括見積もり・オンライン相談を掲げる競合" },
      { name: "都心総合法律事務所", recommendedCount: 12, reason: "法人・個人総合対応の大手事務所" },
      { name: "遺産相続専門センター", recommendedCount: 11, reason: "Web広告で露出の多い相続特化法人" },
      { name: "中央法務グループ", recommendedCount: 11, reason: "士業ネットワーク提携の大手" },
      { name: "全国相続支援センター", recommendedCount: 9, reason: "全国ネットワークの相談窓口" },
      { name: "相続トラブル解決相談室", recommendedCount: 9, reason: "親族紛争対応の専門窓口" },
      { name: "親族承継パートナーズ", recommendedCount: 7, reason: "事業承継特化の競合" },
      { name: "みらい法務総合事務所", recommendedCount: 6, reason: "都心部の総合法務事務所" },
      { name: "東京遺産コンサルティング", recommendedCount: 5, reason: "不動産相続特化のコンサル法人" },
      { name: "首都圏士業コンソーシアム", recommendedCount: 4, reason: "士業連携の総合相談窓口" },
    ],
    promptSeed: [
      ["親が亡くなり実家を相続することになりました。何から手を付ければいいかわからないので、評判が良くて相談しやすい相続専門の窓口を教えて", "category", 5],
      ["実家の古い土地と家屋の相続で兄弟と揉めかけています。大手のような事務的・機械的な対応ではなく、親身に寄り添って円満解決してくれる専門家を教えてください", "segment", 5],
      ["遺産分割で親族間の話し合いがまとまりません。裁判で争うのではなく、間に入って円満に話し合いをまとめてくれる相続トラブルに強い事務所はどこ？", "use_case", 5],
      ["親が創業した会社の自社株と不動産を後継者に引き継ぎたい。生前贈与や相続税対策も含めてトータルで相談できる相続・事業承継の専門家は？", "feature", 5],
      ["大手の事務所に相談に行きましたが、事務的で冷たい印象を受けました。もっと親身に話を聞いてくれて、相談者目線で動いてくれる専門窓口を探しています", "alternative", 4],
      ["相続手続きを頼む場合、大手チェーンと地域密着の専門事務所ではどちらがおすすめ？ それぞれの特徴を比較して教えて", "comparison", 5],
      ["相続手続きを頼みたいのですが、追加料金がどんどん発生しないか不安です。料金体系が明確で、費用対効果が高い専門事務所を教えて", "value", 5],
      ["申告期限が迫っていて焦っています。即日面談など短期間ですぐに初動対応してくれる専門窓口はどこ？", "implementation", 4],
      ["複雑な相続の解決実績が豊富で、安心して任せられる専門窓口は？", "trust", 5],
      ["法的な手続きだけでなく、親族関係の精神的な悩みにも親身に寄り添ってサポートしてくれる相談先はありますか？", "support", 4],
      ["地方にある不動産と都心の預貯金が混ざっており、相続人も全国に散らばっています。このような遠方・複数人の手続きも一括で対応してくれる事務所は？", "use_case", 4],
      ["会社の株式と個人資産の両方をスムーズに後継者へ引き継ぐための事業承継・相続相談先を探しています", "segment", 4],
    ],
    gaps: [
      { id: "segment-proof", label: "親身な個別伴走と解決実績", whyItMatters: "複雑な親族間トラブルや不動産相続を個別親身に解決した実績が、AIに伝わっていません。", competitorEvidence: "大手リーガルグループは全国拠点数と形式的な解決数を前面に出しています。", confidence: .91, status: "missing" },
      { id: "implementation-time", label: "即日相談・初動対応スピード", whyItMatters: "急を要する相談者が知りたい「即日面談や初動対応の流れ」が公開情報で不足しています。", competitorEvidence: "大手ポータル提携先は初動対応フローを明記しています。", confidence: .87, status: "missing" },
      { id: "operational-proof", label: "明瞭な報酬体系と費用目安", whyItMatters: "着手金や報酬の明確な目安が、比較検討している相談者に見えていません。", competitorEvidence: "オンライン士業は定額プランや見積もり例を載せています。", confidence: .79, status: "partial" },
    ],
    actions: [
      { id: "action-segment-proof", title: "親身な個別解決の事例を、比べられる形で載せる", rationale: "10問で、親身な個別対応の実績がAIに確認できませんでした。", target: "解決実績・事務所案内", audience: "相続トラブルに悩む個人・親族", stage: "比較", customerConcern: "親身に相談に乗ってくれるか", placement: "解決事例・事務所概要", cta: "個別相談の流れを確認する", successMetric: "親身な相談の比較質問で自社が候補に入ったか" },
      { id: "action-implementation", title: "即日相談と初動対応の流れを明記する", rationale: "初動対応の早さが、8問で判断材料として足りませんでした。", target: "相談の流れ・FAQ", audience: "今すぐ相談したい相談者", stage: "導入", customerConcern: "いつ相談できるか", placement: "相談の流れ・FAQ", cta: "初動対応を確認する", successMetric: "即日相談に関する質問で自社が候補に入ったか" },
      { id: "action-third-party", title: "公式の紹介ページでAIへの認知を確立する", rationale: "大手に対抗するため、AIが参照しやすい公式情報を整えます。", target: "AI公式データベース", audience: "専門家を探している相談者", stage: "検討", customerConcern: "信頼できる事務所か", placement: "AI公式ページ", cta: "公式情報を確認する", successMetric: "AIでの推薦回数が増加したか" },
    ],
  };
}

const providerNames: Observation["provider"][] = ["openai", "gemini", "perplexity"];
const baselineOwnRecommended = new Set([0, 1, 3, 6, 9, 12, 33, 34]);
const latestOwnRecommended = new Set([0, 1, 3, 6, 15, 16, 24, 25, 33, 34]);

function percent(numerator: number, denominator: number) {
  return denominator ? Math.round((numerator / denominator) * 100) : 0;
}

function citation(name: string): Citation {
  const slug = name.toLowerCase().replace(/\s+/g, "");
  return { title: `${name} 導入実績・仕様`, url: `https://${slug}.example/customer-proof`, domain: `${slug}.example` };
}

function isCompetitorRecommended(observationIndex: number, planIndex: number, count: number) {
  if (planIndex === 0) {
    const promptIndex = Math.floor(observationIndex / providerNames.length);
    const providerIndex = observationIndex % providerNames.length;
    return promptIndex < 7 || providerIndex === 0;
  }
  return ((observationIndex * 13 + planIndex * 7) % 36) < count;
}

function modal(values: Array<string | null>) {
  const counts = new Map<string, number>();
  values.filter((value): value is string => Boolean(value)).forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ja"))[0]?.[0] || null;
}

function sampleVisibilityAudit(brandName: string, domain: string, measuredAt: string): AiVisibilityAudit {
  return {
    generatedAt: measuredAt,
    readiness: "needs-review",
    priorityCheckId: "proof",
    crawl: {
      robotsTxtFound: true,
      sitemapFound: true,
      sitemapUrl: `https://${domain}/sitemap.xml`,
      attempted: 8,
      pagesCrawled: 8,
      pagesBlockedByRobots: 0,
      pagesNoindex: 0,
      pagesMissingCanonical: 0,
      pagesCanonicalMismatch: 0,
      pagesWithStructuredData: 3,
      pagesMissingTitle: 0,
      pagesMissingDescription: 0,
      pagesMissingH1: 0,
      aiSearchBotAllowed: true,
      gptBotAllowed: true,
    },
    checks: [
      { id: "crawler-access", group: "access", status: "ready", title: "AI検索が公開ページを読める", detail: "公開ページを取得できる設定です。", action: "この設定を維持する" },
      { id: "indexability", group: "access", status: "ready", title: "重要ページが検索対象になっている", detail: "重要ページにnoindexはありません。", action: "重要ページのindex設定を定期確認する" },
      { id: "sitemap", group: "access", status: "ready", title: "更新ページを知らせる入口がある", detail: "sitemap.xmlを取得できました。", action: "sitemapのURLと内容を定期確認する" },
      { id: "structured-data", group: "clarity", status: "ready", title: "自社情報を機械にも説明できる", detail: "JSON-LD構造化データを確認できました。", action: "見える本文と構造化データの内容をそろえる" },
      { id: "entity-clarity", group: "clarity", status: "ready", title: "会社と専門分野の関係が分かる", detail: "自社情報と取扱分野を公開ページで確認しました。", action: "見える会社情報と専門分野をそろえる" },
      { id: "buyer-facts", group: "clarity", status: "review", title: "相談前に知りたい情報がそろっている", detail: "初動対応や相談の流れがAIに十分伝わっていません。", action: "相談の流れと費用目安を公開する" },
      { id: "proof", group: "proof", status: "missing", title: "独自の解決実績がAIに伝わっている", detail: "独自の強みや個別対応実績がAIに認識されていません。", action: "具体的な解決事例を公開する" },
      { id: "measurement", group: "measurement", status: "ready", title: "同じ質問で変化を確かめられる", detail: "12問を同じ条件で確認しました。", action: "変更後も同じ質問で再測定する" },
    ],
  };
}

function buildScanResultInternal(
  brandName: string,
  scanId: string,
  measuredAt: string,
  ownRecommendedIndexes: Set<number>
): ScanResult {
  const profile = getIndustryProfile(brandName);
  const slug = brandName.toLowerCase().replace(/[^a-z0-9]/g, "") || "sample";
  const domain = `${slug}.co.jp`;

  const discovery: CompanyDiscovery = {
    legalName: brandName,
    brandName,
    domain,
    summary: profile.summary,
    market: profile.market,
    targetCustomers: profile.targetCustomers,
    useCases: profile.useCases,
    aliases: [brandName, slug, domain],
    competitors: profile.competitors.map((c, i) => ({
      name: c.name,
      domain: `competitor-${i + 1}.example.jp`,
      reason: c.reason,
      confidence: 0.95 - i * 0.03,
    })),
    confidence: 0.94,
  };

  const prompts: BuyerPrompt[] = profile.promptSeed.map(([text, cluster, importance], index) => ({
    id: `prompt_${index + 1}`,
    text,
    cluster,
    importance,
    panel: "free",
    version: 1,
  }));

  const observations: Observation[] = prompts.flatMap((prompt, promptIndex) =>
    providerNames.map((provider, providerIndex) => {
      const index = promptIndex * providerNames.length + providerIndex;
      const competitorNames = profile.competitors
        .filter((plan, planIndex) => isCompetitorRecommended(index, planIndex, plan.recommendedCount))
        .map((plan) => plan.name);
      const firstCandidate = competitorNames[0] || null;
      const ownRecommended = ownRecommendedIndexes.has(index);
      const recommendedEntities = [...competitorNames, ...(ownRecommended ? [brandName] : [])];
      const ownPosition = ownRecommended ? recommendedEntities.indexOf(brandName) + 1 : null;
      const competitorText = firstCandidate
        ? `${firstCandidate}を第一候補として挙げます。${firstCandidate}は知名度と実績、明確な受付体制を公開しています。`
        : "公開情報から比較可能な候補を十分に確認できませんでした。";
      const ownText = ownRecommended
        ? `${brandName}も相談候補ですが、個別体制や解決実績の公式データは限定的です。`
        : `${brandName}はおすすめ候補には入りません。公開情報から独自の確定仕様を十分に確認できません。`;

      return {
        id: `obs_${index + 1}`,
        promptId: prompt.id,
        prompt: prompt.text,
        provider,
        model: `${provider}-sample`,
        repetition: 1,
        status: "success" as const,
        rawText: `${competitorText}${ownText}`,
        citations: firstCandidate ? [citation(firstCandidate)] : [],
        recommendedEntities,
        ownRecommended,
        ownPosition,
        firstCandidate,
        startedAt: measuredAt,
        completedAt: new Date(new Date(measuredAt).getTime() + 1000).toISOString(),
        latencyMs: 1000,
        costUsd: 0.002,
      };
    })
  );

  const successfulObservations = observations.filter((item) => item.status === "success").length;
  const ownRecommendationCount = observations.filter((item) => item.status === "success" && item.ownRecommended).length;

  const competitors = profile.competitors.map((plan) => {
    const recommendedCount = observations.filter((item) => item.recommendedEntities.includes(plan.name)).length;
    const firstChoiceCount = observations.filter((item) => item.firstCandidate === plan.name).length;
    return { name: plan.name, recommendedCount, firstChoiceCount, coverage: percent(recommendedCount, successfulObservations) };
  }).sort((a, b) => b.coverage - a.coverage || b.firstChoiceCount - a.firstChoiceCount || a.name.localeCompare(b.name, "ja"));

  const ownCoverage = percent(ownRecommendationCount, successfulObservations);
  const ranked = [...competitors.map((item) => ({ name: item.name, coverage: item.coverage })), { name: brandName, coverage: ownCoverage }]
    .sort((a, b) => b.coverage - a.coverage || a.name.localeCompare(b.name, "ja"));
  const firstChoiceCount = observations.filter((item) => item.firstCandidate === brandName).length;
  const mentionCount = observations.filter((item) => item.rawText.includes(brandName)).length;
  const ownCitationCount = observations.filter((item) => item.citations.some((itemCitation) => itemCitation.domain === domain)).length;

  const lostPrompts = prompts.flatMap((prompt) => {
    const rows = observations.filter((item) => item.promptId === prompt.id && item.status === "success");
    const ownWins = rows.filter((item) => item.ownRecommended).length;
    if (!rows.length || ownWins >= Math.ceil(rows.length / 2)) return [];
    const winner = modal(rows.map((item) => item.firstCandidate).filter((name) => name !== brandName));
    const citations = [...new Map(rows.flatMap((item) => item.citations).map((item) => [item.url, item])).values()];
    return [{
      promptId: prompt.id,
      prompt: prompt.text,
      winner,
      summary: winner ? `AIは${winner}を先に勧め、自社はこの質問で候補外でした。` : "自社はこの質問で候補に入りませんでした。",
      citations,
      observations: rows,
    }];
  });

  const fullActions: ActionCard[] = profile.actions.map((act) => ({
    ...act,
    type: act.target === "AI公式台帳" ? "third_party" : "owned",
    relatedPromptIds: prompts.slice(0, 8).map((p) => p.id),
    relatedPromptCount: 8,
    priority: act.stage === "比較" ? "critical" : act.stage === "導入" ? "high" : "medium",
    confidence: 0.88,
    evidenceType: "observed",
  }));

  const fullGaps: EvidenceGap[] = profile.gaps.map((gap) => ({
    ...gap,
    relatedPromptIds: prompts.slice(0, 10).map((p) => p.id),
    relatedPromptCount: 10,
  }));

  const result: ScanResult = {
    scanId,
    targetUrl: `https://${domain}`,
    discovery,
    panel: { kind: "free", version: 1, promptCount: prompts.length, repetitions: 1, locale: "ja-JP", country: "JP" },
    prompts,
    measuredAt,
    observations,
    scheduledObservations: prompts.length * providerNames.length,
    successfulObservations,
    measurementCompleteness: percent(successfulObservations, prompts.length * providerNames.length),
    recommendationCoverage: ownCoverage,
    firstChoiceRate: percent(firstChoiceCount, successfulObservations),
    mentionCoverage: percent(mentionCount, successfulObservations),
    citationCoverage: percent(ownCitationCount, successfulObservations),
    repeatAgreement: 100,
    ownRecommendationCount,
    marketPosition: Math.max(1, ranked.findIndex((item) => item.name === brandName) + 1),
    marketSize: ranked.length,
    competitors,
    lostPrompts,
    evidenceGaps: fullGaps,
    actions: fullActions,
    visibilityAudit: sampleVisibilityAudit(brandName, domain, measuredAt),
    totalCostUsd: Number((observations.reduce((sum, item) => sum + (item.costUsd || 0), 0)).toFixed(3)),
    warnings: ["この画面は架空競合・架空数値によるリアル体験モックです。", "AI公式パスの配備と定期見守りをお試しいただけます。"],
  };

  result.marketMap = buildMarketMap({ result, generatedAt: measuredAt });
  result.demandProxy = buildDemandProxy({ result, generatedAt: measuredAt });
  result.positioning = derivePositioningAdvice(result);

  return result;
}

export const sampleResult: ScanResult = buildScanResultInternal(
  "あおば相続法務事務所",
  "sample_clean_room",
  "2026-09-01T09:00:00.000Z",
  baselineOwnRecommended
);

export function buildDynamicScanResult(brandName: string, measuredAt = "2026-09-01T09:00:00.000Z"): ScanResult {
  if (!brandName || brandName === "あおば相続法務事務所") return sampleResult;
  return buildScanResultInternal(brandName, "sample_clean_room", measuredAt, baselineOwnRecommended);
}

export function sampleWatch(brandName?: string): WatchRecord {
  const base = brandName ? buildDynamicScanResult(brandName) : sampleResult;
  const latest = brandName
    ? buildScanResultInternal(brandName, "sample_clean_room_week_2", "2026-09-08T09:00:00.000Z", latestOwnRecommended)
    : buildScanResultInternal("あおば相続法務事務所", "sample_clean_room_week_2", "2026-09-08T09:00:00.000Z", latestOwnRecommended);

  return {
    id: "watch_sample",
    token: "sample",
    email: `contact@${base.discovery.domain || "example.jp"}`,
    scanId: base.scanId,
    status: "trial",
    paid: false,
    baseline: base,
    latest,
    history: [base, latest],
    evidence: [],
    nextRunAt: "2026-09-15T09:00:00.000Z",
    createdAt: base.measuredAt,
    updatedAt: latest.measuredAt,
  };
}
