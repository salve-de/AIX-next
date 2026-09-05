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

  // 開いた時の一体型高精度フォーム（全方位対応）
  if (!compact && showExtra) {
    return (
      <div className="scan-form-outer">
        <form className="scan-form-expanded" id="scan" onSubmit={submit} noValidate>
          <div className="expanded-header">
            <div className="expanded-title-row">
              <strong className="expanded-title">AI推薦 高精度診断フォーム（全クリエイター・事業者対応）</strong>
              <button
                type="button"
                className="expanded-close-btn"
                onClick={() => setShowExtra(false)}
              >
                − 簡易入力に戻す
              </button>
            </div>
            <p className="expanded-sub">会社・店舗はもちろん、インフルエンサーやクリエイター、個人事業主も、SNSや実績を連携するとAIの学習・推薦精度が最大化されます（空欄のままでも診断可能）。</p>
          </div>

          {/* メイン入力 */}
          <div className="expanded-field-main">
            <label htmlFor="scan-main-input">会社名・店舗名・活動名（地域併記推奨）、またはメインURL <span className="req-tag">必須</span></label>
            <input
              id="scan-main-input"
              aria-label="会社名・店舗名・活動名・URL"
              autoCapitalize="none"
              autoCorrect="off"
              inputMode="text"
              placeholder="例: 山田板金 大田区、HIKAKIN、青葉カフェ、または https://yamada-bankin.jp"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              autoFocus
            />
          </div>

          {/* 3つの追加オプション入力 */}
          <div className="expanded-options-grid">
            <div className="expanded-field">
              <label htmlFor="extra-social">X（旧Twitter）/ Instagram <span className="opt-tag">任意</span></label>
              <input
                id="extra-social"
                type="text"
                placeholder="@your_account またはURL"
                value={extraSocial}
                onChange={(e) => setExtraSocial(e.target.value)}
              />
            </div>
            <div className="expanded-field">
              <label htmlFor="extra-url">HP / YouTube / note / リンク集 <span className="opt-tag">任意</span></label>
              <input
                id="extra-url"
                type="url"
                placeholder="https://... または Lit.link"
                value={extraUrl}
                onChange={(e) => setExtraUrl(e.target.value)}
              />
            </div>
            <div className="expanded-field">
              <label htmlFor="extra-product">専門分野・看板実績・主力サービス <span className="opt-tag">任意</span></label>
              <input
                id="extra-product"
                type="text"
                placeholder="例: コスメ紹介、特急試作板金、相続専門"
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
            aria-label="会社名・店舗名・活動名・URL"
            autoCapitalize="none"
            autoCorrect="off"
            inputMode="text"
            placeholder="会社名・店舗名 ＋ 地域（例: 青葉ベーカリー 高崎、山田板金 大田区、HIKAKIN）またはURL"
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
          <p className="scan-form-note" style={{ color: "#64748b", fontSize: "0.72rem", marginTop: "6px" }}>
            ※ 同名店舗・他社との混同を防ぐため「店名 ＋ 地域（例: さくらベーカリー 世田谷）」の入力も可能です
          </p>
        ) : null}

        {!compact ? (
          <div className="scan-extra-section">
            <button
              type="button"
              className="scan-extra-toggle"
              onClick={() => setShowExtra(true)}
              aria-expanded={false}
            >
              <span className="toggle-icon">＋</span>
              <span>X・Instagram・YouTube・自社サイトもまとめて連携して精度を上げる（任意）</span>
            </button>
          </div>
        ) : null}
      </form>
    </div>
  );
}
