'use client';

import { useRouter } from 'next/navigation';
import { useLenis } from '@/components/providers/SmoothScrollProvider';
import Lenis from '@studio-freight/lenis';

export const useHandleLinkClick = (setIsMenuOpen?: (isOpen: boolean) => void) => {
  const router = useRouter();
  const lenisRef = useLenis() as React.RefObject<Lenis | null> | null;

  const scrollToHash = (hash: string) => {
    const lenis = lenisRef?.current || (typeof window !== 'undefined' ? (window as any).__lenis : null);

    if (hash === 'top' || hash === '' || !hash) {
      if (lenis) {
        lenis.scrollTo(0, {
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    let attempts = 0;
    const maxAttempts = 30;
    const tryScroll = () => {
      const el = document.getElementById(hash);
      if (el) {
        if (lenis) {
          lenis.scrollTo(el, {
            offset: 0,
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        } else if (typeof window !== 'undefined') {
          const targetTop = el.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      } else if (attempts < maxAttempts) {
        attempts++;
        requestAnimationFrame(tryScroll);
      }
    };
    tryScroll();
  };

  return (href: string) => {
    if (setIsMenuOpen) {
      setIsMenuOpen(false);
    }
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
    }

    let targetPath = '/';
    let hash = '';

    if (href.includes('#')) {
      const parts = href.split('#');
      targetPath = parts[0] || '/';
      hash = parts[1] || '';
    } else {
      targetPath = href;
    }

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

    const isCurrentPage =
      targetPath === currentPath ||
      (targetPath === '/' && currentPath === '') ||
      (targetPath === '' && currentPath === '/');

    if (!isCurrentPage) {
      router.push(href, { scroll: false });
      setTimeout(() => {
        scrollToHash(hash);
      }, 350);
      return;
    }

    const lenis = lenisRef?.current || (typeof window !== 'undefined' ? (window as any).__lenis : null);
    if (lenis) {
      lenis.start();
    }

    scrollToHash(hash);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', hash ? `#${hash}` : window.location.pathname);
    }
  };
};

