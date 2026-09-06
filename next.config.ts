import type { NextConfig } from "next";

const publicHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(self)" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const privateHeaders = [
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
  { key: "Cache-Control", value: "private, no-store" },
  { key: "Referrer-Policy", value: "no-referrer" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  async rewrites() {
    // Next route segments must be named `[slug]` to receive dynamic params;
    // keep the public `.json`/`.md` URLs while dispatching to the valid nested
    // route handlers.
    return [
      { source: "/ai/company/:slug.json", destination: "/ai/company/:slug/json" },
      { source: "/ai/company/:slug.md", destination: "/ai/company/:slug/md" },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: publicHeaders },
      { source: "/result", headers: privateHeaders },
      { source: "/watch", headers: privateHeaders },
      { source: "/api/:path*", headers: [
        { key: "Cache-Control", value: "no-store" },
        { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        { key: "Referrer-Policy", value: "no-referrer" },
      ] },
    ];
  },
};

export default nextConfig;
