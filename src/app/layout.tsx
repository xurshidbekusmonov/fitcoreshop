import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FITCORESHOP - Original Sport Ozuqalari",
  description: "100% Original Sifat Kafolati. O'zbekiston bo'ylab yetkazib berish.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className="dark">
      <head>
        {/* Tailwind CSS har qanday holatda ham 100% ishlashini ta'minlaydi */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-[#0b0f19] text-gray-100 antialiased selection:bg-amber-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}