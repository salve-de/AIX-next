import Link from "next/link";
import { Logo } from "@/components/ui";

export default function NotFound() {
  return <main className="error-page"><Logo /><h1>ページが見つかりません。</h1><p>診断結果とWatchは非公開URLです。URLが途中で切れていないか確認してください。</p><Link className="button button-primary" href="/">無料診断へ戻る</Link></main>;
}
