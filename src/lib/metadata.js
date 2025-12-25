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
  authors: [{ name: 'Aitezaz Sikandar Khan' }],
  creator: 'Aitezaz Sikandar',
  metadataBase: new URL('https://aitezazdev.vercel.app'),
  icons: {
    icon: '/logo.webp'
  },
  openGraph: {
    title: 'Aitezaz Sikandar - Full Stack Developer',
    description:
      'Portfolio of Aitezaz Sikandar, a web developer building modern, high-performance web applications.',
    url: 'https://aitezazdev.vercel.app',
    siteName: 'Aitezaz Sikandar Portfolio',
    images: [
      {
        url: '/zazkhan.webp',
        width: 1200,
        height: 630,
        alt: 'Aitezaz Sikandar — Full Stack Developer',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aitezaz Sikandar — Web Developer',
    description: 'Web developer focused on React, Next.js, and performance-driven UI.',
    images: ['/zazkhan.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};
