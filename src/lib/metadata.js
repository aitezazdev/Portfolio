export const siteMetadata = {
  title: {
    default: 'Aitezaz Sikandar - Full Stack Developer',
    template: '%s | Aitezaz Sikandar',
  },
  description:
    'Web developer specializing in React, Next.js, and MERN Stack development. Building fast, scalable, and user-focused web applications.',
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
  metadataBase: new URL('https://aitezaz.xyz'),
  icons: {
    icon: '/logo.webp',
  },
  openGraph: {
    title: 'Aitezaz Sikandar - Full Stack Developer',
    description:
      'Portfolio of Aitezaz Sikandar, Full Stack Developer specializing in MERN stack, Next.js, and polished web experiences.',
    url: 'https://aitezaz.xyz',
    siteName: 'Aitezaz Sikandar Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Aitezaz Sikandar - Full Stack Developer',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aitezaz Sikandar - Full Stack Developer',
    description:
      'Portfolio of Aitezaz Sikandar, Full Stack Developer specializing in MERN stack, Next.js, and polished web experiences.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};
