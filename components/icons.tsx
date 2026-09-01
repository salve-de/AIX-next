import type { SVGProps } from "react";

function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>;
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) { return <Icon {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></Icon>; }
export function SparkIcon(props: SVGProps<SVGSVGElement>) { return <Icon {...props}><path d="M12 2 14 9l7 3-7 3-2 7-2-7-7-3 7-3 2-7Z" /></Icon>; }
export function BuildingIcon(props: SVGProps<SVGSVGElement>) { return <Icon {...props}><path d="M4 21V6l8-3 8 3v15" /><path d="M8 9h1M8 13h1M8 17h1M15 9h1M15 13h1M15 17h1M2 21h20" /></Icon>; }
export function NetworkIcon(props: SVGProps<SVGSVGElement>) { return <Icon {...props}><circle cx="12" cy="5" r="2" /><circle cx="5" cy="18" r="2" /><circle cx="19" cy="18" r="2" /><path d="m11 7-5 9m7-9 5 9M7 18h10" /></Icon>; }
export function BotIcon(props: SVGProps<SVGSVGElement>) { return <Icon {...props}><rect x="4" y="7" width="16" height="12" rx="3" /><path d="M9 12h.01M15 12h.01M9 16h6M12 7V3m-2 0h4" /></Icon>; }
export function TrophyIcon(props: SVGProps<SVGSVGElement>) { return <Icon {...props}><path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" /><path d="M8 6H4v1a4 4 0 0 0 4 4m8-5h4v1a4 4 0 0 1-4 4M12 12v5m-4 4h8m-6-4h4" /></Icon>; }
export function WarningIcon(props: SVGProps<SVGSVGElement>) { return <Icon {...props}><path d="m12 3 9 17H3L12 3Z" /><path d="M12 9v4m0 3h.01" /></Icon>; }
export function EvidenceIcon(props: SVGProps<SVGSVGElement>) { return <Icon {...props}><path d="M6 3h9l3 3v15H6V3Z" /><path d="M14 3v4h4M9 11h6M9 15h6M9 19h4" /></Icon>; }
export function TrendIcon(props: SVGProps<SVGSVGElement>) { return <Icon {...props}><path d="M3 18 9 12l4 4 8-10" /><path d="M15 6h6v6" /></Icon>; }
export function CheckIcon(props: SVGProps<SVGSVGElement>) { return <Icon {...props}><path d="m5 12 4 4L19 6" /></Icon>; }
export function ArrowIcon(props: SVGProps<SVGSVGElement>) { return <Icon {...props}><path d="M5 12h14m-5-5 5 5-5 5" /></Icon>; }
export function QuoteIcon(props: SVGProps<SVGSVGElement>) { return <Icon {...props}><path d="M9 11H4a5 5 0 0 1 5-5v11H4m16-6h-5a5 5 0 0 1 5-5v11h-5" /></Icon>; }
export function EyeIcon(props: SVGProps<SVGSVGElement>) { return <Icon {...props}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></Icon>; }
export function LockIcon(props: SVGProps<SVGSVGElement>) { return <Icon {...props}><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></Icon>; }
