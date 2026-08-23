export const site = {
  name: 'Aitezaz Sikandar',
  firstName: 'Aitezaz',
  lastName: 'Sikandar',
  handle: 'aitezazdev',
  brand: 'aitezaz.dev',
  email: 'aitezazsikandar@gmail.com',
  location: 'Pakistan',
  timeZone: 'Asia/Karachi',
  timeZoneLabel: 'PKT',
  url: 'https://aitezaz.xyz',
  tagline: 'Full Stack Developer crafting fast, expressive web experiences.',
  roles: [
    'Full Stack Developer',
    'React & Next.js Engineer',
    'MERN Stack Developer',
    'Open to Work Worldwide',
  ],
} as const;

export type SocialKey = 'github' | 'linkedin' | 'instagram' | 'source';

export const socials: Record<SocialKey, { label: string; href: string }> = {
  github: { label: 'GitHub', href: 'https://github.com/aitezazdev' },
  linkedin: { label: 'Linkedin', href: 'https://linkedin.com/in/aitezaz-sikandar' },
  instagram: { label: 'Instagram', href: 'https://instagram.com/ur_zaz' },
  source: { label: 'Source Code', href: 'https://github.com/aitezazdev/Portfolio' },
};

export const socialList: Array<{ label: string; href: string }> = [
  socials.linkedin,
  socials.instagram,
  socials.github,
  socials.source,
];

export const navLinks = [
  { name: 'Home', href: '/#top', menuOnly: true },
  { name: 'About', href: '/#about' },
  { name: 'Services', href: '/#services' },
  { name: 'Work', href: '/#projects' },
  { name: 'Contact', href: '/#contact' },
] as const;
