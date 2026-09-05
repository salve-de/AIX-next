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

  // 開いた時の一体型高精度フォーム
  if (!compact && showExtra) {
    return (
      <div className="scan-form-outer">
        <form className="scan-form-expanded" id="scan" onSubmit={submit} noValidate>
          <div className="expanded-header">
            <div className="expanded-title-row">
              <strong className="expanded-title">AI推薦 高精度診断フォーム</strong>
              <button
                type="button"
                className="expanded-close-btn"
                onClick={() => setShowExtra(false)}
              >
                − 簡易入力に戻す
              </button>
            </div>
            <p className="expanded-sub">会社名に加え、HPやSNSを連携するとAIの学習精度が最大化されます（空欄のままでも診断可能）。</p>
          </div>

          {/* メイン入力 */}
          <div className="expanded-field-main">
            <label htmlFor="scan-main-input">会社名・店舗名、またはサイトURL <span className="req-tag">必須</span></label>
            <input
              id="scan-main-input"
              aria-label="会社名・店舗名・サイトURL"
              autoCapitalize="none"
              autoCorrect="off"
              inputMode="text"
              placeholder="例: 山田板金 大田区、または https://yamada-bankin.jp"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              autoFocus
            />
          </div>

          {/* 3つの追加オプション入力 */}
          <div className="expanded-options-grid">
            <div className="expanded-field">
              <label htmlFor="extra-url">自社ホームページURL <span className="opt-tag">任意</span></label>
              <input
                id="extra-url"
                type="url"
                placeholder="https://example.com"
                value={extraUrl}
                onChange={(e) => setExtraUrl(e.target.value)}
              />
            </div>
            <div className="expanded-field">
              <label htmlFor="extra-social">Instagramアカウント <span className="opt-tag">任意</span></label>
              <input
                id="extra-social"
                type="text"
                placeholder="@your_account"
                value={extraSocial}
                onChange={(e) => setExtraSocial(e.target.value)}
              />
            </div>
            <div className="expanded-field">
              <label htmlFor="extra-product">主力商品・看板サービス名 <span className="opt-tag">任意</span></label>
              <input
                id="extra-product"
                type="text"
                placeholder="例: 特急試作板金、熟成にんにく"
                value={extraProduct}
                onChange={(e) => setExtraProduct(e.target.value)}
              />
            </div>
          </div>

          {error ? <p className="form-error" role="alert">{error}</p> : null}

          {/* 一体化した送信フッター：入力欄の直下に配置 */}
          <div className="expanded-footer">
            <span className="expanded-note">※ 営業電話・勝手な自動課金は一切ありません</span>
            <button type="submit" className="expanded-submit-btn">
              <span>無料でAI推薦を調べる</span>
              <ArrowIcon />
            </button>
          </div>
        </form>
      </div>
    );
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
              onClick={() => setShowExtra(true)}
              aria-expanded={false}
            >
              <span className="toggle-icon">＋</span>
              <span>Instagram・自社サイト・主力商品もまとめて連携して精度を上げる（任意）</span>
            </button>
          </div>
        ) : null}
      </form>
    </div>
  );
}
