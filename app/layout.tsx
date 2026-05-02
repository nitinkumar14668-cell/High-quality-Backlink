import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RankBoost SEO - Auto Backlink Generator",
  description: "High DA backlink generator and tracker. Automatically create profile/stats backlinks and track high-quality manual submissions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
