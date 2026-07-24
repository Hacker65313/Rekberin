import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Rekber Market — Marketplace Online Modern',
    template: '%s · Rekber Market',
  },
  description:
    'Rekber Market adalah marketplace online modern dengan sistem rekber (rekening bersama) yang aman, cepat, dan mudah. Belanja produk terbaik dari ribuan toko terpercaya.',
  keywords: [
    'marketplace',
    'rekber',
    'belanja online',
    'toko online',
    'jual beli aman',
    'shopee alternatif',
  ],
  authors: [{ name: 'Rekber Market' }],
  openGraph: {
    title: 'Rekber Market — Marketplace Online Modern',
    description:
      'Marketplace online modern dengan sistem rekber yang aman dan terpercaya.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Rekber Market',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rekber Market',
    description: 'Marketplace online modern dengan sistem rekber yang aman.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#F97316',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
