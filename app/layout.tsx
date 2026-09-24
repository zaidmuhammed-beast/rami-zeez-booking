import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { EVENT } from "@/lib/constants";
import "./globals.css";

// Self-hosted rather than fetched from Google at build time: a blip on
// fonts.gstatic.com used to fail the whole Vercel build.
const bodyFont = localFont({
  src: "./fonts/PlusJakartaSans-Variable.woff2",
  variable: "--font-body",
  weight: "400 700",
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
});

const displayFont = localFont({
  src: [
    { path: "./fonts/Poppins-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Poppins-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Poppins-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
});

const description = `${EVENT.tagline} — ${EVENT.dateLabel}, ${EVENT.timeLabel}. Paint, jam and play your way through an evening built for meeting people. Book your spot with ${EVENT.brand}.`;

export const metadata: Metadata = {
  title: `${EVENT.name} — ${EVENT.tagline} | ${EVENT.brand}`,
  description,
  openGraph: {
    title: `${EVENT.name} — ${EVENT.tagline}`,
    description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e1033",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
