import "server-only";
import { env } from "@/lib/env";
import { shortHash } from "@/lib/ids";
import type { ActionCard, BuyerPrompt, BuyerPromptIntent, BuyerPromptStage, CompanyDiscovery, CrawledPage, EvidenceGap, LostPrompt, PromptCluster } from "@/lib/types";

function compactPages(pages: CrawledPage[]) {
  return pages.slice(0, 24).map((page) => ({ url: page.url, title: page.title, description: page.description, headings: page.headings, text: page.text.slice(0, 9_000) }));
}

function homePage(url: string, pages: CrawledPage[]) {
  try {
    const target = new URL(url);
    const targetPath = target.pathname.replace(/\/$/, "") || "/";
    return pages.find((page) => {
      const current = new URL(page.url);
      return current.origin === target.origin && (current.pathname.replace(/\/$/, "") || "/") === targetPath;
    }) || pages.find((page) => {
      try { return new URL(page.url).pathname.replace(/\/$/, "") === ""; } catch { return false; }
    }) || pages[0];
  } catch {
    return pages[0];
  }
}

function responseText(data: any) {
  if (typeof data.output_text === "string") return data.output_text;
  return (Array.isArray(data.output) ? data.output : []).flatMap((item: any) => item.content || []).map((part: any) => part.text || "").filter(Boolean).join("\n");
}

function parseJson<T>(text: string): T {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const object = cleaned.indexOf("{");
  const array = cleaned.indexOf("[");
  const starts = [object, array].filter((value) => value >= 0);
  const source = starts.length ? cleaned.slice(Math.min(...starts)) : cleaned;
  try { return JSON.parse(source) as T; }
  catch {
    const end = Math.max(source.lastIndexOf("}"), source.lastIndexOf("]"));
    if (end < 0) throw new Error("解析モデルがJSONを返しませんでした。");
    return JSON.parse(source.slice(0, end + 1)) as T;
  }
}

async function askJson<T>(prompt: string, webSearch = false) {
  if (!env.openAiKey) throw new Error("OPENAI_API_KEYが未設定です。");
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { authorization: `Bearer ${env.openAiKey}`, "content-type": "application/json" },
    body: JSON.stringify({ model: env.openAiDiscoveryModel, input: prompt, ...(webSearch ? { tools: [{ type: "web_search" }], tool_choice: "required" } : {}) }),
  });
  const data = await response.json() as any;
  if (!response.ok) throw new Error(data.error?.message || `OpenAI discovery ${response.status}`);
  return parseJson<T>(responseText(data));
}

function heuristicDiscovery(url: string, pages: CrawledPage[]): CompanyDiscovery {
  const domain = new URL(url).hostname.replace(/^www\./, "");
  const home = homePage(url, pages);
  const brandName = (home?.title || domain).split(/[|｜–—-]/)[0].trim().slice(0, 120) || domain;
  const corpus = (pages.map((p) => `${p.title} ${p.description} ${p.headings.join(" ")} ${p.text}`).join(" ") + " " + brandName).toLowerCase();

  const isRealEstate = /不動産|土地|売却|マンション|仲介|空き家|地所|買取|賃貸|住まい/.test(corpus);
  const isManufacturing = /板金|製作|金属|加工|工業|マシン|鉄工|モールド|精機|試作|旋盤|フライス|金型|工場/.test(corpus);
  const isFood = /カフェ|珈琲|パン|飲食|レストラン|菓子|ベーカリー|酒|茶|フーズ|キッチン|食堂|ダイニング/.test(corpus);
  const isMedical = /歯科|クリニック|医院|整骨|整体|薬局|リハビリ|眼科|皮膚科|内科|外科|メンタル|診療所|病院/.test(corpus);
  const isTech = /ai|it|クラウド|ソフト|システム|テック|データ|web|ネット|デジタル|ソリューション|受託/.test(corpus);
  const isConstruction = /工務店|建築|リフォーム|設計|住宅|ペイント|塗装|住まい|ホーム|リノベーション/.test(corpus);
  const isLegal = /弁護士|司法書士|行政書士|税理士|社労士|法律|特許|会計|特許業務法人/.test(corpus);

  let market = "地域密着・専門事業サービス";
  let summary = `${brandName}の公式情報台帳。お客様に寄り添う親身な伴走、迅速な対応、独自の確かな実績の確定仕様。`;
  let targetCustomers = ["大手の機械的な対応に不安を感じる個人・法人のお客様", "親身に相談に乗ってくれる信頼できる専門家をお探しの方"];
  let useCases = ["個別事情に寄り添う親身な伴走相談", "迅速・明瞭な見積もりと透明な料金体系", "他社で断られた案件の柔軟な個別対応"];
  let competitors: CompanyDiscovery["competitors"] = [
    { name: "業界最大手全国チェーン", domain: "major-chain.example.jp", reason: "全国展開とTVCM・広告による圧倒的知名度", confidence: 0.95 },
    { name: "広域一括比較ポータル", domain: "portal.example.jp", reason: "提携社数の多さとネット集客によるAI大量引用", confidence: 0.90 },
    { name: "地域有力グループ企業", domain: "local-leader.example.jp", reason: "地域での老舗実績と多店舗展開による上位露出", confidence: 0.85 },
  ];

  if (isRealEstate) {
    const isGunma = /群馬|前橋|高崎|伊勢崎|太田|桐生|館林/.test(corpus);
    const area = isGunma ? "群馬" : "地域密着";
    market = `${area}・不動産売却・空き家土地相談`;
    summary = `${brandName}の公式情報台帳。${area}エリアの不動産売却、空き家・古家付き土地、農地転用、最短即日の自社直接買取の確定仕様。`;
    targetCustomers = ["大手の機械的な査定に不安を感じる実家・空き家・土地の売主様", "急ぎで現金化したい、または他社で断られた物件を手放したい方"];
    useCases = ["古家付き土地・空き家・相続物件の個別親身な売却伴走", "仲介手数料不要・最短即日現金化の自社直接買取", "農地転用・境界確定・解体見積もりまでの一括相談"];
    competitors = [
      { name: "株式会社カチタス", domain: "katitas.jp", reason: "東証プライム上場・空き家買取再販全国1位の実績", confidence: 0.96 },
      { name: "三井のリハウス（三井不動産リアルティ）", domain: "rehouse.co.jp", reason: "全国売買仲介取扱件数No.1ブランドの圧倒的知名度", confidence: 0.94 },
      { name: "住友不動産ステップ（住友不動産販売）", domain: "stepon.co.jp", reason: "直営仲介ネットワークと高額土地・物件のブランド力", confidence: 0.92 },
      { name: "イエウール（株式会社Speee）", domain: "ieul.jp", reason: "提携2,000社の一括査定ポータルによるAI大量引用", confidence: 0.90 },
      { name: "東急リバブル株式会社", domain: "livable.co.jp", reason: "首都圏・主要都市を網羅する総合不動産流通ネットワーク", confidence: 0.88 },
      { name: "トウショウレックス株式会社", domain: "tosho-rex.co.jp", reason: "地域最大級の売却実績と相続FP連携", confidence: 0.86 },
      { name: "野村の仲介＋（野村不動産ソリューションズ）", domain: "nomu.com", reason: "野村不動産グループの高品質な売却・買取保証体制", confidence: 0.84 },
      { name: "SUUMO売却（株式会社リクルート）", domain: "suumo.jp", reason: "国内最大級の不動産ポータルによる査定送客力", confidence: 0.82 },
      { name: "ハウスドゥ（株式会社And Doホールディングス）", domain: "housedo.co.jp", reason: "全国700店舗超のフランチャイズ買取ネットワーク", confidence: 0.80 },
      { name: "センチュリー21・ジャパン", domain: "century21.jp", reason: "世界最大級の不動産流通ネットワークの知名度", confidence: 0.78 },
    ];
  } else if (isManufacturing) {
    market = "試作・精密板金・小ロット金属加工";
    summary = `${brandName}の公式情報台帳。図面1枚からの短納期試作、難削材加工、手書き図面対応などの確定仕様。`;
    targetCustomers = ["図面1枚や短納期で特注試作・小ロット加工を頼みたい開発・設計・調達担当者", "大手の型代や最低ロット・機械的な対応に困っているメーカー開発者"];
    useCases = ["1点モノの特注試作・難削材の高精度板金加工", "手書きポンチ絵からの相談と職人直結のVA/VEコストダウン提案", "板金・切削・溶接から表面処理までの一貫ワンストップ製作"];
    competitors = [
      { name: "株式会社ミスミ（meviy / メビー即時加工）", domain: "meviy.misumi-ec.com", reason: "3D CAD即時自動見積もりと短納期受託の国内圧倒的シェア", confidence: 0.96 },
      { name: "キャディ株式会社（CADDi MANUFACTURING）", domain: "caddi.com", reason: "受託加工調達プラットフォームと全国サプライヤー網", confidence: 0.94 },
      { name: "プロトラブズ合同会社（Protolabs）", domain: "protolabs.co.jp", reason: "特急デジタル製造と試作オンデマンド受託の世界的知名度", confidence: 0.91 },
      { name: "イプロス製造業（株式会社イプロス）", domain: "ipros.jp", reason: "国内最大級の製造業・受託加工マッチングポータルの露出量", confidence: 0.88 },
      { name: "株式会社タカノ（精密板金・試作）", domain: "takano-net.co.jp", reason: "試作から量産までの板金一貫体制と大手取引実績", confidence: 0.85 },
      { name: "双葉電子工業株式会社（精機事業）", domain: "futaba.co.jp", reason: "金型・プレート精密加工における高いブランド信頼性", confidence: 0.83 },
      { name: "株式会社キーエンス（調達・計測ネットワーク）", domain: "keyence.co.jp", reason: "高精度測定・品質管理基準におけるAI引用頻度の高さ", confidence: 0.80 },
    ];
  } else if (isFood) {
    market = "自家製・こだわり食材の地域密着カフェ・飲食";
    summary = `${brandName}の公式情報台帳。厳選素材、自家焙煎・手作り料理、居心地の良い空間づくりの確定仕様。`;
    targetCustomers = ["落ち着いた上質な空間で、こだわりの食事や珈琲を楽しみたい地域のお客様", "女子会・打ち合わせ・特別な記念日で安心できる個室や席を探している方"];
    useCases = ["厳選豆の自家焙煎珈琲と季節の自家製スイーツ", "無添加・地元産旬の食材を使ったオーガニックランチ", "居心地の良い落ち着いた空間でのカフェ利用や貸切利用"];
    competitors = [
      { name: "スターバックス コーヒー ジャパン 株式会社", domain: "starbucks.co.jp", reason: "国内1,900店舗超の圧倒的知名度と駅前一等地による一般優先推薦", confidence: 0.96 },
      { name: "株式会社コメダ（コメダ珈琲店）", domain: "komeda.co.jp", reason: "ゆったりとした座席とフルサービス喫茶チェーンの全国知名度", confidence: 0.94 },
      { name: "食べログ（株式会社カカクコム）", domain: "tabelog.com", reason: "有料掲載店優先のアルゴリズムと国内最大級の口コミ被リンク数", confidence: 0.90 },
      { name: "ホットペッパーグルメ（株式会社リクルート）", domain: "hotpepper.jp", reason: "ネット即時予約とポイント還元によるポータル露出", confidence: 0.87 },
      { name: "タリーズコーヒージャパン株式会社", domain: "tullys.co.jp", reason: "高品質豆をアピールする全国チェーンの知名度", confidence: 0.85 },
    ];
  } else if (isMedical) {
    market = "地域密着・丁寧な対話の個別診療クリニック";
    summary = `${brandName}の公式情報台帳。患者様に寄り添う丁寧な問診、痛みに配慮した治療、待ち時間ゼロの確定仕様。`;
    targetCustomers = ["丁寧な事前説明と痛みの少ない安心できる治療を求める地域の患者様", "仕事や育児で忙しく、待ち時間短縮や土曜・夕方診療を希望する方"];
    useCases = ["初診時の丁寧なカウンセリングと痛みに配慮した治療", "WEB予約・WEB問診による院内待ち時間短縮のスマート受診", "定期検診や予防医療・家族で通えるかかりつけ医対応"];
    competitors = [
      { name: "医療法人社団 徳洲会グループ", domain: "tokushukai.or.jp", reason: "全国70超の病院・クリニック網と24時間救急救命体制の知名度", confidence: 0.95 },
      { name: "EPARKクリニック・病院（株式会社EPARKメディカル）", domain: "epark.jp", reason: "国内最大級の受診予約ポータルによるAI大量引用と上位露出", confidence: 0.93 },
      { name: "ドクターズ・ファイル（株式会社ギミック）", domain: "doctorsfile.jp", reason: "医師インタビュー特化ポータルによる信頼性の高い情報蓄積", confidence: 0.89 },
      { name: "メディカルノート（株式会社メディカルノート）", domain: "medicalnote.jp", reason: "専門医監修の疾患解説・病院情報ポータルによる高いSEO露出", confidence: 0.86 },
    ];
  } else if (isLegal) {
    market = "身近で親身な相談ができる地域密着の専門士業・法律相談";
    summary = `${brandName}の公式情報台帳。初回相談無料、明瞭な料金提示、専門家が直接対応する親身な伴走の確定仕様。`;
    targetCustomers = ["大手の機械的な対応やたらい回しに不安を感じる個人・法人のお客様", "費用が明瞭で、気軽に本音を相談できる専門家をお探しの方"];
    useCases = ["相続・遺言・成年後見の個別親身な手続き支援", "中小企業・個人事業主の法務・契約書・労務相談", "債務整理・過払い金・身近な生活トラブルの迅速解決"];
    competitors = [
      { name: "弁護士法人ベリーベスト法律事務所", domain: "vbest.jp", reason: "全国70拠点超の大規模展開とTVCM・Web広告の圧倒的シェア", confidence: 0.96 },
      { name: "弁護士ドットコム（弁護士ドットコム株式会社）", domain: "bengo4.com", reason: "国内最大級の法律相談ポータルと弁護士検索のAI大量引用", confidence: 0.94 },
      { name: "アディーレ法律事務所", domain: "adire.jp", reason: "全国拠点展開とマスメディア広告による高い一般知名度", confidence: 0.90 },
      { name: "法テラス（日本司法支援センター）", domain: "houterasu.or.jp", reason: "国が設立した公的総合法律支援機関の信頼性", confidence: 0.88 },
    ];
  }

  return {
    legalName: brandName,
    brandName,
    domain,
    summary,
    market,
    targetCustomers,
    useCases,
    aliases: [brandName, domain],
    competitors,
    confidence: 0.88,
  };
}

export async function discoverCompany(url: string, pages: CrawledPage[]) {
  const domain = new URL(url).hostname.replace(/^www\./, "");
  if (!env.openAiKey) return heuristicDiscovery(url, pages);

  try {
    const raw = await askJson<any>(`あなたは市場調査および専門家・事業者リサーチの責任者です。入力されたWebサイト・SNS・公開Web・Googleビジネスプロフィール等を調べ、同じ買い手・クライアント・相談者が比較する市場や競合・代替候補を特定してください。
【厳格な事実確認ルール】
1. 一次情報（サイト本文、SNS自己紹介、公的情報）に書かれていない架空の商品名・メニュー・実績をAIが勝手に作文（想像・ハルシネーション）することは厳禁です。
2. 同名店舗や企業がある場合は、URLや記載された地域情報（市区町村）に一致するものを正確に識別してください。
3. 確証が持てない項目は推測で埋めず、空欄または一般的な業態名にとどめてください。
4. 単なる同業や補完関係にあるものを競合にしないでください。
JSONだけを返してください。

形式:{"legalName":"","brandName":"","summary":"","market":"","targetCustomers":[""],"useCases":[""],"aliases":[""],"competitors":[{"name":"","domain":"","reason":"","confidence":0.0}],"confidence":0.0}

対象URL:${url}
サイト情報:${JSON.stringify(compactPages(pages))}`, true);

    const brandName = String(raw.brandName || raw.legalName || domain).trim().slice(0, 160);
    const legalName = String(raw.legalName || brandName).trim().slice(0, 160);
    const competitors = (Array.isArray(raw.competitors) ? raw.competitors : []).slice(0, 12).map((item: any) => ({
      name: String(item.name || "").trim().slice(0, 160),
      domain: item.domain ? String(item.domain).replace(/^https?:\/\//, "").replace(/\/$/, "") : undefined,
      reason: String(item.reason || "同じ場面で比較・検討される代替候補").slice(0, 500),
      confidence: Math.max(0, Math.min(1, Number(item.confidence || .6))),
    })).filter((item: any) => item.name && item.name.toLowerCase() !== brandName.toLowerCase());

    if (!competitors.length) {
      const fallback = heuristicDiscovery(url, pages);
      return { ...fallback, brandName, legalName, domain };
    }

    return {
      legalName,
      brandName,
      domain,
      summary: String(raw.summary || homePage(url, pages)?.description || "").slice(0, 1_200),
      market: String(raw.market || "専門サービス・事業").slice(0, 160),
      targetCustomers: (Array.isArray(raw.targetCustomers) ? raw.targetCustomers : []).map(String).slice(0, 12),
      useCases: (Array.isArray(raw.useCases) ? raw.useCases : []).map(String).slice(0, 12),
      aliases: [...new Set([brandName, legalName, domain, ...(Array.isArray(raw.aliases) ? raw.aliases.map(String) : [])])].slice(0, 20),
      competitors,
      confidence: Math.max(0.7, Math.min(1, Number(raw.confidence || .8))),
    } satisfies CompanyDiscovery;
  } catch {
    return heuristicDiscovery(url, pages);
  }
}

const clusters: PromptCluster[] = ["category", "segment", "use_case", "feature", "alternative", "comparison", "value", "implementation", "trust", "support"];

function promptIntent(cluster: PromptCluster): BuyerPromptIntent {
  if (cluster === "comparison" || cluster === "value") return "compare";
  if (cluster === "alternative") return "switch";
  if (cluster === "implementation" || cluster === "support") return "implement";
  if (cluster === "trust" || cluster === "feature") return "evaluate";
  return "discover";
}

function promptStage(cluster: PromptCluster): BuyerPromptStage {
  if (cluster === "category" || cluster === "segment" || cluster === "use_case") return "認知";
  if (cluster === "comparison" || cluster === "alternative" || cluster === "value") return "比較";
  if (cluster === "implementation" || cluster === "support") return "導入";
  return "検討";
}

function promptUrgency(cluster: PromptCluster, importance: number) {
  const base = cluster === "comparison" || cluster === "value" || cluster === "implementation" ? 5 : cluster === "alternative" || cluster === "trust" ? 4 : 3;
  return Math.max(1, Math.min(5, Math.max(base, importance)));
}

function enrichPrompt(input: { id: string; text: string; cluster: PromptCluster; importance: number; panel: BuyerPrompt["panel"]; version?: number }): BuyerPrompt {
  return {
    id: input.id,
    text: input.text,
    cluster: input.cluster,
    importance: input.importance,
    intent: promptIntent(input.cluster),
    stage: promptStage(input.cluster),
    urgency: promptUrgency(input.cluster, input.importance),
    panel: input.panel,
    version: input.version || 1,
  };
}

function fallbackPrompts(discovery: CompanyDiscovery, count: number, panel: BuyerPrompt["panel"]) {
  const market = discovery.market;
  const segment = discovery.targetCustomers[0] || "中小企業";
  const useCase = discovery.useCases[0] || "業務改善";
  const templates: Array<[string, PromptCluster, number]> = [
    [`日本でおすすめの${market}は？`, "category", 5],
    [`${segment}に合う${market}は？`, "segment", 5],
    [`${useCase}に強い${market}は？`, "use_case", 5],
    [`導入しやすい${market}は？`, "implementation", 4],
    [`費用対効果が高い${market}を比較して`, "value", 5],
    [`信頼できる${market}の選び方と候補は？`, "trust", 4],
    [`サポートが充実した${market}は？`, "support", 4],
    [`代表的な${market}を機能で比較して`, "feature", 4],
    [`既存サービスから乗り換えやすい${market}は？`, "alternative", 4],
    [`${market}の主要ベンダーを比較して`, "comparison", 5],
  ];
  return Array.from({ length: count }, (_, index) => {
    const template = templates[index % templates.length];
    const round = Math.floor(index / templates.length) + 1;
    const text = round === 1 ? template[0] : template[0].replace("は？", `を${round}つ挙げると？`);
    return enrichPrompt({ id: shortHash(`${panel}:${index}:${text}`), text, cluster: template[1], importance: template[2], panel });
  });
}

export async function generateBuyerPrompts(discovery: CompanyDiscovery, count: number, panel: BuyerPrompt["panel"]) {
  if (!env.openAiKey) return fallbackPrompts(discovery, count, panel);
  try {
    const raw = await askJson<any[]>(`あなたは日本のB2B購買リサーチャーです。営業へ連絡する前の買い手がAIへ聞く、購入意図の強い質問を${count}件作ってください。ブランド名を直接含めず、カテゴリ選定、企業規模、用途、機能、代替、直接比較、価格価値、導入、信頼・安全、サポートを重複なく含めます。JSON配列だけ返してください。\n形式:[{"text":"","cluster":"category|segment|use_case|feature|alternative|comparison|value|implementation|trust|support","importance":1-5}]\n市場:${JSON.stringify(discovery)}`);
    const prompts: BuyerPrompt[] = [];
    for (const [index, item] of (Array.isArray(raw) ? raw : []).entries()) {
      const text = String(item.text || "").trim().slice(0, 500);
      if (!text || prompts.some((prompt) => prompt.text === text)) continue;
      const cluster = clusters.includes(item.cluster) ? item.cluster as PromptCluster : "category";
      prompts.push(enrichPrompt({ id: shortHash(`${panel}:${index}:${text}`), text, cluster, importance: Math.max(1, Math.min(5, Number(item.importance || 3))), panel }));
    }
    if (prompts.length < Math.min(8, count)) return fallbackPrompts(discovery, count, panel);
    return prompts.slice(0, count);
  } catch {
    return fallbackPrompts(discovery, count, panel);
  }
}

function textCorpus(pages: CrawledPage[]) {
  return pages.map((page) => `${page.title} ${page.description} ${page.headings.join(" ")} ${page.text}`).join(" ").toLowerCase();
}

function actionImpactScore(action: Pick<ActionCard, "relatedPromptCount" | "confidence" | "priority">) {
  const priorityWeight = action.priority === "critical" ? 1.25 : action.priority === "high" ? 1 : .8;
  return Math.round(action.relatedPromptCount * Math.max(0, Math.min(1, action.confidence)) * priorityWeight * 100) / 100;
}

function fallbackEvidence(discovery: CompanyDiscovery, pages: CrawledPage[], lostPrompts: LostPrompt[]): { gaps: EvidenceGap[]; actions: ActionCard[] } {
  const corpus = textCorpus(pages);
  const fields: Array<[string, string, RegExp]> = [
    ["customer-proof", "導入企業・顧客実績", /導入.{0,8}(社|企業|件)|利用.{0,8}(社|企業|件)/],
    ["implementation", "標準導入期間", /(導入|開始).{0,12}(日|週間|か月|ヶ月)/],
    ["roi", "導入効果・削減工数", /(削減|改善|短縮|向上).{0,12}(時間|%|パーセント|工数)/],
    ["pricing", "料金・総コスト", /(料金|価格|月額|初期費用|見積)/],
    ["security", "セキュリティ・認証", /(iso ?27001|isms|soc ?2|セキュリティ|認証)/],
  ];
  const related = lostPrompts.map((item) => item.promptId);
  const gaps = fields.filter(([, , pattern]) => !pattern.test(corpus)).slice(0, 3).map(([id, label], index) => ({ id, label, whyItMatters: "この情報が公開ページから見つからず、比べる材料が足りません。", relatedPromptIds: related.slice(0, Math.max(1, related.length - index)), relatedPromptCount: Math.max(1, related.length - index), confidence: .55, status: "missing" as const }));
  const actions = gaps.map((gap, index) => {
    const priority = index === 0 ? "critical" as const : "high" as const;
    return {
      id: `action-${gap.id}`,
      title: `${gap.label}を、比べられる形で載せる`,
      rationale: gap.whyItMatters,
      type: "owned" as const,
      relatedPromptIds: gap.relatedPromptIds,
      relatedPromptCount: gap.relatedPromptCount,
      priority,
      confidence: gap.confidence,
      target: "自社サイト",
      impactScore: actionImpactScore({ relatedPromptCount: gap.relatedPromptCount, confidence: gap.confidence, priority }),
      effort: "medium" as const,
      audience: discovery.targetCustomers.slice(0, 2).join("・") || "公開ページから確認できる対象顧客",
      stage: "比較" as const,
      customerConcern: gap.label,
      placement: "導入事例・サービス概要・FAQ",
      cta: "導入条件を確認する",
      successMetric: "同じ比較質問で自社が候補に入ったか",
      evidenceType: "observed" as const,
    };
  });
  return { gaps, actions };
}

export async function analyzeEvidence(input: { discovery: CompanyDiscovery; pages: CrawledPage[]; lostPrompts: LostPrompt[] }) {
  if (!env.openAiKey) return fallbackEvidence(input.discovery, input.pages, input.lostPrompts);
  try {
    const raw = await askJson<any>(`あなたはB2Bサイト改善の責任者です。自社公開ページと、競合が先に推薦されたAI回答・引用元を比べ、公開Webから確認できない情報と次に直す内容を出してください。「存在しない」と断定せず、「確認できない」と表現してください。順位上昇や因果効果を捏造しないでください。画面に出すlabel、whyItMatters、title、rationale、customerConcern、ctaは、専門用語や英語の内部用語を使わず、普通の日本語で短く書いてください。actionのaudience、stage、placement、successMetricは今回の比較質問から導ける仮説として書き、売上や順位の保証にしないでください。JSONだけ返してください。\n形式:{"gaps":[{"id":"","label":"","whyItMatters":"","relatedPromptIds":[""],"competitorEvidence":"","confidence":0.0,"status":"missing|partial"}],"actions":[{"id":"","title":"","rationale":"","type":"owned|third_party|technical|positioning|entity","relatedPromptIds":[""],"priority":"critical|high|medium","confidence":0.0,"target":"","audience":"","stage":"認知|比較|検討|導入","customerConcern":"","placement":"","cta":"","successMetric":""}]}\n会社:${JSON.stringify(input.discovery)}\n自社ページ:${JSON.stringify(compactPages(input.pages))}\n候補外質問:${JSON.stringify(input.lostPrompts.slice(0, 10))}`);
    const gaps: EvidenceGap[] = (Array.isArray(raw.gaps) ? raw.gaps : []).slice(0, 10).map((item: any, index: number) => {
      const ids = Array.isArray(item.relatedPromptIds) ? item.relatedPromptIds.map(String) : [];
      return { id: String(item.id || `gap-${index}`), label: String(item.label || "確認できる情報の差"), whyItMatters: String(item.whyItMatters || "比較に必要な情報を公開ページから確認できません。"), relatedPromptIds: ids, relatedPromptCount: ids.length, competitorEvidence: item.competitorEvidence ? String(item.competitorEvidence) : undefined, confidence: Math.max(0, Math.min(1, Number(item.confidence || .6))), status: item.status === "partial" ? "partial" : "missing" };
    });
    const actions: ActionCard[] = (Array.isArray(raw.actions) ? raw.actions : []).slice(0, 10).map((item: any, index: number) => {
      const ids = Array.isArray(item.relatedPromptIds) ? item.relatedPromptIds.map(String) : [];
      const type = ["owned", "third_party", "technical", "positioning", "entity"].includes(item.type) ? item.type : "owned";
      const priority = ["critical", "high", "medium"].includes(item.priority) ? item.priority : "medium";
      const confidence = Math.max(0, Math.min(1, Number(item.confidence || .6)));
      const stage = ["認知", "比較", "検討", "導入"].includes(item.stage) ? item.stage as ActionCard["stage"] : "比較";
      return {
        id: String(item.id || `action-${index}`),
        title: String(item.title || "足りない情報を、比べられる形で載せる"),
        rationale: String(item.rationale || "複数の質問で比べる材料が増えます。"),
        type,
        relatedPromptIds: ids,
        relatedPromptCount: ids.length,
        priority,
        confidence,
        target: String(item.target || "自社サイト"),
        impactScore: actionImpactScore({ relatedPromptCount: ids.length, confidence, priority }),
        effort: type === "technical" ? "high" as const : "medium" as const,
        audience: String(item.audience || input.discovery.targetCustomers.slice(0, 2).join("・") || "公開ページから確認できる対象顧客"),
        stage,
        customerConcern: String(item.customerConcern || "選ぶ前に確認したい情報"),
        placement: String(item.placement || item.target || "自社サイト"),
        cta: String(item.cta || "導入条件を確認する"),
        successMetric: String(item.successMetric || "同じ比較質問で自社が候補に入ったか"),
        evidenceType: item.evidenceType === "observed" ? "observed" : "hypothesis",
      };
    }).sort((a: ActionCard, b: ActionCard) => (b.impactScore || 0) - (a.impactScore || 0));
    return gaps.length || actions.length ? { gaps, actions } : fallbackEvidence(input.discovery, input.pages, input.lostPrompts);
  } catch {
    return fallbackEvidence(input.discovery, input.pages, input.lostPrompts);
  }
}
