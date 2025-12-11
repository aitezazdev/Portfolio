import { Geist, Geist_Mono, Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "700", "800"],
});

export const metadata = {
  title: "My Portfolio",
  description: "created by next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${syne.variable} antialiased bg-[#e8e8e3]`}>
        <div className="page-overlay"></div>

        <Providers>
          <SmoothScrollProvider>
            <main>{children}</main>
          </SmoothScrollProvider>
        </Providers>
      </body>
    </html>
  );
}
