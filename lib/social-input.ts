export type SocialInputInfo = {
  isSocial: boolean;
  platform?: "instagram" | "x" | "facebook" | "tiktok";
  username?: string;
  originalUrl?: string;
  displayLabel?: string;
};

export function parseSocialInput(raw: string): SocialInputInfo {
  const text = raw.trim();
  if (!text) return { isSocial: false };

  // 1. @username の形式
  if (/^@[a-z0-9._-]+$/i.test(text)) {
    const username = text.replace(/^@/, "");
    return {
      isSocial: true,
      platform: "instagram",
      username,
      originalUrl: `https://www.instagram.com/${username}/`,
      displayLabel: `Instagram (@${username})`,
    };
  }

  // 2. URL形式の判定
  try {
    const normalized = /^https?:\/\//i.test(text) ? text : `https://${text}`;
    const url = new URL(normalized);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const parts = url.pathname.split("/").filter(Boolean);

    if (host === "instagram.com") {
      const username = parts[0] || "";
      return {
        isSocial: true,
        platform: "instagram",
        username,
        originalUrl: url.toString(),
        displayLabel: username ? `Instagram (@${username})` : "Instagram公式アカウント",
      };
    }

    if (host === "x.com" || host === "twitter.com") {
      const username = parts[0] || "";
      return {
        isSocial: true,
        platform: "x",
        username,
        originalUrl: url.toString(),
        displayLabel: username ? `X (@${username})` : "X (Twitter)公式アカウント",
      };
    }

    if (host === "facebook.com") {
      return {
        isSocial: true,
        platform: "facebook",
        originalUrl: url.toString(),
        displayLabel: "Facebook公式ページ",
      };
    }

    if (host === "tiktok.com") {
      const username = parts[0]?.replace(/^@/, "") || "";
      return {
        isSocial: true,
        platform: "tiktok",
        username,
        originalUrl: url.toString(),
        displayLabel: username ? `TikTok (@${username})` : "TikTok公式アカウント",
      };
    }
  } catch {
    // URL解析失敗時は通常テキスト
  }

  return { isSocial: false };
}
