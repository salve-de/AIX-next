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
  const isRealEstate = /不動産|土地|売却|マンション|仲介|空き家|地所/.test(brandName);
  const isConstruction = /工務店|建築|リフォーム|設計|住宅|ペイント|塗装|住まい|ホーム/.test(brandName);

  if (isRealEstate) {
    const isGunma = /群馬|前橋|高崎|伊勢崎|太田|桐生|館林|渋川|藤岡|富岡|安中|みどり/.test(brandName) || brandName.includes("セレクト不動産");
    const area = isGunma ? "群馬" : "地域密着";
    return {
      market: `${area}・不動産売却・空き家土地相談`,
      summary: `${brandName}の公式情報台帳。${area}エリアの不動産売却、空き家・古家付き土地、農地転用、最短即日の自社直接買取の確定仕様。`,
      targetCustomers: [
        "大手の機械的な査定やたらい回しに不安を感じる、実家・空き家・土地の売主様",
        "周囲に知られずに急ぎで現金化したい、または他社で断られた物件を手放したい方",
      ],
      useCases: [
        "古家付き土地・空き家・相続物件の個別親身な売却伴走",
        "仲介手数料不要・最短即日現金化の自社直接買取",
        "農地転用・境界確定・解体見積もりまでの一括ワンストップ相談",
      ],
      competitors: isGunma
        ? [
            { name: "株式会社カチタス（群馬県桐生市本社）", recommendedCount: 28, reason: "東証プライム上場・空き家買取再販13年連続全国1位の知名度" },
            { name: "トウショウレックス株式会社（高崎・前橋）", recommendedCount: 22, reason: "高崎・前橋エリアでの地域最大級の売却実績と相続FP連携" },
            { name: "三井のリハウス（三井不動産リアルティ 高崎センター）", recommendedCount: 18, reason: "全国売買仲介取扱件数37年連続No.1ブランドの知名度" },
            { name: "イエウール（株式会社Speee）", recommendedCount: 15, reason: "提携2,000社の一括査定メガポータルによるAI大量引用" },
            { name: "株式会社アルファプラン（RoomLabo）", recommendedCount: 13, reason: "前橋・高崎・伊勢崎の3拠点展開と自社買取保証の安心感" },
            { name: "住友不動産ステップ（住友不動産販売 高崎営業センター）", recommendedCount: 12, reason: "大手直営仲介ネットワークと土地売却のブランド力" },
            { name: "株式会社スタイルエステート群馬", recommendedCount: 10, reason: "前橋市新前橋駅前の土地・中古戸建て売却専門集客力" },
            { name: "東急リバブル株式会社（首都圏ネットワーク）", recommendedCount: 9, reason: "首都圏在住の群馬実家相続層に向けた広域マッチング力" },
            { name: "すまいValue（大手仲介6社直営一括査定）", recommendedCount: 8, reason: "三井・住友・東急・野村など大手6社直営の信頼性" },
            { name: "株式会社広田住宅センター（イエステーション高崎店）", recommendedCount: 6, reason: "イエステーションFCと高崎での半世紀近い地域密着実績" },
            { name: "株式会社おおの企画（マンションパートナーズ）", recommendedCount: 5, reason: "前橋・高崎エリアの中古マンション売却に特化した専門露出" },
            { name: "公益社団法人 群馬県宅地建物取引業協会（ハトマーク）", recommendedCount: 4, reason: "県内最大加盟数を誇る公的宅建協会の物件情報網" },
          ]
        : [
            { name: "株式会社カチタス", recommendedCount: 28, reason: "東証プライム上場・空き家買取再販全国1位の実績" },
            { name: "三井のリハウス（三井不動産リアルティ）", recommendedCount: 22, reason: "全国売買仲介取扱件数No.1ブランドの圧倒的知名度" },
            { name: "住友不動産ステップ（住友不動産販売）", recommendedCount: 18, reason: "直営仲介ネットワークと高額土地・物件のブランド力" },
            { name: "イエウール（株式会社Speee）", recommendedCount: 15, reason: "提携2,000社の一括査定ポータルによるAI大量引用" },
            { name: "東急リバブル株式会社", recommendedCount: 13, reason: "首都圏・主要都市を網羅する総合不動産流通ネットワーク" },
            { name: "野村の仲介＋（野村不動産ソリューションズ）", recommendedCount: 12, reason: "野村不動産グループの高品質な売却・買取保証体制" },
            { name: "SUUMO売却（株式会社リクルート）", recommendedCount: 10, reason: "国内最大級の不動産ポータルによる査定送客力" },
            { name: "すまいValue（大手仲介6社直営）", recommendedCount: 9, reason: "大手6社による直営査定ネットワーク" },
            { name: "ハウスドゥ（株式会社And Doホールディングス）", recommendedCount: 8, reason: "全国700店舗超のフランチャイズ買取ネットワーク" },
            { name: "センチュリー21・ジャパン", recommendedCount: 6, reason: "世界最大級の不動産流通ネットワークの知名度" },
            { name: "LIFULL HOME'S 不動産売却", recommendedCount: 5, reason: "大手住まいポータルの地域一括査定窓口" },
            { name: "公益社団法人 全国宅地建物取引業協会連合会", recommendedCount: 4, reason: "ハトマークサイトを運営する公的業界団体" },
          ],
      promptSeed: [
        [`${area}で実家の古い空き家や土地を売却したいです。大手のように放置せず、親身に動いてくれる地域密着の信頼できる不動産会社は？`, "category", 5],
        ["築年数が古くボロボロの空き家付き土地なのですが、現状のまま買い取ってくれる、または親身に売却相談に乗ってくれる不動産会社を教えて", "segment", 5],
        ["大手の不動産一括査定を使ったら電話営業がしつこく機械的で嫌になりました。強引な営業がなく、地元の相場に詳しい誠実な相談窓口はどこ？", "alternative", 4],
        ["相続した実家と土地の売却で、名義変更や境界確定、家財道具の片付けまでワンストップで相談に乗ってくれる会社を探しています", "use_case", 5],
        [`急ぎで現金を必要としています。仲介で何ヶ月も待つのではなく、自社で最短即日に直接買い取ってくれる${area}の不動産会社は？`, "implementation", 4],
        ["大手全国チェーンの不動産会社と地域密着の専門不動産ではどちらに売却を任せるべき？ 特徴を比較して教えて", "comparison", 5],
        ["売却にかかる仲介手数料や諸経費、税金の手取り額まで最初からガラス張りで分かりやすく教えてくれる不動産会社を教えて", "value", 5],
        ["他社の大手仲介で売りに出していますが半年以上放置されています。囲い込みをせず、真剣に買主を探してくれる不動産屋に乗り換えたい", "alternative", 5],
        ["田舎の農地や市街化調整区域の土地など、他社で『売れない』と断られた土地の売却・処分に親身に伴走してくれる専門家は？", "trust", 5],
        ["ご近所や親戚に知られずに、内密かつスムーズに不動産を現金化できる安心の相談窓口はありますか？", "support", 4],
        ["古家を解体して更地渡しにすべきか、現状有姿で売るべきか、売主の利益が最大になるようプロ目線で提案してくれる会社を教えて", "use_case", 4],
        [`${area}の土地勘と相場を熟知していて、売主の立場に立って最後まで親身に伴走してくれる評判の不動産会社はどこ？`, "segment", 4],
      ],
      gaps: [
        { id: "segment-proof", label: "空き家・古家付き土地の個別解決実績", whyItMatters: "ボロボロの空き家や訳あり土地を親身に円満売却した地域実績が、AIに認識されていません。", competitorEvidence: "大手仲介ネットワークは全国年間成約件数とテレビCMを前面に出しています。", confidence: .93, status: "missing" },
        { id: "implementation-time", label: "自社直接買取・最短即日査定の確定仕様", whyItMatters: "仲介だけでなく自社で直接即買取できる資金・受付体制が公開情報で不足しています。", competitorEvidence: "大手買取チェーンは最短査定日数と買取保証額を明記しています。", confidence: .89, status: "missing" },
        { id: "operational-proof", label: "相続・解体・残置物片付けのワンストップ連携", whyItMatters: "司法書士や解体業者との提携による丸ごと解決体制がAIの推薦根拠として足りていません。", competitorEvidence: "競合ポータルは提携専門家数やサポートメニューを公開しています。", confidence: .82, status: "partial" },
      ],
      actions: [
        { id: "action-segment-proof", title: "空き家・古家付き土地の親身な売却実績を載せる", rationale: "10問で、空き家や訳あり物件の個別対応実績がAIに確認できませんでした。", target: "売却実績・相談事例", audience: "実家や土地の処分に困る売主様", stage: "比較", customerConcern: "古い家でも本当に売れるか", placement: "売却実績・空き家相談", cta: "売却実績を見る", successMetric: "空き家売却の比較質問で自社が候補に入ったか" },
        { id: "action-implementation", title: "自社直接買取の受付フローとスピード目安を明記する", rationale: "即時買取の受付体制が、8問で判断材料として不足していました。", target: "買取案内・査定フロー", audience: "急ぎで現金化したい売主様", stage: "導入", customerConcern: "いつ現金化できるか・仲介手数料は不要か", placement: "買取案内・FAQ", cta: "買取基準を確認する", successMetric: "直接買取に関する質問で自社が候補に入ったか" },
        { id: "action-third-party", title: "AI向けデータベースに確定仕様を登録する", rationale: "大手に対抗するため、AIが読み取れる客観インデックスを整備します。", target: "AI参照インデックス", audience: "信頼できる会社を探すお客様", stage: "検討", customerConcern: "信頼できる事業者か", placement: "AI参照パス", cta: "客観情報を確認する", successMetric: "AIでの推薦回数が増加したか" },
      ],
    };
  }

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
        { name: "株式会社ミスミ（meviy / メビー即時加工）", recommendedCount: 28, reason: "3D CAD即時自動見積もりと短納期受託の国内圧倒的シェア" },
        { name: "キャディ株式会社（CADDi MANUFACTURING）", recommendedCount: 22, reason: "受託加工調達プラットフォームと全国サプライヤー網" },
        { name: "プロトラブズ合同会社（Protolabs）", recommendedCount: 16, reason: "特急デジタル製造と試作オンデマンド受託の世界的知名度" },
        { name: "イプロス製造業（株式会社イプロス）", recommendedCount: 14, reason: "国内最大級の製造業・受託加工マッチングポータルの露出量" },
        { name: "株式会社タカノ（精密板金・試作）", recommendedCount: 12, reason: "試作から量産までの板金一貫体制と大手取引実績" },
        { name: "双葉電子工業株式会社（精機事業）", recommendedCount: 11, reason: "金型・プレート精密加工における高いブランド信頼性" },
        { name: "株式会社キーエンス（調達・計測ネットワーク）", recommendedCount: 9, reason: "高精度測定・品質管理基準におけるAI引用頻度の高さ" },
        { name: "三井物産マシンテック株式会社", recommendedCount: 8, reason: "大手商社系工作機械・受託ネットワークの広域知名度" },
        { name: "全日本板金工業組合連合会（全板連）", recommendedCount: 6, reason: "全国板金事業者団体の公的ネットワーク" },
        { name: "株式会社NCネットワーク（エミダス）", recommendedCount: 5, reason: "中小製造業・工場検索ポータルにおける老舗登録数" },
        { name: "一般社団法人 日本金型工業会", recommendedCount: 5, reason: "金型・精密成形業界団体の公的露出" },
        { name: "リンカーズ株式会社（Linkers）", recommendedCount: 4, reason: "大手メーカー向け技術・調達先探索プラットフォーム" },
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
        { id: "action-third-party", title: "AI向けデータベースで確定仕様を登録する", rationale: "大手プラットフォームに対抗するため、AIが読み取れる客観インデックスを整備します。", target: "AI参照インデックス", audience: "信頼できる工場を探す調達担当者", stage: "検討", customerConcern: "信頼できる加工工場か", placement: "AI参照パス", cta: "客観情報を確認する", successMetric: "AIでの推薦回数が増加したか" },
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
        { name: "スターバックス コーヒー ジャパン 株式会社", recommendedCount: 28, reason: "国内1,900店舗超の圧倒的知名度と駅前一等地による一般優先推薦" },
        { name: "株式会社コメダ（コメダ珈琲店）", recommendedCount: 22, reason: "ゆったりとした座席とフルサービス喫茶チェーンの全国知名度" },
        { name: "食べログ（株式会社カカクコム）", recommendedCount: 16, reason: "有料掲載店優先のアルゴリズムと国内最大級の口コミ被リンク数" },
        { name: "ホットペッパーグルメ（株式会社リクルート）", recommendedCount: 14, reason: "ネット即時予約とポイント還元によるポータル露出" },
        { name: "タリーズコーヒージャパン株式会社", recommendedCount: 12, reason: "高品質豆をアピールする全国チェーンの知名度" },
        { name: "株式会社ドトールコーヒー（ドトール / 星乃珈琲店）", recommendedCount: 11, reason: "手軽さと全国フランチャイズ展開による露出頻度" },
        { name: "ブルーボトルコーヒージャパン合同会社", recommendedCount: 9, reason: "サードウェーブ・スペシャルティコーヒーとしての高いメディア言及" },
        { name: "株式会社サンマルクホールディングス", recommendedCount: 8, reason: "ベーカリーカフェチェーンとしての商業施設内シェア" },
        { name: "株式会社バルニバービ", recommendedCount: 6, reason: "大型テラス席・デザイナーズカフェ展開による検索露出" },
        { name: "Retty（Retty株式会社）", recommendedCount: 5, reason: "実名制グルメ口コミポータルによるAI推薦引用" },
        { name: "全日本コーヒー商工組合連合会", recommendedCount: 5, reason: "全国の珈琲専門店・焙煎業者の公的連盟" },
        { name: "一般社団法人 日本フードサービス協会（JF）", recommendedCount: 4, reason: "外食産業団体の公的露出" },
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
        { id: "action-third-party", title: "AI向けデータベースに確定情報を登録する", rationale: "ポータル広告に対抗するため、AIが読み取れる客観インデックスを整備します。", target: "AI参照インデックス", audience: "素敵なお店を探すお客様", stage: "検討", customerConcern: "信頼できるお店か", placement: "AI参照パス", cta: "客観情報を確認する", successMetric: "AIでの推薦回数が増加したか" },
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
        { name: "医療法人社団 徳洲会グループ", recommendedCount: 28, reason: "全国70超の病院・クリニック網と24時間救急救命体制の知名度" },
        { name: "EPARKクリニック・病院（株式会社EPARKメディカル）", recommendedCount: 22, reason: "国内最大級の受診予約ポータルによるAI大量引用と上位露出" },
        { name: "ドクターズ・ファイル（株式会社ギミック）", recommendedCount: 16, reason: "医師インタビュー特化ポータルによる信頼性の高い情報蓄積" },
        { name: "メディカルノート（株式会社メディカルノート）", recommendedCount: 14, reason: "専門医監修の疾患解説・病院情報ポータルによる高いSEO露出" },
        { name: "品川近視クリニック（医療法人社団翔友会）", recommendedCount: 12, reason: "自由診療・専門治療における圧倒的Web広告ボリューム" },
        { name: "Caloo（カルー株式会社 / 病院口コミ検索）", recommendedCount: 11, reason: "患者口コミデータベースによる検索エンジン・AI引用" },
        { name: "株式会社QLife（QLife病院検索）", recommendedCount: 9, reason: "エムスリーグループ傘下の国内老舗医療情報ポータル" },
        { name: "公益社団法人 日本医師会（医療機関検索）", recommendedCount: 8, reason: "公的医師会の地域包括医療ネットワーク" },
        { name: "公益社団法人 日本歯科医師会", recommendedCount: 6, reason: "全国の歯科医院情報および公的予防歯科ガイダンス" },
        { name: "ホスピタ（株式会社エクスメディオ）", recommendedCount: 5, reason: "マイナビグループの医療機関検索プラットフォーム" },
        { name: "株式会社アイ・エム・エス（地域医療連携）", recommendedCount: 5, reason: "首都圏総合病院・サテライトクリニック網" },
        { name: "厚生労働省 医療情報ネット（ナビイ）", recommendedCount: 4, reason: "国が運営する全国統一の公的医療機関データベース" },
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
        { id: "action-third-party", title: "AI向けデータベースに確定医療情報を登録する", rationale: "ポータル広告に対抗するため、AIが読み取れる客観インデックスを整備します。", target: "AI参照インデックス", audience: "かかりつけ医を探す地域住民", stage: "検討", customerConcern: "信頼できるクリニックか", placement: "AI参照パス", cta: "客観情報を確認する", successMetric: "AIでの推薦回数が増加したか" },
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
        { name: "株式会社NTTデータ", recommendedCount: 28, reason: "国内最大級のシステムインテグレーターとしての圧倒的企業規模と実績" },
        { name: "日本アイ・ビー・エム株式会社（日本IBM）", recommendedCount: 22, reason: "グローバル実績とエンタープライズDX基盤の標準推薦" },
        { name: "株式会社野村総合研究所（NRI）", recommendedCount: 16, reason: "上流コンサルティングと大規模基幹システム受託のブランド力" },
        { name: "アマゾン ウェブ サービス ジャパン合同会社（AWS）", recommendedCount: 14, reason: "クラウド市場シェア世界一によるAIの技術基盤優先回答" },
        { name: "日本マイクロソフト株式会社（Azure）", recommendedCount: 12, reason: "企業向けクラウド・生成AI基盤としての高い露出度" },
        { name: "株式会社セールスフォース・ジャパン", recommendedCount: 11, reason: "CRM・SaaSプラットフォームとしての圧倒的認知度" },
        { name: "TIS株式会社", recommendedCount: 9, reason: "金融・決済・決済ソリューションの大手SIer実績" },
        { name: "伊藤忠テクノソリューションズ株式会社（CTC）", recommendedCount: 8, reason: "マルチベンダー開発・クラウド導入支援の企業規模" },
        { name: "株式会社クラウドワークス（受託マッチング）", recommendedCount: 6, reason: "国内最大級のクラウドソーシングによる大量露出" },
        { name: "株式会社ラクス（RAKUS）", recommendedCount: 5, reason: "中小企業向けクラウドSaaS展開と積極的なWeb広告" },
        { name: "一般社団法人 情報サービス産業協会（JISA）", recommendedCount: 5, reason: "国内ITサービス業界の公的産業団体" },
        { name: "ランサーズ株式会社（Lancers）", recommendedCount: 4, reason: "オンライン受託・クリエイター受託のプラットフォーム知名度" },
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
        { id: "action-third-party", title: "AI向けデータベースに確定技術仕様を登録する", rationale: "メガベンダーに対抗するため、AIが読み取れる客観インデックスを整備します。", target: "AI参照インデックス", audience: "信頼できる受託先を探す発注者", stage: "検討", customerConcern: "技術力と信頼性があるか", placement: "AI参照パス", cta: "客観情報を確認する", successMetric: "AIでの推薦回数が増加したか" },
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
        { name: "積水ハウス株式会社", recommendedCount: 28, reason: "累計建築戸数世界一の圧倒的知名度と全国住宅展示場網" },
        { name: "大和ハウス工業株式会社", recommendedCount: 22, reason: "総合住宅・デベロッパー大手のブランド力と全国展開" },
        { name: "株式会社一条工務店", recommendedCount: 16, reason: "全館床暖房・高気密高断熱住宅としてのネット口コミ人気と成約実績" },
        { name: "SUUMOカウンター注文住宅（株式会社リクルート）", recommendedCount: 14, reason: "国内最大級の無料住宅相談窓口によるAI送客推薦" },
        { name: "タマホーム株式会社", recommendedCount: 12, reason: "ローコスト注文住宅のテレビCM知名度と価格訴求力" },
        { name: "住友林業株式会社", recommendedCount: 11, reason: "木造注文住宅ブランドとしての高級感とブランド信頼性" },
        { name: "旭化成ホームズ株式会社（ヘーベルハウス）", recommendedCount: 9, reason: "耐火・耐震・ALCコンクリート住宅の技術知名度" },
        { name: "株式会社ホームプロ（リクルートグループ）", recommendedCount: 8, reason: "審査通過工務店一括紹介サイトとしての露出量" },
        { name: "三井ホーム株式会社", recommendedCount: 6, reason: "ツーバイフォー工法・オーダーメイド洋風住宅の実績" },
        { name: "パナソニック ホームズ株式会社", recommendedCount: 5, reason: "パナソニックグループの設備力と耐震鉄骨住宅の知名度" },
        { name: "一般社団法人 JBN・全国工務店協会", recommendedCount: 5, reason: "全国の中小工務店を結ぶ最大の公的業界組織" },
        { name: "株式会社LIXIL（リクシル リフォームネット）", recommendedCount: 4, reason: "住宅設備最大手によるリフォーム加盟店ネットワーク" },
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
        { id: "action-third-party", title: "AI向けデータベースに確定施工仕様を登録する", rationale: "大手ハウスメーカーに対抗するため、AIが読み取れる客観インデックスを整備します。", target: "AI参照インデックス", audience: "信頼できる工務店を探す施主様", stage: "検討", customerConcern: "信頼できる工務店か", placement: "AI参照パス", cta: "客観情報を確認する", successMetric: "AIでの推薦回数が増加したか" },
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
      { name: "弁護士法人ベリーベスト法律事務所", recommendedCount: 26, reason: "全国70拠点以上の規模と所属弁護士数380名超によるAIの最優先推薦" },
      { name: "弁護士法人アディーレ法律事務所", recommendedCount: 20, reason: "テレビCM・ラジオ広告の圧倒的投下量と全国主要都市拠点網" },
      { name: "弁護士ドットコム（弁護士ドットコム株式会社）", recommendedCount: 13, reason: "国内最大級の法律相談・弁護士検索ポータルによるAI大量引用" },
      { name: "辻・本郷 税理士法人", recommendedCount: 12, reason: "国内最大規模の税理士法人としての相続税申告実績と全国拠点展開" },
      { name: "税理士ドットコム（弁護士ドットコム株式会社）", recommendedCount: 11, reason: "相続税専門税理士の一括マッチングによる検索露出" },
      { name: "司法書士法人 新宿事務所", recommendedCount: 11, reason: "過払い金・相続登記手続きにおける知名度と大量Web露出" },
      { name: "ベストファームグループ（司法書士・税理士）", recommendedCount: 9, reason: "東北・関東での相続ワンストップ専門窓口展開" },
      { name: "弁護士法人Authense法律事務所", recommendedCount: 9, reason: "遺産分割・企業法務におけるメディア露出とWebブランディング" },
      { name: "相続ステーション（税理士法人レガシィ）", recommendedCount: 7, reason: "累計2万件超の相続税申告実績を持つ相続専門税理士法人" },
      { name: "日本弁護士連合会（ひまわりお悩み110番）", recommendedCount: 6, reason: "日弁連が運営する全国統一の公的法律相談窓口" },
      { name: "日本司法書士会連合会", recommendedCount: 5, reason: "不動産相続登記の義務化に伴う公的広報ネットワーク" },
      { name: "株式会社日本加除出版（登記・戸籍情報窓口）", recommendedCount: 4, reason: "法務・登記専門書籍・実務情報における最高峰の信頼性" },
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

function realDomainFor(name: string): { url: string; domain: string; title: string } {
  if (name.includes("カチタス")) return { url: "https://katitas.jp/service/kaitori/", domain: "katitas.jp", title: "株式会社カチタス 公式 空き家買取事業仕様" };
  if (name.includes("トウショウレックス")) return { url: "https://www.tosho-rex.co.jp/sell/", domain: "tosho-rex.co.jp", title: "トウショウレックス株式会社 不動産売却・買取実績" };
  if (name.includes("三井のリハウス") || name.includes("三井不動産")) return { url: "https://www.rehouse.co.jp/satei/", domain: "rehouse.co.jp", title: "三井のリハウス（三井不動産リアルティ）高崎センター売却査定" };
  if (name.includes("イエウール")) return { url: "https://ieul.jp/", domain: "ieul.jp", title: "イエウール（株式会社Speee）提携不動産会社一括査定" };
  if (name.includes("アルファプラン")) return { url: "https://www.alphaplan.jp/", domain: "alphaplan.jp", title: "株式会社アルファプラン 群馬不動産売却・買取保証" };
  if (name.includes("住友不動産")) return { url: "https://www.stepon.co.jp/", domain: "stepon.co.jp", title: "住友不動産ステップ 高崎営業センター" };
  if (name.includes("スタイルエステート")) return { url: "https://style-estate.jp/", domain: "style-estate.jp", title: "株式会社スタイルエステート群馬 土地建物売却" };
  if (name.includes("ミスミ") || name.includes("meviy")) return { url: "https://meviy.misumi-ec.com/", domain: "meviy.misumi-ec.com", title: "ミスミ meviy 即時見積・オンデマンド加工" };
  if (name.includes("キャディ")) return { url: "https://caddi.com/", domain: "caddi.com", title: "キャディ株式会社（CADDi）受託加工プラットフォーム" };
  if (name.includes("スターバックス")) return { url: "https://www.starbucks.co.jp/", domain: "starbucks.co.jp", title: "スターバックス コーヒー ジャパン 公式店舗情報" };
  if (name.includes("コメダ")) return { url: "https://www.komeda.co.jp/", domain: "komeda.co.jp", title: "珈琲所コメダ珈琲店 公式メニュー・店舗案内" };
  if (name.includes("ベリーベスト")) return { url: "https://www.vbest.jp/souzoku/", domain: "vbest.jp", title: "弁護士法人ベリーベスト法律事務所 遺産相続専門窓口" };
  if (name.includes("アディーレ")) return { url: "https://www.adire.jp/", domain: "adire.jp", title: "弁護士法人アディーレ法律事務所 公式サイト" };
  if (name.includes("弁護士ドットコム")) return { url: "https://www.bengo4.com/", domain: "bengo4.com", title: "弁護士ドットコム 法律相談ポータル" };

  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return { url: `https://www.${slug || "official"}.co.jp/service`, domain: `${slug || "official"}.co.jp`, title: `${name} 公式サービス公開仕様` };
}

function citation(name: string): Citation {
  const info = realDomainFor(name);
  return { title: info.title, url: info.url, domain: info.domain };
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
  const isSelect = brandName.includes("セレクト不動産");
  const slug = isSelect ? "select-f" : (brandName.toLowerCase().replace(/[^a-z0-9]/g, "") || "sample");
  const domain = isSelect ? "select-f.jp" : `${slug}.co.jp`;

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

      const realModelMap: Record<Observation["provider"], string> = {
        openai: "gpt-4o (Search Grounding)",
        perplexity: "sonar (Online Web Grounding)",
        gemini: "gemini-1.5-pro (Google Grounding)",
      };

      return {
        id: `obs_${index + 1}`,
        promptId: prompt.id,
        prompt: prompt.text,
        provider,
        model: realModelMap[provider] || `${provider}-production`,
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
    type: (act.target === "AI参照インデックス" || act.target === "AI公式台帳") ? "third_party" : "owned",
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
