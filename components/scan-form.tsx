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
      setError("会社名・店舗名、またはサイトURLを入力してください。");
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
            aria-label="会社名・店舗名・サイトURL"
            autoCapitalize="none"
            autoCorrect="off"
            inputMode="text"
            placeholder="会社名・店舗名（例: 山田板金 大田区）またはURL"
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
          <div className="scan-extra-section">
            <button
              type="button"
              className="scan-extra-toggle"
              onClick={() => setShowExtra(!showExtra)}
              aria-expanded={showExtra}
            >
              <span className="toggle-icon">{showExtra ? "−" : "＋"}</span>
              <span>Instagram・自社サイト・主力商品も連携して精度を最大化する（任意）</span>
            </button>

            {showExtra ? (
              <div className="scan-extra-card">
                <div className="extra-card-header">
                  <strong>高精度連携オプション</strong>
                  <p>お持ちの情報をご入力いただくと、AIがより深い強みまで学習し、推薦カルテの精度が最大化されます（空欄のままでも診断可能）。</p>
                </div>
                <div className="scan-extra-grid">
                  <div className="scan-extra-field">
                    <label htmlFor="extra-url">自社ホームページURL</label>
                    <input
                      id="extra-url"
                      type="url"
                      placeholder="https://example.com"
                      value={extraUrl}
                      onChange={(e) => setExtraUrl(e.target.value)}
                    />
                  </div>
                  <div className="scan-extra-field">
                    <label htmlFor="extra-social">Instagramアカウント</label>
                    <input
                      id="extra-social"
                      type="text"
                      placeholder="@your_account"
                      value={extraSocial}
                      onChange={(e) => setExtraSocial(e.target.value)}
                    />
                  </div>
                  <div className="scan-extra-field">
                    <label htmlFor="extra-product">主力商品・看板サービス名</label>
                    <input
                      id="extra-product"
                      type="text"
                      placeholder="例: 特急試作板金、熟成にんにく"
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
