/** 正式名称の唯一の定義。機能名・法人名・契約IDとは区別する。 */
export const BRAND = {
  name: "Rovan",
  nameJa: "ロヴァン",
  slug: "rovan",
  crawler: "RovanBot",
} as const;
export const DATA_DELETION_CONFIRMATION = "DELETE ROVAN DATA";

/** 認証済みメールアドレスを保ち、表示する送信者名だけを統一する。 */
export function brandedEmailSender(value: string): string {
  const input = value.trim();
  const address = input.includes("<")
    ? input.match(/^[^<>\r\n]*<([^<>\r\n]+)>$/)?.[1]?.trim()
    : input;
  if (!address || !/^[^@\s<>]+@[^@\s<>]+$/.test(address)) return value;
  return `${BRAND.name} <${address}>`;
}
