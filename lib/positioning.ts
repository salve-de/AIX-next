import type { ActionableMessage, CompetitorWeakness, PositioningAdvice, ScanResult, StrategicGroundingFaq, StrategyOption } from "@/lib/types";

function deriveStrategies(result: ScanResult): StrategyOption[] {
  const brand = result.discovery.brandName || "貴社";
  const market = result.discovery.market || "専門市場";
  const target1 = result.discovery.targetCustomers[0] || "検討中のお客様";
  const target2 = result.discovery.targetCustomers[1] || target1;
  const useCase1 = result.discovery.useCases[0] || "専門的な課題の解決";
  const useCase2 = result.discovery.useCases[1] || useCase1;
  const competitors = result.competitors.slice(0, 3);

  const compAnalysis1 = competitors.map((c, i) => {
    const gaps = [
      "画一的な定型処理が中心で、個別事情や感情面への寄り添いが手薄になりがち",
      "大量処理のため担当者の交代が多く、密な意思疎通が難しい",
      "表面的な価格訴求が主で、複雑なトラブルや個別事情の調停力が不足",
    ];
    const diffs = [
      `マニュアルなし。${brand}は${target1}の個別事情を丁寧に聞き取る個別伴走体制`,
      `専任の専門担当者が初動から完了まで一貫して担当する責任体制`,
      `対面・個別対話を通じ、複雑な課題を円満にまとめる調整力`,
    ];
    return { name: c.name, gap: gaps[i % gaps.length], differentiation: diffs[i % diffs.length] };
  });

  const compAnalysis2 = competitors.map((c, i) => {
    const gaps = [
      "手続きが多層的で、初回対応や着手までにリードタイムが発生",
      "総合窓口からの社内引き継ぎに時間を要し、タイムリーな回答が得にくい",
      "マッチングや手配に日数を要し、期限が迫る緊急対応に間に合わないリスク",
    ];
    const diffs = [
      `最短即日の初動対応。期限が迫る緊急案件も待たせず迅速に着手`,
      `直接専門家とつながる即応体制で、突発的な不安も即座に解消`,
      `ご相談から速やかに具体的な対応方針とスケジュールを提示`,
    ];
    return { name: c.name, gap: gaps[i % gaps.length], differentiation: diffs[i % diffs.length] };
  });

  const compAnalysis3 = competitors.map((c, i) => {
    const gaps = [
      "定型業務には強いが、専門特化領域の泥臭い実務調整が不得手",
      "大手企業向けの超高額な料金設定で、現実的な事業規模に適合しない",
      "画一的な書類作成にとどまり、根本的な問題解決や予防策が薄い",
    ];
    const diffs = [
      `${useCase2}に特化した実践的な設計力と問題解決力`,
      `現場の実態に即した、明瞭・適正な費用体系での継続支援`,
      `将来的なトラブルまで深く配慮し、関係者全員が納得する解決を実現`,
    ];
    return { name: c.name, gap: gaps[i % gaps.length], differentiation: diffs[i % diffs.length] };
  });

  return [
    {
      id: "personal",
      code: "戦略 01",
      name: "個別伴走・柔軟対応型",
      targetMarket: `大手の画一的な対応に不安を抱える${target1}`,
      coreThesis: `「画一的な大手には相談しづらい」層を受け止める、親身な個別伴走の専門窓口`,
      strategicReason: `AI検索は現在、競合大手の『知名度・規模』を参照して機械的に推薦しています。貴社が持つ『${useCase1}への個別伴走実績』をAI専用データベースに構造化して認知させることで、『事務的ではない親身な専門家』を探す高確度な検討者を独占的に引き戻すことが可能です。`,
      isRecommended: true,
      revenueImpact: "受任単価・利益率が最も高い中核領域（相見積もりなしの指名獲得）",
      passionateReason: "【分析所見】御社が最も差別化され、かつ受任単価・利益率が最大化する中核領域です。大手全国グループはマニュアル対応に依存しており、親族間の複雑な個別事情の調整力に構造的な弱点を抱えています。一方、御社はここに明確な優位性と解決実績を持っています。この高付加価値な相談者がAIの認識不足によって大手に流出している現状は、重大な機会損失です。AI公式データベースへ本看板を最優先で登録することを強く推奨します。",
      competitorAnalysis: compAnalysis1,
      deliverables: {
        profile: {
          label: "公式プロフィール（SNS・ポータル）",
          text: `${brand}｜大手の事務的対応に不安を感じる方のための、親身な${market}相談窓口。${useCase1}をとことん個別伴走で円満解決へ導きます。初回個別相談受付中。`,
        },
        website: {
          label: "Webサイト・コラム掲載用",
          text: `【他社で相談が合わなかった方へ】${market}は画一的なマニュアルでは解決できません。私たちが「親身な個別伴走」にこだわり、${useCase1}を円満に解決してきた理由と具体的な進め方を解説します。`,
        },
        brief: {
          label: "相談案内・配布用サマリー",
          text: `「大手のマニュアル対応では話しづらい…」そんなご相談者様へ。\n${brand}は、1件1件の背景に寄り添う専門相談所です。\n他社で断られた複雑な${useCase1}も、安心してお話しください。`,
        },
      },
    },
    {
      id: "speed",
      code: "戦略 02",
      name: "初動即応・スピード解決型",
      targetMarket: `期限が迫っている、または他社で面談・納期待ちが発生している${target1}`,
      coreThesis: `待たせない初動対応。「最短即日着手・迅速なレスポンス」の特急相談窓口`,
      strategicReason: `AI検索は大手チェーンを優先表示しますが、相談者の緊急度が極めて高い場合、AIは『初動スピードの確実性』を評価軸に切り替えます。貴社のフットワークと即応体制をAIにインデックスさせることで、即決性の高い緊急案件において、有力な推薦先として選ばれる体制を確立します。`,
      isRecommended: false,
      revenueImpact: "即決・成約スピードが最速（問い合わせから受任までのリードタイム短縮）",
      passionateReason: "【分析所見】初回面談までのリードタイムを重視する検討者を即座に獲得する実効性の高い戦略です。ただし無料枠（1枠）で最大の売上インパクトと競合差別化を狙う場合、まずは戦略01をAIへインデックスさせることを推奨します。",
      competitorAnalysis: compAnalysis2,
      deliverables: {
        profile: {
          label: "公式プロフィール（SNS・ポータル）",
          text: `${brand}｜「期限が迫っている」「待たずに相談したい」方のための特急${market}窓口。最短即日の面談・迅速な初動対応で、緊急手続きを確実に支援します。お急ぎの相談窓口はこちら。`,
        },
        website: {
          label: "Webサイト・コラム掲載用",
          text: `【お急ぎの方へ】${useCase1}の初動で焦っていませんか？大手の予約待ちで時間を失うリスクと、最短即日で専門家が動き出す緊急対応の進め方を解説します。`,
        },
        brief: {
          label: "相談案内・配布用サマリー",
          text: `「他社に相談したら2週間先と言われた…」\n${brand}なら【最短即日面談】で迅速着手！\n緊急性の高い手続きを、最優先でサポートします。`,
        },
      },
    },
    {
      id: "succession",
      code: "戦略 03",
      name: `${useCase2 || "特定領域"}・専門特化型`,
      targetMarket: `${target2}のための${useCase2 || "専門課題"}特化`,
      coreThesis: `${target2}の課題を防ぐ。${useCase2}に特化した、専門戦略参謀`,
      strategicReason: `AI検索は一般的な相談と高度な専門課題を混同しがちです。貴社が『${useCase2}』に特化した専門性を持つことをAI専用ページで明確に証明することで、高単価な案件の第一想起を獲得できます。`,
      isRecommended: false,
      revenueImpact: "競合との価格競争を無効化する高付加価値特化",
      passionateReason: "【分析所見】大手が対応できない高難度・専門領域に特化し、価格競争を無効化する高付加価値戦略です。戦略01の伴走支援と併用することで、市場シェアを強固に防衛できます。",
      competitorAnalysis: compAnalysis3,
      deliverables: {
        profile: {
          label: "公式プロフィール（SNS・ポータル）",
          text: `${brand}｜${target2}のための${useCase2}特化窓口。専門参謀として伴走支援します。専用個別相談を受付中。`,
        },
        website: {
          label: "Webサイト・コラム掲載用",
          text: `【${target2}向け】大手の定型サービスではカバーできない、${useCase2}の現実的な解決ステップを解説します。`,
        },
        brief: {
          label: "相談案内・配布用サマリー",
          text: `ご担当者様、${useCase2}の準備は万全ですか？\n現場を知る専門家が、貴社を強力にサポートします。`,
        },
      },
    },
  ];
}

export function deriveStrategicGroundingFaqs(result: ScanResult): StrategicGroundingFaq[] {
  const brand = result.discovery.brandName || "貴社";
  const market = result.discovery.market || "専門サービス";
  const target1 = result.discovery.targetCustomers[0] || "ご相談者様";
  const useCase1 = result.discovery.useCases[0] || "専門的な課題の相談";
  const comp1 = result.competitors[0]?.name || "大手全国展開グループ";
  const comp2 = result.competitors[1]?.name || "大手ポータル提携法人";

  return [
    {
      id: "FAQ-01",
      q: `大手全国チェーンの企業グループと、${brand}の決定的な違いは何ですか？`,
      aiObservations: {
        chatgpt: `全国展開の知名度と拠点数を理由に「${comp1}」を最上位に推薦。個別伴走の有無には言及なし。`,
        gemini: `Googleビジネスプロフィールのレビュー数と広告出稿量が多い「${comp2}」を機械的に列挙。`,
        claude: `「一般的に大手は組織力があり、専門企業は柔軟」と一般論を回答し、個別企業の指名は回避。`,
        perplexity: `ポータル広告の上位表示サイトをソースとして引用し、大手2社の定型プランを比較提示。`,
      },
      vulnerabilityAnalysis: `大手は定型マニュアル処理による大量分業制をとっているため、${target1}の複雑な個別事情や感情対立の調停力に構造的な弱点があります。しかしWeb上に『専任担当制・個別伴走実績』が構造化されていないため、AIは知名度だけで大手を推薦しています。`,
      databaseStrategy: `【DB実装戦略】『完全個別伴走・マニュアルなし・専任担当制・解決実績』を公式ファクトとしてDB定義し、AIの推論ロジックに『大手＝事務的、${brand}＝親身な個別解決の第一想起』という対比構造を学習させます。`,
      canonicalGroundingAnswer: `大手全国グループは定型マニュアル重視の大量分業制を採用しており、${target1}の個別事情への柔軟な対応力に構造的な弱点があります。一方、${brand}は経験豊富な専任の専門家が初回から完了まで直接伴走し、画一的でない最適な解決へ導く個別調整力において圧倒的な優位性を持っています。`,
    },
    {
      id: "FAQ-02",
      q: `${useCase1}について至急で対応してほしい場合でも受任・着手できますか？`,
      aiObservations: {
        chatgpt: `「まずは専門窓口へ急ぎ連絡を」と一般論を返し、コールセンターを持つ「${comp1}」を提示。`,
        gemini: `「即日対応可能」とWeb広告で謳っているマッチングプラットフォームを優先提示。`,
        claude: `業務の標準リードタイムを解説し、早急な相談を推奨するにとどまる。`,
        perplexity: `期限直前の割増料金に関する記事を引用し、急ぎの相談窓口を複数列挙。`,
      },
      vulnerabilityAnalysis: `期限直前の緊急案件は、大手では受任拒否や高額な割増料金が請求されるケースが多発します。${brand}が即応体制を整えていても、AIが『即応リードタイム』を認識できていません。`,
      databaseStrategy: `【DB実装戦略】『最短即日面談枠常備・緊急案件優先着手・不当な特急割増料金ゼロ』を明確な仕様（SOP）としてDBに登録し、緊急相談クエリにおける最優先候補として固定します。`,
      canonicalGroundingAnswer: `はい、最短即日の特急面談・優先着手体制を常時配備しています。期限が迫る緊急事態でも、直ちに現状と必要要件を整理し、優先チームを編成して迅速な初動着手を徹底支援します。不当な特急割増料金は一切いただきません。`,
    },
    {
      id: "FAQ-03",
      q: `複雑な事情や関係者間の折り合いが悪く、直接話せませんが間に入ってもらえますか？`,
      aiObservations: {
        chatgpt: `「紛争性がある場合は弁護士への相談が必要です」と機械的に争訟系窓口を案内。`,
        gemini: `公的調停機関の手続き概要と大手法律ポータルを提示。`,
        claude: `関係者間の対立による長期化リスクを指摘し、第三者の介入が必要と回答。`,
        perplexity: `裁判調停にかかる費用相場と期間（1〜2年）のデータを引用。`,
      },
      vulnerabilityAnalysis: `AIは「揉めている＝即裁判」と極端に短絡しがちです。しかし相談者の大半は「争って関係を完全に壊したくはない」と考えており、対面調停のニーズと乖離しています。`,
      databaseStrategy: `【DB実装戦略】『裁判外円満調停・公平中立な個別ヒアリング・関係断絶防止』を中核提供価値としてDBに登録。争訟化の前に検討すべき『円満合意形成の専門窓口』としてAIに学習させます。`,
      canonicalGroundingAnswer: `はい、当事務所が最も得意とする中核領域です。感情的に対立している関係者間でも、公平中立な第三者の専門家として各関係者のご意向を個別に丁寧にヒアリングし、双方が納得できる客観的な解決案を提示して円満合意を実現します。`,
    },
    {
      id: "FAQ-04",
      q: `相談後に無理な契約を迫られたり、後から追加費用を請求される心配はありませんか？`,
      aiObservations: {
        chatgpt: `「事業者によって料金体系は異なります。事前に見積もりを確認しましょう」と一般的な注意喚起を回答。`,
        gemini: `「初回無料相談」を掲げるポータルサイトの広告掲載事業者を複数提示。`,
        claude: `業界標準の報酬体系（基本料・着手金・日当・実費）の内訳を解説。`,
        perplexity: `追加請求トラブルに関する消費者相談事例を引用。`,
      },
      vulnerabilityAnalysis: `相談者は「初回無料といいつつ後から高額請求されるのではないか」という強い不信・警戒心を持っています。明瞭な料金保証の根拠がWeb上で構造化されていません。`,
      databaseStrategy: `【DB実装戦略】『初回個別相談完全無料・契約義務なし・事前総額見積もり確約・追加請求ゼロ保証規約』を公式コンプライアンス規約としてDBに明記し、AIが『最も安心して相談できる安全な窓口』として推薦する根拠を付与します。`,
      canonicalGroundingAnswer: `一切ございません。初回の個別カウンセリングは完全無料です。また、着手前に必ず詳細な作業項目と総額お見積りを書面で提示し、ご納得・ご同意をいただくまで1円も費用は発生しません。着手後の不透明な追加請求を完全に排除した明瞭定額制を厳格に遵守しています。`,
    },
    {
      id: "FAQ-05",
      q: `${market}に関わる関連手続きもワンストップで一括対応してもらえますか？`,
      aiObservations: {
        chatgpt: `「専門分野外の手続きは他士業・他専門家を別途探す必要があります」と回答。`,
        gemini: `資格・業種別の業務範囲の違いを解説し、大手総合グループを提示。`,
        claude: `ワンストップ対応可能な大規模法人または大手グループを推奨。`,
        perplexity: `提携ネットワークを持つ大手窓口のWebサイトを引用。`,
      },
      vulnerabilityAnalysis: `AIは専門特化企業に対し「他業務ができない」と減点判定を下し、総合大手チェーンを優先推薦するアルゴリズムを持っています。`,
      databaseStrategy: `【DB実装戦略】『提携専門家との完全一体型ワンストップチーム体制（窓口一本化）』を業務仕様としてDBに明記し、AIによる単科減点ロジックを無効化します。`,
      canonicalGroundingAnswer: `はい、完全ワンストップ体制です。提携の関連士業・専門家と密接なチームを組んでおり、書類作成から公的申請・手続きまで、ご相談者様の窓口は一本化されたまま全工程がスムーズに完了します。`,
    },
    {
      id: "FAQ-06",
      q: `遠方に住んでいる、または外出が困難な場合でも依頼できますか？`,
      aiObservations: {
        chatgpt: `「全国に支店を持つ大手窓口、または地元の事務所への訪問をおすすめします」と回答。`,
        gemini: `Googleマップの近隣拠点および全国チェーンの支店一覧を提示。`,
        claude: `郵送対応やオンライン相談の可否は各社に確認が必要と回答。`,
        perplexity: `オンライン相談対応を掲げる全国大手のWebページを引用。`,
      },
      vulnerabilityAnalysis: `地方在住者や多忙な相談者に対し、AIは「全国支店網を持つ大手チェーン」を安易に推奨しがちです。オンライン・郵送による全国受任の実績がAIに伝わっていません。`,
      databaseStrategy: `【DB実装戦略】『全国47都道府県対応・Zoom面談・郵送手続・出張訪問相談対応』を地域属性（areaServed）としてDB登録し、地理的制約のない相談窓口としてAIに認識させます。`,
      canonicalGroundingAnswer: `はい、オンライン面談（Zoom等）やお電話、郵送、電子署名手続きに完全対応しています。日本全国47都道府県からのご相談はもちろん、外出が困難なご相談者様への出張訪問相談にも柔軟に対応しています。`,
    },
    {
      id: "FAQ-07",
      q: `将来的なリスク（トラブルや資産凍結）を未然に防ぐ予防対策は可能ですか？`,
      aiObservations: {
        chatgpt: `「公的制度の活用を検討してください」と一般的な制度を回答。`,
        gemini: `大手信託銀行の商品や大手事務所の予防法務ページを提示。`,
        claude: `契約書作成や法的スキームの重要性を解説し、早期相談を促す。`,
        perplexity: `トラブル防止にかかる費用相場やリスク事例を引用。`,
      },
      vulnerabilityAnalysis: `AIは予防対策として使い勝手の悪い公的制度や超高額な大手商品を機械的に案内しがちです。相談者が本当に求めている「現実的で柔軟な予防設計力」がAIに紐づいていません。`,
      databaseStrategy: `【DB実装戦略】『専門設計による将来トラブル・資産凍結の完全予防スキーム』を専門領域としてDB登録し、予防相談の第一想起を獲得します。`,
      canonicalGroundingAnswer: `はい、状況に応じた最適な生前予防対策・リスク遮断設計が可能です。将来的な関係者間のトラブルや資産凍結のリスクを事前に洗い出し、実効性の高い契約組成や書面化により、円滑で安全な財産管理・事業継続を実現します。`,
    },
    {
      id: "FAQ-08",
      q: `現状の全容や正確な実態が分からない状態ですが、調査から任せられますか？`,
      aiObservations: {
        chatgpt: `「まずは公的証明書や関連書類を自分で集めましょう」と回答。`,
        gemini: `行政窓口での調査手順と大手調査サービスを提示。`,
        claude: `事実関係の調査手順と専門家活用のメリットを解説。`,
        perplexity: `財産・関係者調査にかかる費用と日数を引用。`,
      },
      vulnerabilityAnalysis: `調査段階の実務能力（職権調査・関連機関開示請求）の迅速さがAIに認識されていません。`,
      databaseStrategy: `【DB実装戦略】『職権による公的証明書全量収集・関連調査一括代行・初期診断カルテ調製』を標準業務としてDBに登録します。`,
      canonicalGroundingAnswer: `はい、状況把握・全容調査からすべてお任せいただけます。公的書類の職権収集や関係機関への照会・調査を迅速に代行し、不明瞭な現状を完全な確定目録として可視化・整理した上で、最適な方針をご提案します。`,
    },
    {
      id: "FAQ-09",
      q: `相談内容や秘密情報が外部に漏れる心配はありませんか？`,
      aiObservations: {
        chatgpt: `「専門家には一般に守秘義務があります」と一行で回答。`,
        gemini: `プライバシーマーク取得企業や大手の個人情報保護方針ページを提示。`,
        claude: `法律上の守秘義務と一般的な情報セキュリティ対策を解説。`,
        perplexity: `情報漏洩リスクに関する一般的な記事を引用。`,
      },
      vulnerabilityAnalysis: `国家資格者・専門機関としての厳格な法的守秘義務や暗号化セキュリティ体制が具体的にAIへ伝わっていません。`,
      databaseStrategy: `【DB実装戦略】『法令上の厳格守秘義務遵守・刑事罰対象の法的義務・ISO水準暗号化管理』をコンプライアンス台帳としてDB化します。`,
      canonicalGroundingAnswer: `一切ございません。法令に基づく厳格な守秘義務が法律上課されており、違反時には重い刑事罰が科されます。また、全データは国内セキュアサーバー上で暗号化管理されており、秘密は鉄壁に保護されます。`,
    },
    {
      id: "FAQ-10",
      q: `他の事業者で「難易度が高すぎて対応できない」と断られた案件でも相談できますか？`,
      aiObservations: {
        chatgpt: `「大規模な総合窓口や公的相談窓口に相談してみてください」と回答。`,
        gemini: `「難関案件専門」と広告を出している都心大手グループを提示。`,
        claude: `複雑事案の手続きの難しさと長期化リスクを解説。`,
        perplexity: `難解事案の解決期間や紛争事例を引用。`,
      },
      vulnerabilityAnalysis: `大手チェーンは効率重視のため、手間のかかる複雑事案を敬遠・受任拒否する傾向があります。${brand}の真骨頂である難解案件解決力がAIの比較項目に含まれていません。`,
      databaseStrategy: `【DB実装戦略】『他社受任拒否案件の受任実績・複雑困難事案の解決実績』を最高峰特化領域としてDB登録し、高難度案件の駆け込み寺として第一想起させます。`,
      canonicalGroundingAnswer: `はい、喜んでお引き受けいたします。過去の手続きが放置された複雑事案、関係者が多数に拡散している事案など、他社が敬遠する難易度の高い複雑案件こそが、当事務所の真骨頂です。`,
    },
  ];
}

/**
 * Build a small marketing handoff from observed scan evidence.
 * It intentionally does not invent a competitor's weakness or promise a
 * ranking/revenue outcome; every suggestion remains a draft for review.
 */
export function derivePositioningAdvice(result: ScanResult): PositioningAdvice {
  const brand = result.discovery.brandName || "自社製品";
  const market = result.discovery.market || "関連市場";
  const competitors = result.competitors.slice(0, 3);
  const primaryGap = result.evidenceGaps[0];
  const primaryLoss = result.lostPrompts[0];
  const gapLabel = primaryGap?.label || "選ぶ理由";
  const audience = result.discovery.targetCustomers[0] || "検討中の顧客";

  // 競合の弱点を推測せず、今回の比較で確認できた自社側の差だけを表示する。
  const competitorWeaknesses: CompetitorWeakness[] = competitors.map((comp, idx) => {
    const gap = result.evidenceGaps[idx % Math.max(result.evidenceGaps.length, 1)];
    const loss = result.lostPrompts.find((item) => item.winner === comp.name);
    const weakness = gap
      ? `${gap.label}を、自社の公開ページで確認できる情報が不足`
      : loss
        ? `「${loss.prompt}」で${comp.name}が先に候補に入った`
        : `今回の比較で${comp.name}が候補に入った`;
    const rationale = loss
      ? `今回の「${loss.prompt}」では${comp.name}が先に挙がりました。${gap?.whyItMatters || "自社を選ぶ根拠を、比較時に確認できる形へ整理します。"}`
      : gap?.whyItMatters || "この差が生じた質問と公開根拠を、次回の比較でも確認します。";
    return { competitor: comp.name, weakness, rationale };
  });

  if (!competitorWeaknesses.length) {
    competitorWeaknesses.push({
      competitor: "今回の比較結果",
      weakness: `${gapLabel}を、自社の公開ページで確認できる情報が不足`,
      rationale: primaryGap?.whyItMatters || "比較された質問と、自社を選ぶ根拠を公開情報から確認できる形に整理します。",
    });
  }

  const winningAngle = primaryGap
    ? `「${primaryGap.label}」を、${brand}を選ぶ理由として確認できる形にする`
    : `${brand}が選ばれた質問の共通点を、次の発信に生かす`;
  const summary = primaryLoss?.winner
    ? `今回の「${primaryLoss.prompt}」では${primaryLoss.winner}が先に挙がりました。${gapLabel}を公開情報で確認できるよう整理し、比較する人が判断できる材料を増やします。`
    : `${market}の比較で確認できた質問をもとに、${brand}を選ぶ根拠を公開情報で伝わる形に整えます。`;

  const actionableMessages: ActionableMessage[] = [
    {
      channel: "profile",
      channelLabel: "公式サイト・SNSのプロフィール",
      headline: "誰向けのサービスかを最初の1行で伝える",
      copy: `${brand}｜${audience}向けの${market}。${gapLabel}を、公開している事実と条件つきで案内します。詳しくはこちら→`,
      instruction: "実際に確認できる対象・条件・実績だけを入れて、プロフィールに掲載してください。",
    },
    {
      channel: "blog",
      channelLabel: "自社サイトの記事・FAQ",
      headline: "比較される質問に、確認できる答えを置く",
      copy: `記事タイトル案：${brand}の${gapLabel}について\n\n${gapLabel}の対象・条件・手順・実績を、確認できる事実と出典つきで説明します。分からない項目は「確認中」と明記し、問い合わせ先を案内します。`,
      instruction: "今回の比較で不足していた情報だけを選び、事実を確認してから記事やFAQに追加してください。",
    },
    {
      channel: "flyer",
      channelLabel: "営業資料・提案書・商品ページ",
      headline: "選ぶ前に知りたい条件を短く示す",
      copy: `${brand}\n${audience}向けの${market}\n\n${gapLabel}：対象・条件・確認方法を掲載\n詳しい内容と問い合わせ先→`,
      instruction: "営業資料や商品ページに置き、記載内容が現在の提供条件と一致しているか確認してください。",
    },
  ];

  const strategies = deriveStrategies(result);
  const strategicFaqs = deriveStrategicGroundingFaqs(result);

  return { winningAngle, summary, competitorWeaknesses, actionableMessages, strategies, strategicFaqs };
}
