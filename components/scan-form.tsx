"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowIcon } from "@/components/icons";

type InputType = "any" | "company" | "product" | "instagram" | "website";

const typePlaceholders: Record<InputType, { label: string; placeholder: string; hint: string }> = {
  any: {
    label: "どれでもOK",
    placeholder: "会社名・商品名・@instagram_id・サイトURLのどれか1つ",
    hint: "どれか1つだけでも即座に診断・世界唯一のAI公式Web拠点を発行できます。",
  },
  company: {
    label: "🏢 会社名・店舗名",
    placeholder: "例: 株式会社〇〇、山田板金製作所、青葉法律事務所、田中農園",
    hint: "自社サイトがなくてもOK。会社名・屋号だけでAI公式Web拠点を発行します。",
  },
  product: {
    label: "📦 商品・サービス名",
    placeholder: "例: 熟成黒にんにく、Nexoraクラウド、無添加シャンプー、匠の包丁",
    hint: "商品名・サービス名単体でOK。AIが第一想起で推薦する商品専用台帳を発行します。",
  },
  instagram: {
    label: "📸 Instagram",
    placeholder: "例: @your_shop_name、または instagram.com/your_shop",
    hint: "インスタをHP代わりにしている方へ。AIが100%理解できる公的ナレッジを発行します。",
  },
  website: {
    label: "🌐 サイトURL",
    placeholder: "例: https://yourcompany.jp、または yoursite.com",
    hint: "自社ホームページのURLを入力すると、公開ページを自動巡回して診断します。",
  },
};

export function ScanForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<InputType>("any");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = input.trim();
    if (!value) {
      setError("入力してください（会社名、商品名、Instagram、URLのどれでも構いません）。");
      return;
    }
    setError("");
    const kindParam = selectedType !== "any" ? `&kind=${encodeURIComponent(selectedType)}` : "";
    router.push(`/scan?input=${encodeURIComponent(value)}${kindParam}`);
  }

  const current = typePlaceholders[selectedType];

  return (
    <div className="scan-form-outer">
      {!compact ? (
        <div className="scan-type-pills" role="tablist" aria-label="入力する項目を選択">
          <span className="pills-title">どれか1つ選んで入力：</span>
          {(Object.keys(typePlaceholders) as InputType[]).map((type) => (
            <button
              key={type}
              type="button"
              className={`scan-type-pill ${selectedType === type ? "active" : ""}`}
              onClick={() => {
                setSelectedType(type);
                setError("");
              }}
            >
              {typePlaceholders[type].label}
            </button>
          ))}
        </div>
      ) : null}

      <form
        className={`scan-form ${compact ? "scan-form-compact" : ""}`}
        id={compact ? undefined : "scan"}
        onSubmit={submit}
        noValidate
      >
        <div className="scan-field">
          <input
            aria-label={current.label}
            autoCapitalize="none"
            autoCorrect="off"
            inputMode="text"
            placeholder={current.placeholder}
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <button type="submit">
            <span>{compact ? "無料で診断" : "無料で理由を診断する"}</span>
            <ArrowIcon />
          </button>
        </div>
        <p className="scan-form-note">
          {current.hint}
        </p>
        {error ? <p className="form-error" role="alert">{error}</p> : null}
      </form>
    </div>
  );
}
