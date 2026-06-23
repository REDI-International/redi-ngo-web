import type { Metadata } from "next";
import { Outfit, Source_Sans_3 } from "next/font/google";
import "../globals.css";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], display: "swap" });
const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "REDI Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${sourceSans.variable} h-full`}>
      <body className="min-h-full bg-surface antialiased">{children}</body>
    </html>
  );
}
