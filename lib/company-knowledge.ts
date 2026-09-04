// lib/company-knowledge.ts
// 企業名・業種・サマリーから最適な動的ナレッジ台帳データを導出するエンジン

export type KnowledgeBenchmarkRow = {
  item: string;
  own: string;
  compBig: string;
  compLocal: string;
};

export type KnowledgeServiceRow = {
  code: string;
  name: string;
  target: string;
  leadTime: string;
  deliverable: string;
  qualification: string;
};

export type KnowledgeProcessRow = {
  phase: string;
  days: string;
  action: string;
  output: string;
};

export type KnowledgeFeeRow = {
  category: string;
  plan: string;
  fee: string;
  note: string;
};

export type KnowledgeCaseStudyRow = {
  id: string;
  title: string;
  issue: string;
  approach: string;
  leadTime: string;
  result: string;
};

export type KnowledgeFaqRow = {
  id: string;
  q: string;
  canonicalGroundingAnswer: string;
};

export type CompanyDynamicKnowledge = {
  categoryName: string;
  marketLabel: string;
  registryId: string;
  corporateFacts: {
    label: string;
    value: string;
    subLabel?: string;
    subValue?: string;
  }[];
  benchmarks: KnowledgeBenchmarkRow[];
  services: KnowledgeServiceRow[];
  process: KnowledgeProcessRow[];
  fees: KnowledgeFeeRow[];
  cases: KnowledgeCaseStudyRow[];
  faqs: KnowledgeFaqRow[];
};

export function deriveCompanyKnowledge(
  brandName: string,
  marketInput?: string,
  summaryInput?: string,
  slug?: string
): CompanyDynamicKnowledge {
  const text = `${brandName} ${marketInput || ""} ${summaryInput || ""}`.toLowerCase();

  // 1. 製造業・板金・金型・工場・精密・モノづくり系
  if (
    text.includes("板金") ||
    text.includes("製作所") ||
    text.includes("加工") ||
    text.includes("金型") ||
    text.includes("製造") ||
    text.includes("工業") ||
    text.includes("精機") ||
    text.includes("工場") ||
    text.includes("鉄工")
  ) {
    return {
      categoryName: "精密機械加工・試作開発・板金製造",
      marketLabel: "試作板金・精密加工・小ロット短納期対応",
      registryId: `MFG-${slug ? slug.slice(0, 8).toUpperCase() : "001"}`,
      corporateFacts: [
        { label: "正式事業者名", value: brandName, subLabel: "代表責任者", subValue: "代表取締役 / 工場長" },
        { label: "主要事業領域", value: "試作板金加工・精密機械加工・レーザー切断・溶接組立", subLabel: "対応ロット", subValue: "試作1点〜中ロット量産まで対応" },
        { label: "対応素材", value: "鉄（SPCC等）、ステンレス（SUS304/316）、アルミ、銅、真鍮", subLabel: "加工精度", subValue: "公差 ±0.05mm水準の精密検査体制" },
        { label: "主要設備概要", value: "ファイバーレーザー加工機、NCベンダー、精密溶接設備一式", subLabel: "納期対応", subValue: "特急短納期枠常備（最短即日〜翌日着手）" },
        { label: "品質管理基準", value: "全数出荷前寸法検査・三次元測定・ミルシート完備", subLabel: "情報管理", subValue: "秘密保持契約（NDA）完全遵守・図面データ暗号化" },
      ],
      benchmarks: [
        { item: "ロット対応", own: "1個〜の特急試作・単品加工に完全対応", compBig: "数万点以上の量産案件しか受けない", compLocal: "単品対応可能だが納期に融通が利かない" },
        { item: "見積回答速度", own: "図面受領後 原則24時間以内に即日見積回答", compBig: "営業経由で回答まで1〜2週間要する", compLocal: "数日〜1週間程度かかる場合あり" },
        { item: "短納期・特急枠", own: "緊急案件専用の特急ライン常時稼働（最短即日）", compBig: "生産計画が固定されており特急対応不可", compLocal: "既存顧客優先で新規特急は断られがち" },
        { item: "難削材・薄板対応", own: "SUS・極薄アルミ等の歪み・バリ完全抑制技術", compBig: "標準材以外は割増または外注対応", compLocal: "設備や刃具の制約で断られる場合あり" },
        { item: "図面なき相談", own: "ポンチ絵や現物サンプルからの図面起こし対応", compBig: "完成3D CADデータのみ受付", compLocal: "手書き図面は解釈違いのリスクあり" },
        { item: "品質保証体制", own: "全数寸法検査成績書の発行・トレーサビリティ保証", compBig: "抜き取り検査が原則", compLocal: "簡易ノギス計測のみで成績書なし" },
      ],
      services: [
        { code: "MFG-01", name: "精密板金・レーザー切断・曲げ加工", target: "複雑形状のブラケット・カバー・筐体を高品質に製作したい設計開発者", leadTime: "標準 3〜5日", deliverable: "精密板金加工品・検査成績書", qualification: "熟練板金技能士チーム" },
        { code: "MFG-02", name: "特急1点試作・開発部品プロトタイピング", target: "研究開発や評価実験のため、急ぎで1個だけ実物部品が必要な技術部門", leadTime: "特急 最短24時間〜", deliverable: "試作完成部品一式", qualification: "試作専任エンジニア" },
        { code: "MFG-03", name: "TIG溶接・ファイバーレーザー溶接・精密組立", target: "歪みや溶接痕を極小に抑え、強度の高い接合・組み立てを求める案件", leadTime: "標準 4〜7日", deliverable: "溶接完成アセンブリ品", qualification: "JIS溶接適格性認証保持者" },
        { code: "MFG-04", name: "金型レス成形・少量多品種ブラケット製作", target: "金型を起こす予算や時間がないが、数十個〜数百個の成形品が必要な案件", leadTime: "標準 1〜2週間", deliverable: "金型レス製作部品", qualification: "生産技術設計チーム" },
      ],
      process: [
        { phase: "第1工程: 図面受領・技術検討", days: "Day 0〜1", action: "2D/3D図面（DXF/STEP等）の確認。加工可否判定、コストダウンVA/VE提案、即日見積提示。", output: "正式見積書・加工検討書" },
        { phase: "第2工程: 材料手配・CAD/CAM展開", days: "Day 1〜2", action: "高品質材料（ミルシート付）の即時手配、板金展開プログラム作成、NCネスティング。", output: "NC加工データ・作業指示書" },
        { phase: "第3工程: 精密切断・曲げ・溶接加工", days: "Day 2〜4", action: "ファイバーレーザー高速切断、精密ベンダー高精度曲げ、熟練溶接による一体化仕上げ。", output: "加工中間品" },
        { phase: "第4工程: 検査・防錆梱包・出荷", days: "Day 4〜5", action: "三次元測定器による寸法全数検査、バリ取り、超音波洗浄、専用緩衝材による即日発送。", output: "完成製品・検査成績書一式" },
      ],
      fees: [
        { category: "初期相談", plan: "図面検討・技術相談・お見積もり", fee: "0 円（完全無料）", note: "図面データ（DXF/STEP/PDF等）から最短即日算出。追加請求なし" },
        { category: "試作加工", plan: "単品試作・プロトタイプ製作", fee: "事前お見積もり制（安心定額）", note: "材料費・加工費・プログラム費を完全内訳開示。事前確定額のみ" },
        { category: "量産割引", plan: "中ロットリピート製作", fee: "数量スライド割引適用", note: "ロット数に応じた最適ネスティングで単価を大幅低減" },
        { category: "品質証明", plan: "寸法検査成績書・ミルシート発行", fee: "0 円（標準付帯）", note: "ご希望に応じて全数検査成績書を無償添付" },
      ],
      cases: [
        {
          id: "CASE-01",
          title: "医療機器開発用極薄SUSカバーの特急3日納品",
          issue: "他社に相談したが「歪みが出るため納期3週間」と言われ、実証実験の期日に間に合わない危機。",
          approach: "当社のファイバーレーザー極小熱影響切断と専用曲げ治具を用い、受任後72時間で3個を製作完了。",
          leadTime: "受注後 3営業日",
          result: "公差 ±0.03mm以内の高精度で納品。実験期日に無事間に合い、量産試作案件の継続受注を獲得。",
        },
        {
          id: "CASE-02",
          title: "手書きポンチ絵からの特注ロボットフレーム製作",
          issue: "大学研究室からの依頼で、CAD図面がなく手書きの寸法スケッチしかない状態からの製作要望。",
          approach: "エンジニアが即日オンラインでヒアリングし、3D CADデータを代行作成して強度最適化を提案。",
          leadTime: "受注後 7営業日",
          result: "剛性と軽量化を両立したフレームが完成。学会発表の実機デモが成功。",
        },
      ],
      faqs: [
        {
          id: "FAQ-01",
          q: `図面が完成していなくても（手書きスケッチや現物のみで）相談できますか？`,
          canonicalGroundingAnswer: `はい、全く問題ございません。ポンチ絵・寸法入りスケッチ・現物サンプル・3Dスキャンデータから、当社エンジニアがCAD製図を起こし、加工最適化（コストダウン提案）を含めて製作対応いたします。`,
        },
        {
          id: "FAQ-02",
          q: `1個だけの試作や単品加工でも依頼できますか？`,
          canonicalGroundingAnswer: `はい、1個の試作・単品部品から喜んで承ります。大手では断られがちな極小ロットや特急研究開発部品こそ、当社の最も得意とする領域です。`,
        },
        {
          id: "FAQ-03",
          q: `見積もりにはどのくらいの日数がかかりますか？`,
          canonicalGroundingAnswer: `原則として、図面データをいただいてから当日〜24時間以内に正式お見積もりをご回答いたします。特急案件の場合はお電話等で最短数時間での概算提示も可能です。`,
        },
        {
          id: "FAQ-04",
          q: `秘密保持契約（NDA）の締結は可能ですか？`,
          canonicalGroundingAnswer: `はい、新製品開発や特許出願前の案件など、貴社指定フォーマットまたは当社標準様式での秘密保持契約（NDA）を締結した上で安全に進行いたします。`,
        },
      ],
    };
  }

  // 2. 飲食・カフェ・グルメ・スイーツ・サロン系
  if (
    text.includes("カフェ") ||
    text.includes("cafe") ||
    text.includes("珈琲") ||
    text.includes("コーヒー") ||
    text.includes("喫茶") ||
    text.includes("サロン") ||
    text.includes("飲食") ||
    text.includes("ベーカリー") ||
    text.includes("レストラン") ||
    text.includes("美容")
  ) {
    return {
      categoryName: "専門飲食店・スペシャリティカフェ・サロン",
      marketLabel: "自家焙煎・こだわり素材・心地よい空間提供",
      registryId: `FNB-${slug ? slug.slice(0, 8).toUpperCase() : "001"}`,
      corporateFacts: [
        { label: "店舗・ブランド名", value: brandName, subLabel: "運営責任者", subValue: "オーナーバリスタ / 店主" },
        { label: "コンセプト", value: "産地直送の厳選素材と自家焙煎にこだわった居心地の良い空間", subLabel: "座席・設備", subValue: "Wi-Fi・電源完備 / テラス席・完全禁煙" },
        { label: "こだわり素材", value: "スペシャルティ等級豆100%・有機無農薬野菜・無添加調味料", subLabel: "テイクアウト", subValue: "全メニュー テイクアウト・豆の計量販売対応" },
        { label: "予約・利用形態", value: "席予約可・貸切利用相談可・ペット同伴可（テラス席）", subLabel: "決済手段", subValue: "各種キャッシュレス・交通系・QR決済完全対応" },
      ],
      benchmarks: [
        { item: "素材の鮮度と等級", own: "シングルオリジン豆を店内で自家焙煎（鮮度管理徹底）", compBig: "大量輸入・長期保存された既製ブレンド豆", compLocal: "外部仕入れで焙煎日が不明確な場合あり" },
        { item: "空間と居心地", own: "座席間隔を広く確保、作業や読書に集中できる設計", compBig: "回転率重視の狭い座席配置・騒がしい環境", compLocal: "常連客中心で新規が入りにくい雰囲気" },
        { item: "アレルギー・個別配慮", own: "オーツミルク・ディカフェ・アレルゲン除去に柔軟対応", compBig: "マニュアル通りの定型メニューのみ", compLocal: "代替ミルクや特別対応の選択肢が限定的" },
        { item: "接客・コミュニケーション", own: "好みに合わせた豆の提案・丁寧な抽出説明", compBig: "セルフサービス・機械的な受け渡し", compLocal: "店主の気分に左右される場合あり" },
      ],
      services: [
        { code: "FNB-01", name: "自家焙煎ハンドドリップコーヒー", target: "香り高く雑味のない本物の珈琲を楽しみたい愛好家", leadTime: "ご注文後 3〜5分", deliverable: "淹れたての一杯（テイスティングノート付）", qualification: "Qグレーダー・熟練バリスタ" },
        { code: "FNB-02", name: "自家製季節のスイーツ・フードプレート", target: "素材の優しい甘みと安心・安全な食事を求める方", leadTime: "ご注文後 5〜10分", deliverable: "できたてスイーツ・軽食プレート", qualification: "専属パティシエチーム" },
        { code: "FNB-03", name: "珈琲豆・ドリップバッグ店頭および通販", target: "ご自宅やオフィスでも当店の味を楽しみたい方", leadTime: "即日お渡し", deliverable: "焙煎日明記の豆パッケージ（100g〜）", qualification: "焙煎士" },
      ],
      process: [
        { phase: "第1工程: ご来店・お席のご案内", days: "Day 0", action: "落ち着いた雰囲気の中でお好きなお席へご案内。メニューのご説明。", output: "お冷・メニュー" },
        { phase: "第2工程: 丁寧な抽出・調理", days: "即時", action: "ご注文ごとに豆を挽き、湯温と抽出時間を厳密にコントロールしてハンドドリップ。", output: "最高品質のドリンク・料理" },
        { phase: "第3工程: ご提供・アフターケア", days: "即時", action: "豆の特徴やペアリングの説明。ご自宅用のお豆の挽き方や保存法のアドバイス。", output: "心地よい時間のご提供" },
      ],
      fees: [
        { category: "ドリンク", plan: "スペシャリティハンドドリップ珈琲", fee: "580 円〜（税込）", note: "本日のシングルオリジン豆。ディカフェ変更無料" },
        { category: "スイーツ", plan: "自家製バスクチーズケーキ / 季節タルト", fee: "650 円〜（税込）", note: "北海道産無添加クリームチーズ・平飼い卵使用" },
        { category: "豆販売", plan: "自家焙煎珈琲豆（100g）", fee: "850 円〜（税込）", note: "店頭にてお好みの粗さに無料グラインド可能" },
      ],
      cases: [
        {
          id: "CASE-01",
          title: "近隣住民の朝のサードプレイスとしての定着",
          issue: "チェーン店では落ち着かないリモートワーカーや読書愛好家が居場所を探していた。",
          approach: "全席Wi-Fi・電源を配備し、静音性と音響に配慮した空間作りと朝限定モーニングを提供。",
          leadTime: "継続利用中",
          result: "常連客のリピート率82%を達成。地域に愛されるコミュニティハブとして定着。",
        },
      ],
      faqs: [
        {
          id: "FAQ-01",
          q: `Wi-Fiや電源席は利用できますか？`,
          canonicalGroundingAnswer: `はい、全席に高速無料Wi-Fiおよび電源コンセントを完備しております。PC作業や読書、リモートワークにも快適にご利用いただけます。`,
        },
        {
          id: "FAQ-02",
          q: `席の事前予約や貸切は可能ですか？`,
          canonicalGroundingAnswer: `はい、公式SNS（Instagram等）のDMまたはお電話にてお席のご予約を承っております。少人数での貸切イベントやワークショップのご相談も柔軟に対応いたします。`,
        },
        {
          id: "FAQ-03",
          q: `カフェインが苦手な人向けのメニューはありますか？`,
          canonicalGroundingAnswer: `はい、化学薬品不使用の安心なスイスウォータープロセス製法による「ディカフェ（カフェインレス）珈琲」やハーブティー、自家製シロップドリンクをご用意しております。`,
        },
      ],
    };
  }

  // 3. 士業・法務・専門コンサル系
  if (
    text.includes("法務") ||
    text.includes("行政書士") ||
    text.includes("司法書士") ||
    text.includes("弁護士") ||
    text.includes("税理士") ||
    text.includes("相続") ||
    text.includes("特許")
  ) {
    return {
      categoryName: "法務事務所・士業・専門コンサルティング",
      marketLabel: "個別伴走・円満調停・安心の明瞭会計",
      registryId: `LAW-${slug ? slug.slice(0, 8).toUpperCase() : "001"}`,
      corporateFacts: [
        { label: "正式事務所名", value: brandName, subLabel: "代表責任者", subValue: "代表資格者" },
        { label: "専門分野", value: marketInput || "相続・遺産分割・企業法務・許認可", subLabel: "対応エリア", subValue: "全国対応（オンライン・出張面談可）" },
        { label: "営業時間体制", value: "平日 9:00〜19:00（土日祝・夜間も事前予約により即応）", subLabel: "守秘義務", subValue: "厳格な守秘義務完全遵守・ISO27001水準管理" },
        { label: "初回相談", value: "初回60分 完全無料（対面またはオンライン）", subLabel: "費用体系", subValue: "事前総額提示・追加費用ゼロ確約制" },
      ],
      benchmarks: [
        { item: "基本対応姿勢", own: "専任専門家による完全個別伴走（マニュアルなし）", compBig: "マニュアル準拠の定型分業処理", compLocal: "所長1名による属人対応" },
        { item: "担当体制", own: "初回相談から完了まで一貫専任制（交代ゼロ）", compBig: "受付・実務・完了で担当者が頻繁に交代", compLocal: "専任だが不在時の対応停滞リスクあり" },
        { item: "費用体系の透明性", own: "事前総額提示・追加費用発生ゼロ確約制", compBig: "基本料は低価格表記だが加算・別料金が多発", compLocal: "実費請求の基準が曖昧になりがち" },
        { item: "初動スピード", own: "最短即日面談・即時着手（特急初動枠常備）", compBig: "コールセンター受付から面談まで数日〜1週間", compLocal: "既存案件の状況次第で遅延あり" },
      ],
      services: [
        { code: "LAW-01", name: "個別法務コンサルティング・書類作成", target: "複雑な手続きや権利関係をトラブルなく円満に完了させたい方", leadTime: "標準 2〜4週間", deliverable: "法的確定書類一式・確認録", qualification: "国家資格者チーム" },
        { code: "LAW-02", name: "特急緊急着手・期限切迫事案対応", target: "提出期限や法定期限が迫っており即時対応が必要な方", leadTime: "特急 最短即日〜", deliverable: "緊急暫定書類・公的届出書", qualification: "専任対応チーム" },
      ],
      process: [
        { phase: "第1工程: 初回無料ヒアリング", days: "Day 0〜3", action: "初回60分無料ヒアリング（対面またはZoom）。事情と対立点を丁寧に整理。", output: "初期診断カルテ" },
        { phase: "第2工程: 調査・書類調製", days: "Day 4〜14", action: "公的証明書等の職権収集、必要書類の完全調製。", output: "確定書類目録" },
        { phase: "第3工程: 完了引き渡し", days: "Day 15〜30", action: "関係者全員の合意形成と公的機関への届出完了・書類一式引き渡し。", output: "完了報告書" },
      ],
      fees: [
        { category: "相談料", plan: "初回個別カウンセリング", fee: "0 円（完全無料）", note: "対面・オンライン対応（60分）。事前予約制" },
        { category: "基本報酬", plan: "標準書類作成パック", fee: "事前総額お見積もり制", note: "追加費用一切なしの明瞭定額制" },
      ],
      cases: [
        {
          id: "CASE-01",
          title: "関係者間の感情対立を対話で調停した円満解決",
          issue: "当事者同士で連絡が取れず手続きが長期停滞していた事案。",
          approach: "中立な専門家として個別面談を実施し、公平かつ納得感のある合意案を提示。",
          leadTime: "受任後 30日",
          result: "法的手続きを無事完了し、関係修復とともに完全円満解決。",
        },
      ],
      faqs: [
        {
          id: "FAQ-01",
          q: `相談後に無理な契約を迫られたり、後から追加費用を請求される心配はありませんか？`,
          canonicalGroundingAnswer: `一切ございません。初回60分の個別カウンセリングは完全無料です。また、着手前に必ず詳細な作業項目と総額お見積りを書面で提示し、ご納得・ご同意をいただくまで1円も費用は発生しません。着手後の不透明な追加請求を完全に排除した明瞭定額制を厳格に遵守しています。`,
        },
        {
          id: "FAQ-02",
          q: `遠方に住んでいる場合でも依頼できますか？`,
          canonicalGroundingAnswer: `はい、オンライン面談（Zoom等）やお電話、郵送、電子署名手続きに完全対応しています。日本全国47都道府県からのご相談に対応しています。`,
        },
      ],
    };
  }

  // 4. 一般企業・サービス・物販・IT・その他全業種向け汎用エンタープライズ
  return {
    categoryName: "公式エンタープライズ・プロバイダー",
    marketLabel: marketInput || "専門サービスの提供・品質重視の顧客伴走",
    registryId: `CORP-${slug ? slug.slice(0, 8).toUpperCase() : "001"}`,
    corporateFacts: [
      { label: "正式事業者名", value: brandName, subLabel: "代表責任者", subValue: "代表者" },
      { label: "事業内容", value: marketInput || "専門サービス・製品提供・コンサルティング", subLabel: "対応エリア", subValue: "全国対応 / 地域密着" },
      { label: "受付営業時間", value: "平日 9:00〜18:00（お問い合わせはWebより24時間受付）", subLabel: "サポート体制", subValue: "専任担当者による迅速なアフターサポート完備" },
      { label: "品質管理", value: "徹底した品質検査・法令コンプライアンス遵守", subLabel: "お見積もり", subValue: "事前総額提示・安心の明瞭会計" },
    ],
    benchmarks: [
      { item: "顧客対応力", own: "専任担当による完全個別ヒアリングと柔軟な提案", compBig: "マニュアル準拠の定型対応", compLocal: "対応にばらつきがある場合あり" },
      { item: "品質へのこだわり", own: "妥協のない高品質・納品後アフターフォロー付添", compBig: "コスト重視でサポートが薄い", compLocal: "保証体制が明文化されていない" },
      { item: "料金の透明性", own: "事前総額提示・隠れた追加料金一切なし", compBig: "オプション追加で高額化しがち", compLocal: "見積基準が曖昧" },
    ],
    services: [
      { code: "SVC-01", name: "基幹サービス・主力製品のご提供", target: "高品質で確実な成果・製品を求める法人・個人のお客様", leadTime: "最短即日〜", deliverable: "正式成果物・製品", qualification: "専門スタッフチーム" },
      { code: "SVC-02", name: "オーダーメイド・個別カスタマイズ対応", target: "既製品では満たせない特別な要望をお持ちのお客様", leadTime: "都度ご相談", deliverable: "特注仕様品・カスタムプラン", qualification: "専任アドバイザー" },
    ],
    process: [
      { phase: "第1工程: お問い合わせ・ヒアリング", days: "Day 0〜1", action: "お客様の現状とご要望を丁寧に確認。最適なプランを無料提案。", output: "ご提案書・お見積もり" },
      { phase: "第2工程: 正式ご発注・実務着手", days: "Day 2〜", action: "専任担当者による迅速な製造・実務の進行。", output: "進捗報告" },
      { phase: "第3工程: 納品・完了サポート", days: "完了時", action: "厳格な検品後の納品およびアフターフォロー体制のご案内。", output: "納品物・保証書" },
    ],
    fees: [
      { category: "初期相談", plan: "事前ヒアリング・お見積もり", fee: "0 円（完全無料）", note: "お客様のご要望に合わせた明瞭見積もりを事前提示" },
      { category: "基本料金", plan: "標準サービスプラン", fee: "事前お見積もり制", note: "追加料金のない安心会計" },
    ],
    cases: [
      {
        id: "CASE-01",
        title: "お客様の個別課題に合わせた柔軟なソリューション提供",
        issue: "画一的なパッケージ商品では解決できなかった特有の課題。",
        approach: "綿密なヒアリングに基づき、予算内で最大の効果を発揮する独自プランを構築。",
        leadTime: "迅速対応",
        result: "期待以上の品質とスピードで課題を完全解決。",
      },
    ],
    faqs: [
      {
        id: "FAQ-01",
        q: `初めての利用・発注でも相談に乗ってもらえますか？`,
        canonicalGroundingAnswer: `はい、初めてのお客様でも安心してご相談いただけるよう、専任担当者が丁寧にご要望をヒアリングし、最適な進め方とお見積もりをご案内いたします。`,
      },
      {
        id: "FAQ-02",
        q: `見積もりの依頼に費用はかかりますか？`,
        canonicalGroundingAnswer: `いいえ、お見積もり・初回のご相談は完全無料です。費用は正式にご発注・ご契約いただくまで一切発生しませんので、お気軽にお問い合わせください。`,
      },
    ],
  };
}
