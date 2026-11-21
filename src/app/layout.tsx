// Made by Aitezaz Sikandar - https://aitezazdev.vercel.app


import type { Viewport } from 'next';
import './globals.css';
import ClientLayout from './ClientLayout';
import { siteMetadata } from '@/lib/metadata';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { site, socials } from '@/lib/site';

export const metadata = siteMetadata;

export const viewport: Viewport = {
  themeColor: '#11100E',
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  url: site.url,
  jobTitle: 'Full Stack Developer',
  email: `mailto:${site.email}`,
  image: `${site.url}/icon-512.png`,
  sameAs: [socials.github.href, socials.linkedin.href, socials.instagram.href],
  knowsAbout: ['React', 'Next.js', 'Node.js', 'MongoDB', 'TypeScript', 'MERN Stack'],
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html:
              "(function(d){d.classList.add('js');try{var r=matchMedia('(prefers-reduced-motion: reduce)').matches;var a=+localStorage.getItem('preloader-seen-at')||0;if(!r&&!(a&&Date.now()-a<43200000))d.classList.add('pl')}catch(e){}})(document.documentElement)", }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body
        className="antialiased bg-cream"
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}

