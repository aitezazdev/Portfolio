import { Geist, Geist_Mono, Space_Grotesk, Syne } from 'next/font/google';
import './globals.css';
import ClientLayout from './ClientLayout';
import { siteMetadata } from '@/lib/metadata';
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
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${syne.variable} antialiased bg-[#e8e8e3]`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
