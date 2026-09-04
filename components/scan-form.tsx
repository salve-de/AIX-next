"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowIcon } from "@/components/icons";

export function ScanForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [showExtra, setShowExtra] = useState(false);
  const [extraUrl, setExtraUrl] = useState("");
  const [extraSocial, setExtraSocial] = useState("");
  const [extraProduct, setExtraProduct] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = input.trim();
    if (!value) {
      setError("会社名・商品名・店舗名・Instagram・URLのどれか1つを入力してください。");
      return;
    }
    setError("");

    const query = new URLSearchParams();
    query.set("input", value);
    if (extraUrl.trim()) query.set("extraUrl", extraUrl.trim());
    if (extraSocial.trim()) query.set("extraSocial", extraSocial.trim());
    if (extraProduct.trim()) query.set("extraProduct", extraProduct.trim());

    router.push(`/scan?${query.toString()}`);
  }

  return (
    <div className="scan-form-outer">
      <form
        className={`scan-form ${compact ? "scan-form-compact" : ""}`}
        id={compact ? undefined : "scan"}
        onSubmit={submit}
        noValidate
      >
        <div className="scan-field">
          <input
            aria-label="会社名・商品名・店舗名・Instagramアカウント・URL"
            autoCapitalize="none"
            autoCorrect="off"
            inputMode="text"
            placeholder="会社名・店舗名（例: 山田板金 大田区）またはサイトURL"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <button type="submit">
            <span>{compact ? "無料診断" : "無料でAI推薦を調べる"}</span>
            <ArrowIcon />
          </button>
        </div>
        {error ? <p className="form-error" role="alert">{error}</p> : null}

        {!compact ? (
          <div className="extra-info-accordion">
            <button
              type="button"
              className="extra-info-toggle-btn"
              onClick={() => setShowExtra(!showExtra)}
            >
              {showExtra
                ? "▲ ホームページやInstagramの追加入力を閉じる"
                : "＋ サイトURLやInstagramもまとめて登録して精度を上げる（任意） ▾"}
            </button>

            {showExtra ? (
              <div className="extra-info-panel">
                <p className="extra-info-lead">
                  すべてお持ちの方は追加登録すると、AIの分析精度と公式台帳の網羅性が最大化されます（空欄のままでも診断可能）。
                </p>
                <div className="extra-info-grid">
                  <div className="extra-info-col">
                    <label>自社ホームページURL（任意）</label>
                    <input
                      type="text"
                      placeholder="例: https://yourcompany.jp"
                      value={extraUrl}
                      onChange={(e) => setExtraUrl(e.target.value)}
                    />
                  </div>
                  <div className="extra-info-col">
                    <label>Instagramアカウント（任意）</label>
                    <input
                      type="text"
                      placeholder="例: @your_shop_name"
                      value={extraSocial}
                      onChange={(e) => setExtraSocial(e.target.value)}
                    />
                  </div>
                  <div className="extra-info-col">
                    <label>主力商品・サービス名（任意）</label>
                    <input
                      type="text"
                      placeholder="例: 熟成黒にんにく、Nexoraクラウド"
                      value={extraProduct}
                      onChange={(e) => setExtraProduct(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </form>
    </div>
  );
}
