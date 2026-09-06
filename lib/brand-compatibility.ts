import { BRAND, DATA_DELETION_CONFIRMATION } from "./brand";

/** 旧バージョンの画面と既存のクロール拒否設定に対する互換性。 */
export const LEGACY_CRAWLER_AGENTS = ["aixnextbot", "aixbot"] as const;
export function isDataDeletionConfirmation(value: unknown): boolean {
  return value === DATA_DELETION_CONFIRMATION || value === "DELETE AIX DATA";
}

/** 企業名や本文中の文字を置換せず、サービスが付けた旧接尾辞だけを更新する。 */
export function currentProfileTitle(title: string, subject: string): string {
  const legacyTitles = new Set([
    `${subject} | AIX公開情報`,
    `${subject} | AIX Next公開情報`,
    `${subject} | ${BRAND.name}公開情報`,
    `${subject} 公開情報参照インデックス`,
  ]);
  return legacyTitles.has(title) ? `${subject} | ${BRAND.name}公開情報参照ページ` : title;
}

/** 保存済み原本には書き戻さず、配信用JSONの発行元だけを更新する。 */
export function currentProfileJson(source: string): string {
  try {
    const value = JSON.parse(source);
    if (!value || typeof value !== "object" || Array.isArray(value)) return source;
    if (value.publisher !== "AIX" && value.publisher !== "AIX Next") return source;
    value.publisher = BRAND.name;
    return `${JSON.stringify(value, null, 2)}\n`;
  } catch {
    return source;
  }
}

export function currentProfileMarkdown(source: string, previousTitle: string, title: string): string {
  const prefix = `# ${previousTitle}\n`;
  return previousTitle !== title && source.startsWith(prefix)
    ? `# ${title}\n${source.slice(prefix.length)}`
    : source;
}
