import "server-only";

function value(name: string, fallback = "") {
  return process.env[name]?.trim() || fallback;
}

export const seller = {
  legalName: value("SELLER_LEGAL_NAME", "株式会社ジュジュベコンサルティング"),
  representative: value("SELLER_REPRESENTATIVE"),
  address: value("SELLER_ADDRESS"),
  phone: value("SELLER_PHONE"),
  email: value("SELLER_EMAIL"),
  supportHours: value("SELLER_SUPPORT_HOURS", "平日10:00〜17:00（日本時間・祝日を除く）"),
};

export function sellerReady() {
  return Boolean(seller.legalName && seller.representative && seller.address && seller.email);
}
