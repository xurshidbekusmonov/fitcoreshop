import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FITCORESHOP — Do‘kon',
  description: 'Sport oziq-ovqatlari va vitaminlar',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}