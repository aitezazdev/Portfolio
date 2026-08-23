'use client';

import { useRouter } from 'next/navigation';
import { useLenis } from '@/components/providers/SmoothScrollProvider';
import Lenis from 'lenis';

export const getSectionElement = (targetId: string): HTMLElement | null => {
  if (!targetId || targetId === 'top' || targetId === 'home') return null;
  const id = targetId.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (id === 'about') {
    return document.getElementById('about-section-wrapper') || document.getElementById('about');
  }
  if (id === 'services' || id === 'whatido') {
    return document.getElementById('services');
  }
  if (id === 'projects' || id === 'work') {
    return document.getElementById('projects');
  }
  if (id === 'contact' || id === 'getintouch') {
    return document.getElementById('contact');
  }
  if (id === 'techstack' || id === 'stack') {
    return document.getElementById('TechStack');
  }
  return document.getElementById(targetId);
};

export const scrollToSection = (targetId: string, lenis?: any) => {
  const activeLenis = lenis || (typeof window !== 'undefined' ? (window as any).__lenis : null);

  if (!targetId || targetId === 'top' || targetId === 'home') {
    if (activeLenis) {
      activeLenis.scrollTo(0, {
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }

  let attempts = 0;
  const maxAttempts = 25;

  const tryScroll = () => {
    const el = getSectionElement(targetId);
    if (el) {
      if (activeLenis) {
        activeLenis.scrollTo(el, {
          offset: 0,
          duration: 1.3,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else if (typeof window !== 'undefined') {
        const rect = el.getBoundingClientRect();
        const targetTop = rect.top + (window.scrollY || window.pageYOffset);
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    } else if (attempts < maxAttempts) {
      attempts++;
      requestAnimationFrame(tryScroll);
    }
  };

  tryScroll();
};

export const useHandleLinkClick = (setIsMenuOpen?: (isOpen: boolean) => void) => {
  const router = useRouter();
  const lenisRef = useLenis() as React.RefObject<Lenis | null> | null;

  return (href: string) => {
    if (setIsMenuOpen) {
      setIsMenuOpen(false);
    }
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
    }

    let targetPath = '/';
    let targetId = '';

    if (href.includes('#')) {
      const parts = href.split('#');
      targetPath = parts[0] || '/';
      targetId = parts[1] || '';
    } else if (href.startsWith('/')) {
      targetPath = href;
    } else {
      targetId = href;
    }

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

    const isCurrentPage =
      targetPath === currentPath ||
      (targetPath === '/' && (currentPath === '' || currentPath === '/')) ||
      (targetPath === '' && (currentPath === '' || currentPath === '/'));

    if (!isCurrentPage) {
      if (typeof window !== 'undefined' && targetId) {
        try {
          sessionStorage.setItem('nav_target_section', targetId);
        } catch {}
      }
      router.push(targetPath || '/', { scroll: false });
      return;
    }

    const lenis = lenisRef?.current || (typeof window !== 'undefined' ? (window as any).__lenis : null);
    if (lenis) {
      lenis.start();
    }

    scrollToSection(targetId, lenis);

    // Keep URL clean without appending or leaving #hash
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };
};

