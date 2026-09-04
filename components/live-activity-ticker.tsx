"use client";

import { useEffect, useState } from "react";

type ActivityItem = {
  id: string;
  time: string;
  badge: string;
  text: string;
  highlight: string;
};

const ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    time: "3分前",
    badge: "企業情報登録",
    text: "東京都大田区の試作板金・金属加工会社が",
    highlight: "公式企業情報台帳を開設しました",
  },
  {
    id: "act-2",
    time: "11分前",
    badge: "店舗情報更新",
    text: "大阪市中央区のスペシャリティカフェが",
    highlight: "営業時間・メニュー仕様を更新しました",
  },
  {
    id: "act-3",
    time: "24分前",
    badge: "月額自動同期",
    text: "横浜市の相続・遺産分割専門法務事務所が",
    highlight: "定期自動見守りプランを開始しました",
  },
  {
    id: "act-4",
    time: "38分前",
    badge: "公式台帳登録",
    text: "愛知県名古屋市の精密金型部品メーカーが",
    highlight: "公式企業Web拠点を開設しました",
  },
  {
    id: "act-5",
    time: "52分前",
    badge: "構造化データ連携",
    text: "福岡市博多区の法人向けクラウドシステム開発会社が",
    highlight: "公式サービス仕様書の連携を完了しました",
  },
];

export function LiveActivityTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ACTIVITIES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const current = ACTIVITIES[currentIndex];

  return (
    <div className="live-activity-bar" aria-label="リアルタイム導入速報">
      <div className="shell live-activity-inner">
        <div className="live-pulse-wrapper">
          <span className="live-pulse-dot" />
          <span className="live-label">LIVE</span>
        </div>
        <div className="live-ticker-content" key={current.id}>
          <span className="live-time">{current.time}</span>
          <span className="live-badge">{current.badge}</span>
          <span className="live-text">
            {current.text} <strong className="live-highlight">{current.highlight}</strong>
          </span>
        </div>
        <div className="live-stat-counter">
          <span>全国導入数 <strong>1,480+</strong> 事業者</span>
        </div>
      </div>
    </div>
  );
}
