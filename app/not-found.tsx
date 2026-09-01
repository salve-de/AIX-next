import Link from "next/link";
import { Brand } from "@/components/brand";

export default function NotFound() {
  return <main className="empty-page"><Brand /><p className="eyebrow">404</p><h1>ページが見つかりません。</h1><p>診断結果とWatchは非公開Tokenを含みます。URLが途中で欠けていないか確認してください。</p><Link className="button button-dark" href="/">無料診断へ戻る</Link></main>;
}
