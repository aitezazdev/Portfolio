'use client';

import { useRouter } from 'next/navigation';
import { useLenis } from '@/components/providers/SmoothScrollProvider';
export const useHandleLinkClick = (setIsMenuOpen) => {
  const router = useRouter();
  const lenisRef = useLenis();
  const scrollToHash = (hash) => {
    let attempts = 0;
    const maxAttempts = 30;
    const tryScroll = () => {
      const el = document.getElementById(hash);
      const lenis = lenisRef?.current;
      if (el && lenis) {
        lenis.scrollTo(el, {
          offset: 0,
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else if (attempts < maxAttempts) {
        attempts++;
        requestAnimationFrame(tryScroll);
      }
    };
    tryScroll();
  };
  return (href) => {
    const [path, hash] = href.replace('#', '/#').split('/#');
    const currentPath = window.location.pathname;
    if (setIsMenuOpen) {
      setIsMenuOpen(false);
    }
    if (path && path !== currentPath) {
      router.push(href, {
        scroll: false,
      });
      setTimeout(() => {
        scrollToHash(hash);
      }, 300);
      return;
    }
    if (lenisRef?.current) {
      lenisRef.current.start();
    }
    scrollToHash(hash);
    window.history.pushState(null, '', `#${hash}`);
  };
};
