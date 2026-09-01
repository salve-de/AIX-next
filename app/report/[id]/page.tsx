import { notFound } from "next/navigation";
import { ReportView } from "@/components/report-view";
import { getScan } from "@/lib/store";

export const metadata = { title: "AI市場診断レポート", robots: { index: false, follow: false } };

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scan = await getScan(id);
  if (!scan?.result) notFound();
  return <ReportView result={scan.result} />;
}
