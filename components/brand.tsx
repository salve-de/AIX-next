import { BRAND } from "@/lib/brand";
import Link from "next/link";

export function Brand() {
  return <Link className="brand" href="/" aria-label={`${BRAND.name}（${BRAND.nameJa}）ホーム`}><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span><strong>{BRAND.name}</strong><small>生成AI・回答測定</small></span></Link>;
}
