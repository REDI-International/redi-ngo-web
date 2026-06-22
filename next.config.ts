import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "redi-ngo.eu", pathname: "/wp-content/**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/about-redi", destination: "/about", permanent: true },
      { source: "/about-redi/", destination: "/about", permanent: true },
      { source: "/projects-list", destination: "/projects", permanent: true },
      { source: "/projects-list/", destination: "/projects", permanent: true },
      { source: "/who-we-are", destination: "/about", permanent: true },
      { source: "/who-we-are/", destination: "/about", permanent: true },
      { source: "/contact-page", destination: "/contact", permanent: true },
      { source: "/contact-page/", destination: "/contact", permanent: true },
      { source: "/tenders", destination: "/work-with-us/tenders", permanent: true },
      { source: "/tenders/", destination: "/work-with-us/tenders", permanent: true },
      { source: "/vacancies", destination: "/work-with-us/jobs", permanent: true },
      { source: "/vacancies/", destination: "/work-with-us/jobs", permanent: true },
      { source: "/our-gallery", destination: "/media", permanent: true },
      { source: "/our-gallery/", destination: "/media", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
