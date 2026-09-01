import { WatchView } from "@/components/watch-view";
import { demoWatch } from "@/lib/demo";

export const metadata = { title: "AIX Watch デモ", robots: { index: false, follow: false } };

export default function DemoWatchPage() {
  return <WatchView initial={demoWatch} token="demo-token" demo />;
}
