import { buildDirectPublicProfileDraft, buildPublicProfileDraft, toPublicProfile } from "@/lib/public-profile";
import {
  createPublicProfilePreview,
  getActivePublicProfileBySlug,
  getPublicProfile,
  listActivePublicProfiles,
  publishPublicProfile,
  revokePublicProfile,
  updatePublicProfileDirect,
} from "@/lib/storage";
import { getScan } from "@/lib/storage";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const responseHeaders = {
  "cache-control": "private, no-store",
  "referrer-policy": "no-referrer",
  "x-content-type-options": "nosniff",
};

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: responseHeaders });
}

function stringField(body: Record<string, unknown>, name: string) {
  const value = body[name];
  return typeof value === "string" ? value.trim() : "";
}

function objectBody(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function safeError(error: unknown) {
  if (!(error instanceof Error)) return "公開ページを作成できませんでした。";
  if (error.message === "診断結果が完成していません。" || error.message === "公開用の公式URLを確認できませんでした。") return error.message;
  if (error.message.startsWith("公開ページの期限は")) return error.message;
  return "公開ページを作成できませんでした。";
}

export async function POST(request: Request) {
  let body: Record<string, unknown> | null;
  try {
    body = objectBody(await request.json());
  } catch {
    return json({ error: "リクエストの形式が不正です。" }, 400);
  }
  if (!body) return json({ error: "リクエストの形式が不正です。" }, 400);

  const action = stringField(body, "action");
  try {
    if (action === "preview" || action === "deploy") {
      const scanId = stringField(body, "scanId");
      if (!scanId) return json({ error: "scanIdが必要です。" }, 400);
      const scan = await getScan(scanId);
      if (!scan) return json({ error: "診断結果が見つかりません。" }, 404);
      if (!scan.result) return json({ error: "診断結果が完成していません。" }, 409);

      const expiresInDays = body.expiresInDays;
      if (expiresInDays !== undefined && typeof expiresInDays !== "number") return json({ error: "期限の指定が不正です。" }, 400);
      const record = await createPublicProfilePreview(buildPublicProfileDraft(scan), {
        sourceScanId: scan.id,
        ...(expiresInDays === undefined ? {} : { expiresInDays }),
      });

      if (action === "deploy") {
        const published = await publishPublicProfile(record.id, record.token);
        const finalRecord = published || record;
        return json({
          profile: toPublicProfile(finalRecord),
          token: finalRecord.token,
          slug: finalRecord.slug,
          url: `/ai/company/${encodeURIComponent(finalRecord.slug)}`,
        }, 201);
      }

      return json({ profile: toPublicProfile(record), token: record.token }, 201);
    }

    if (action === "create_direct") {
      const brandName = stringField(body, "brandName");
      if (!brandName) return json({ error: "会社名または屋号を入力してください。" }, 400);

      const market = stringField(body, "market");
      const summary = stringField(body, "summary");
      const location = stringField(body, "location");
      const hours = stringField(body, "hours");
      const pricingInfo = stringField(body, "pricingInfo");

      const draft = buildDirectPublicProfileDraft({
        brandName,
        market,
        summary,
        location,
        hours,
        pricingInfo,
      });

      const record = await createPublicProfilePreview(draft, {
        sourceScanId: "direct-creation",
        expiresInDays: 30,
      });

      // 即時公開ステータスへ移行
      const published = await publishPublicProfile(record.id, record.token);
      const finalRecord = published || record;

      return json({
        profile: toPublicProfile(finalRecord),
        token: finalRecord.token,
        slug: finalRecord.slug,
        url: `/ai/company/${encodeURIComponent(finalRecord.slug)}`,
      }, 201);
    }

    if (action === "update_direct") {
      const slug = stringField(body, "slug");
      if (!slug) return json({ error: "slugが必要です。" }, 400);

      const brandName = stringField(body, "brandName");
      const market = stringField(body, "market");
      const summary = stringField(body, "summary");
      const location = stringField(body, "location");
      const hours = stringField(body, "hours");
      const pricingInfo = stringField(body, "pricingInfo");

      const targetUrl = `${env.siteUrl}/ai/company/${encodeURIComponent(slug)}`;
      const facts = [
        { label: "正式名称・屋号", value: brandName, sourceUrl: targetUrl },
        { label: "専門分野・業種", value: market, sourceUrl: targetUrl },
        { label: "所在地・対応エリア", value: location, sourceUrl: targetUrl },
        { label: "営業時間・受付体制", value: hours, sourceUrl: targetUrl },
        { label: "明瞭料金規約", value: pricingInfo, sourceUrl: targetUrl },
      ].filter((item) => item.value);

      const updated = await updatePublicProfileDirect(slug, {
        brandName: brandName || undefined,
        market: market || undefined,
        summary: summary || undefined,
        facts: facts.length ? facts : undefined,
      });

      if (!updated) return json({ error: "更新対象の公的台帳が見つかりません。" }, 404);
      return json({ profile: toPublicProfile(updated), success: true });
    }

    if (action === "publish" || action === "revoke") {
      const profileId = stringField(body, "profileId");
      const token = stringField(body, "token");
      if (!profileId || !token) return json({ error: "profileIdとtokenが必要です。" }, 400);
      const record = action === "publish"
        ? await publishPublicProfile(profileId, token)
        : await revokePublicProfile(profileId, token);
      if (!record) return json({ error: "公開ページが見つからないか、操作できない状態です。" }, 404);
      return json({ profile: toPublicProfile(record) });
    }

    return json({ error: "actionはpreview、create_direct、publish、revokeのいずれかです。" }, 400);
  } catch (error) {
    console.error("AI PROFILE ERROR:", error);
    return json({ error: error instanceof Error ? error.message : safeError(error) }, 400);
  }
}

/**
 * Public reads use `slug`; management reads require both profileId and token.
 * `active=1` is used by the public sitemap and returns safe views only.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const profileId = params.get("profileId")?.trim() || "";
  const token = params.get("token")?.trim() || "";
  if (profileId) {
    if (!token) return json({ error: "profileIdとtokenが必要です。" }, 401);
    const record = await getPublicProfile(profileId);
    if (!record || record.token !== token) return json({ error: "公開ページが見つかりません。" }, 404);
    return json({ profile: toPublicProfile(record) });
  }

  const slug = params.get("slug")?.trim() || "";
  if (slug) {
    const record = await getActivePublicProfileBySlug(slug);
    if (!record) return json({ error: "公開ページが見つかりません。" }, 404);
    return json({ profile: toPublicProfile(record) });
  }

  if (params.get("active") === "1") return json({ profiles: (await listActivePublicProfiles()).map(toPublicProfile) });
  return json({ error: "profileId、slug、またはactive=1を指定してください。" }, 400);
}
