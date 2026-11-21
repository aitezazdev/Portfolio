import { Metadata } from 'next';

export const siteMetadata: Metadata = {
  title: {
    default: 'Aitezaz Sikandar | Full Stack Developer',
    template: '%s | Aitezaz Sikandar',
  },
  description:
    'Aitezaz Sikandar is a full-stack developer from Pakistan. He builds React, Next.js and MERN apps that keep working when a service fails.',
  keywords: [
    'Aitezaz Sikandar',
    'Web Developer',
    'Frontend Developer',
    'Full Stack Developer',
    'Next.js',
    'React',
    'JavaScript',
    'MERN Stack',
    'Portfolio',
  ],
  authors: [
    {
      name: 'Aitezaz Sikandar Khan',
    },
  ],
  creator: 'Aitezaz Sikandar',
  metadataBase: new URL('https://aitezazdev.vercel.app'),
  alternates: {
    canonical: './',
  },
  openGraph: {
    title: 'Aitezaz Sikandar | Full Stack Developer',
    description:
      'Full-stack developer from Pakistan. React, Next.js and MERN apps with real-time features, AI assistants and fallbacks built in.',
    url: 'https://aitezazdev.vercel.app',
    siteName: 'Aitezaz Sikandar Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Aitezaz Sikandar | Full Stack Developer',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aitezaz Sikandar | Full Stack Developer',
    description:
      'Full-stack developer from Pakistan. React, Next.js and MERN apps with real-time features, AI assistants and fallbacks built in.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

