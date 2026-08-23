export const EASE = {
  /** Signature expo-style in-out used by curtains/menus */
  curtain: [0.76, 0, 0.24, 1],
  outExpo: 'expo.out',
  outQuart: 'power4.out',
  outCubic: 'power3.out',
  outQuad: 'power2.out',
  inOutCubic: 'power3.inOut',
  inOutQuad: 'power2.inOut',
  elastic: 'elastic.out(1, 0.4)',
  back: 'back.out(1.7)',
} as const;

export const DUR = {
  micro: 0.25,
  fast: 0.4,
  base: 0.7,
  slow: 1.1,
  hero: 0.9,
} as const;

/** Standard scroll-trigger starts */
export const TRIGGER = {
  enter: 'top 85%',
  enterLate: 'top 75%',
  scrubReveal: ['top 90%', 'bottom 65%'] as const,
};
