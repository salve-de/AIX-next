import { buildPublicProfileDraft, toPublicProfile } from "@/lib/public-profile";
import {
  createPublicProfilePreview,
  getActivePublicProfileBySlug,
  getPublicProfile,
  listActivePublicProfiles,
  publishPublicProfile,
  revokePublicProfile,
} from "@/lib/storage";
import { getScan } from "@/lib/storage";

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
    if (action === "preview") {
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
      return json({ profile: toPublicProfile(record), token: record.token }, 201);
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

    return json({ error: "actionはpreview、publish、revokeのいずれかです。" }, 400);
  } catch (error) {
    return json({ error: safeError(error) }, 400);
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
