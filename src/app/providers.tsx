'use client';

import React, { useRef, startTransition, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { TransitionRouter } from 'next-transition-router';
import { useLenis } from '@/components/providers/SmoothScrollProvider';
import Lenis from '@studio-freight/lenis';
import { safeSessionStorage } from '@/utils/storage';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

// Module-level flag — persists across React re-renders / effect cleanups
let _isCurtainCovering = false;

const getPageName = (path: string | null | undefined): string => {
  if (!path || path === '/') return 'HOME';
  if (path.startsWith('/projects/')) return 'PROJECT';
  const segment = path.split('/').filter(Boolean).pop();
  return segment ? segment.toUpperCase().replace(/-/g, ' ') : 'PORTFOLIO';
};

/**
 * Robustly restore scroll to `target` after page transition.
 */
function restoreScroll(target: number, lenisInst: React.RefObject<Lenis | null> | null | any) {
  const lenisObj = lenisInst?.current || window.__lenis;
  if (lenisObj) {
    lenisObj.scrollTo(target, { immediate: true });
  }
  document.documentElement.scrollTop = target;
  document.body.scrollTop = target;

  let lockFrames = 12;
  const lockLoop = () => {
    document.documentElement.scrollTop = target;
    document.body.scrollTop = target;
    if (lenisObj) lenisObj.scrollTo(target, { immediate: true });
    lockFrames--;
    if (lockFrames > 0) requestAnimationFrame(lockLoop);
  };
  requestAnimationFrame(lockLoop);

  if (lenisInst?.current) lenisInst.current.start();

  requestAnimationFrame(() => {
    if (lenisObj) lenisObj.stop();
    ScrollTrigger.refresh();
    document.documentElement.scrollTop = target;
    document.body.scrollTop = target;
    requestAnimationFrame(() => {
      document.documentElement.scrollTop = target;
      document.body.scrollTop = target;
      if (lenisObj) {
        lenisObj.scrollTo(target, { immediate: true });
        lenisObj.start();
      }
      setTimeout(() => {
        document.documentElement.scrollTop = target;
        document.body.scrollTop = target;
        if (lenisObj) lenisObj.scrollTo(target, { immediate: true });
      }, 200);
    });
  });
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scrollTargetRef = useRef<number>(0);
  const [pageName, setPageName] = useState<string>('');
  const lenis = useLenis() as React.RefObject<Lenis | null> | null;
  const pathname = usePathname();

  const lenisRef = useRef(lenis);
  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  const setPageNameRef = useRef(setPageName);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    if (pathname && pathname.startsWith('/projects/')) {
      if (!history.state || history.state.isDummy !== true) {
        history.pushState({ isDummy: true }, '', window.location.href);
      }
    }
  }, [pathname]);

  useEffect(() => {
    const playCurtainIn = () => {
      _isCurtainCovering = true;
      const lenisInst = lenisRef.current;
      if (lenisInst?.current) lenisInst.current.stop();

      setPageNameRef.current('HOME');
      gsap.set(overlayRef.current, { scaleY: 0, transformOrigin: 'bottom', pointerEvents: 'auto' });
      gsap.set(textRef.current, { y: 50, opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => { history.back(); },
      });
      tl.to(overlayRef.current, { scaleY: 1, duration: 0.6, ease: 'power3.inOut' });
      tl.to(textRef.current, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2');
    };

    const playCurtainOut = (target: number) => {
      _isCurtainCovering = false;
      const lenisInst = lenisRef.current;
      if (lenisInst?.current) lenisInst.current.stop();
      if (window.__lenis) window.__lenis.scrollTo(target, { immediate: true });
      document.documentElement.scrollTop = target;
      document.body.scrollTop = target;

      gsap.set(overlayRef.current, { scaleY: 1, transformOrigin: 'top', pointerEvents: 'auto' });
      gsap.set(textRef.current, { y: 0, opacity: 1 });

      let scrollLockActive = true;
      const runScrollLock = () => {
        if (!scrollLockActive) return;
        document.documentElement.scrollTop = target;
        document.body.scrollTop = target;
        requestAnimationFrame(runScrollLock);
      };
      requestAnimationFrame(runScrollLock);

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(overlayRef.current, { pointerEvents: 'none' });
          if (window.__lenis) window.__lenis.scrollTo(target, { immediate: true });
          document.documentElement.scrollTop = target;
          document.body.scrollTop = target;
          setTimeout(() => {
            scrollLockActive = false;
            restoreScroll(target, lenisInst);
          }, 16);
        },
      });

      tl.to(textRef.current, { y: -50, opacity: 0, duration: 0.25, ease: 'power3.in', delay: 0.2 });
      tl.to(overlayRef.current, { scaleY: 0, duration: 0.55, ease: 'power3.inOut' }, '-=0.15');
    };

    const handlePopState = (event: PopStateEvent) => {
      const path = window.location.pathname;
      const isProjectPage = path.startsWith('/projects/');

      if (isProjectPage && (!event.state || event.state.isDummy !== true)) {
        playCurtainIn();
        return;
      }

      if ((path === '/' || path === '') && _isCurtainCovering) {
        const savedScroll = safeSessionStorage.getItem('projects-scroll');
        const target = savedScroll ? parseInt(savedScroll, 10) : 0;
        playCurtainOut(target);
        return;
      }

      if (path === '/' || path === '') {
        const savedScroll = safeSessionStorage.getItem('projects-scroll');
        if (savedScroll) {
          restoreScroll(parseInt(savedScroll, 10), lenisRef.current);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <TransitionRouter
      auto={true}
      leave={(next: () => void, from: string, to: string) => {
        if (lenis?.current) lenis.current.stop();
        setPageName(getPageName(to));
        const isGoingToProject = to.startsWith('/projects/');
        const savedScroll = safeSessionStorage.getItem('projects-scroll');
        const isReturningHome = (to === '/' || to === '') && savedScroll && !isGoingToProject;
        if (isGoingToProject) safeSessionStorage.setItem('navigating-to-project', 'true');
        scrollTargetRef.current = isReturningHome ? parseInt(savedScroll, 10) : 0;

        gsap.set(overlayRef.current, { scaleY: 0, transformOrigin: 'bottom', pointerEvents: 'auto' });
        gsap.set(textRef.current, { y: 50, opacity: 0 });

        const tl = gsap.timeline({ onComplete: next });
        tl.to(overlayRef.current, { scaleY: 1, duration: 0.6, ease: 'power3.inOut' });
        tl.to(textRef.current, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2');
        tl.add(() => {
          document.documentElement.scrollTop = scrollTargetRef.current;
          document.body.scrollTop = scrollTargetRef.current;
          if (window.__lenis) window.__lenis.scrollTo(scrollTargetRef.current, { immediate: true });
        }, 0.5);
        return () => tl.kill();
      }}
      enter={(next: () => void) => {
        if (_isCurtainCovering) {
          startTransition(next);
          return () => {};
        }

        gsap.set(overlayRef.current, { transformOrigin: 'top' });
        let scrollLockActive = false;
        const runScrollLock = () => {
          if (!scrollLockActive) return;
          const y = scrollTargetRef.current;
          document.documentElement.scrollTop = y;
          document.body.scrollTop = y;
          requestAnimationFrame(runScrollLock);
        };

        const tl = gsap.timeline({
          onComplete: () => {
            const target = scrollTargetRef.current;
            if (window.__lenis) window.__lenis.scrollTo(target, { immediate: true });
            document.documentElement.scrollTop = target;
            document.body.scrollTop = target;
            setTimeout(() => {
              scrollLockActive = false;
              gsap.set(overlayRef.current, { pointerEvents: 'none' });
              restoreScroll(target, lenis);
            }, 16);
          },
        });

        tl.add(() => {
          const isNavigatingToProject = safeSessionStorage.getItem('navigating-to-project') === 'true';
          const savedScroll = safeSessionStorage.getItem('projects-scroll');
          if (!isNavigatingToProject && savedScroll) {
            scrollTargetRef.current = parseInt(savedScroll, 10);
            safeSessionStorage.removeItem('projects-scroll');
          } else {
            scrollTargetRef.current = 0;
          }
          safeSessionStorage.removeItem('navigating-to-project');
          document.documentElement.scrollTop = scrollTargetRef.current;
          document.body.scrollTop = scrollTargetRef.current;
          if (window.__lenis) window.__lenis.scrollTo(scrollTargetRef.current, { immediate: true });
          scrollLockActive = true;
          requestAnimationFrame(runScrollLock);
        }, 0);

        tl.to(textRef.current, { y: -50, opacity: 0, duration: 0.25, ease: 'power3.in' }, 0.1);
        tl.to(overlayRef.current, { scaleY: 0, duration: 0.55, ease: 'power3.inOut' }, '-=0.15');
        tl.call(() => {
          requestAnimationFrame(() => startTransition(next));
        }, undefined, 0.3);

        return () => {
          scrollLockActive = false;
          tl.kill();
        };
      }}
    >
      <main>{children}</main>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9995] bg-ink flex items-center justify-center pointer-events-none scale-y-0"
        style={{ transformOrigin: 'bottom', willChange: 'transform' }}
      >
        <div
          ref={textRef}
          className="text-cream font-display text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-widest opacity-0"
        >
          {pageName}
        </div>
      </div>
    </TransitionRouter>
  );
}
