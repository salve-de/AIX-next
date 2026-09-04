"use client";

import { useState } from "react";
import type { PublicProfile } from "@/lib/types";

export function DirectProfileEditor({ profile }: { profile: PublicProfile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [brandName, setBrandName] = useState(profile.brandName);
  const [market, setMarket] = useState(profile.market || "");
  const [summary, setSummary] = useState(profile.summary || "");
  
  const factMap = new Map((profile.facts || []).map((f) => [f.label, f.value]));
  const [location, setLocation] = useState(factMap.get("所在地・対応エリア") || "");
  const [hours, setHours] = useState(factMap.get("営業時間・受付体制") || "");
  const [pricingInfo, setPricingInfo] = useState(factMap.get("明瞭料金規約") || "");
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/ai-profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "update_direct",
          slug: profile.slug,
          brandName,
          market,
          summary,
          location,
          hours,
          pricingInfo,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "保存に失敗しました。");

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        window.location.reload();
      }, 1000);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "保存に失敗しました。");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="direct-editor-wrapper">
      <button
        className="button button-secondary direct-edit-trigger"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        この公式台帳の内容を編集する
      </button>

      {isOpen ? (
        <div className="direct-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="direct-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="direct-modal-header">
              <h3>公式データ台帳の直接編集</h3>
              <button className="direct-modal-close" type="button" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>
            <p className="direct-modal-lead">
              自社サイトをお持ちでない企業様でも、いつでも最新の営業時間・取扱品目・明瞭料金を直接更新できます。更新した内容は直ちにAI巡回用データ（Schema.orgおよびMarkdown）へ反映されます。
            </p>

            <div className="direct-modal-form">
              <div className="form-row">
                <label>正式名称・屋号</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="例: 山田板金製作所"
                />
              </div>

              <div className="form-row">
                <label>専門分野・主な取扱品目</label>
                <input
                  type="text"
                  value={market}
                  onChange={(e) => setMarket(e.target.value)}
                  placeholder="例: 精密板金加工、短納期試作"
                />
              </div>

              <div className="form-row">
                <label>所在地・対応エリア</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="例: 東京都大田区 / 全国対応"
                />
              </div>

              <div className="form-row">
                <label>営業時間・受付体制</label>
                <input
                  type="text"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="例: 平日 9:00〜18:00（土日祝事前予約可）"
                />
              </div>

              <div className="form-row">
                <label>明瞭料金規約・費用目安</label>
                <input
                  type="text"
                  value={pricingInfo}
                  onChange={(e) => setPricingInfo(e.target.value)}
                  placeholder="例: 事前総額見積もり制・不当な追加請求ゼロ確約"
                />
              </div>

              <div className="form-row">
                <label>強み・概要説明（AI推薦の根拠文）</label>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="例: 図面1枚から最短即日で精密試作品を製作。1個からの特注対応と職人の手作業による高品質仕上げが強み。"
                />
              </div>

              {error ? <p className="form-error">{error}</p> : null}
              {success ? <p className="form-success">✓ 更新が完了しました。画面を再読み込みします…</p> : null}

              <div className="direct-modal-actions">
                <button
                  className="button button-primary"
                  type="button"
                  disabled={saving}
                  onClick={() => void handleSave()}
                >
                  {saving ? "保存中…" : "台帳を更新してAIへ反映する"}
                </button>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => setIsOpen(false)}
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
