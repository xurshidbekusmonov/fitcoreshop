import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FITCORESHOP - Original Sport Ozuqalari",
  description:
    "100% Original Sifat Kafolati. O'zbekiston bo'ylab yetkazib berish.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body className="antialiased">{children}</body>
    </html>
  );
}
