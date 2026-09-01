import { notFound } from "next/navigation";
import { WatchView } from "@/components/watch-view";
import { getWatch } from "@/lib/store";

export const metadata = { title: "AIX Watch", robots: { index: false, follow: false } };

export default async function WatchPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ token?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const token = query.token || "";
  const watch = await getWatch(id, token);
  if (!watch) notFound();
  return <WatchView initial={watch} token={token} />;
}
