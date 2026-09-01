import Link from "next/link";

export function Brand() {
  return <Link className="brand" href="/" aria-label="AIX Next ホーム"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span><strong>AIX</strong><small>Buyer Intelligence</small></span></Link>;
}
