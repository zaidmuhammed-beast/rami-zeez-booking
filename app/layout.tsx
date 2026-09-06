import type { Metadata, Viewport } from "next";
import { Poppins, Plus_Jakarta_Sans } from "next/font/google";
import { EVENT } from "@/lib/constants";
import "./globals.css";

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const displayFont = Poppins({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
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
