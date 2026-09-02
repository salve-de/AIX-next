import Link from "next/link";

export function Brand() {
  return <Link className="brand" href="/" aria-label="AIX ホーム"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span><strong>AIX</strong><small>ChatGPT競合診断</small></span></Link>;
}
