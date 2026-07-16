/**
 * @license
 * Copyright (c) 2026 Aitezaz Sikandar. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 * Project: Portfolio-NextJs
 * Author: Aitezaz Sikandar (aitezazdev)
 * Website: https://aitezaz.xyz
 */

import { Geist, Geist_Mono, Space_Grotesk, Syne } from 'next/font/google';
import './globals.css';
import ClientLayout from './ClientLayout';
import { siteMetadata } from '@/lib/metadata';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  preload: true,
  display: 'swap',
});
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  preload: true,
  display: 'swap',
});
const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  preload: true,
  display: 'swap',
});
const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '700', '800'],
  preload: true,
  display: 'swap',
});
export const metadata = siteMetadata;
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${syne.variable} antialiased bg-[#e8e8e3]`}
      >
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
        <GoogleAnalytics gaId="G-Q2NJWQ3FKC" />
      </body>
    </html>
  );
}

