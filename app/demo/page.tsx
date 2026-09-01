import { ReportView } from "@/components/report-view";
import { demoResult } from "@/lib/demo";

export const metadata = { title: "架空企業の診断デモ", robots: { index: false, follow: false } };

export default function DemoPage() {
  return <ReportView result={demoResult} demo />;
}
