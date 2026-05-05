import type { Metadata } from "next";
import Script from "next/script";
import { IBM_Plex_Sans, Sora, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const bodyFont = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const displayFont = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://piezo-sonar-lab.vercel.app";

export const metadata: Metadata = {
  title: "Piezo Sonar Lab | ピエゾ素子ソナー適性ラボ",
  description:
    "未知のピエゾ素子を実験しながら特性同定し、振動モードとソナー適性を判断するフロントエンドMVP。",
  metadataBase: new URL(siteUrl),
  applicationName: "Piezo Sonar Lab",
  keywords: [
    "piezo",
    "sonar",
    "impedance",
    "BVD",
    "resonance",
    "ultrasonic",
    "underwater acoustic",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Piezo Sonar Lab",
    description:
      "未知のピエゾ素子を測定、可視化、モード理解、ソナー適性診断まで導く実験ラボ。",
    url: siteUrl,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Piezo Sonar Lab",
    description:
      "ピエゾ素子の共振ピーク、BVD等価回路、振動モード、ソナー適性を一画面で確認。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable} antialiased`}>
        <Script
          id="ld-software"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Piezo Sonar Lab",
              applicationCategory: "EngineeringApplication",
              operatingSystem: "Web",
              description:
                "Frontend lab for piezo impedance visualization, resonance identification, BVD estimation, and sonar suitability scoring.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
