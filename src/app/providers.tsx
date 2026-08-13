'use client';

import React, { useRef, startTransition, useEffect } from 'react';
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

let _isCurtainCovering = false;

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
  const firstLayer = useRef<HTMLDivElement | null>(null);
  const secondLayer = useRef<HTMLDivElement | null>(null);
  const scrollTargetRef = useRef<number>(0);
  const lenis = useLenis() as React.RefObject<Lenis | null> | null;
  const pathname = usePathname();

  const lenisRef = useRef(lenis);
  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

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

      const tl = gsap.timeline({
        onComplete: () => { history.back(); },
      });
      tl.fromTo(firstLayer.current, { y: '100%' }, { y: '0%', duration: 0.45, ease: 'circ.inOut' })
        .fromTo(secondLayer.current, { y: '100%' }, { y: '0%', duration: 0.45, ease: 'circ.inOut' }, '<50%');
    };

    const playCurtainOut = (target: number) => {
      _isCurtainCovering = false;
      const lenisInst = lenisRef.current;
      if (lenisInst?.current) lenisInst.current.stop();
      if (window.__lenis) window.__lenis.scrollTo(target, { immediate: true });
      document.documentElement.scrollTop = target;
      document.body.scrollTop = target;

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
          if (window.__lenis) window.__lenis.scrollTo(target, { immediate: true });
          document.documentElement.scrollTop = target;
          document.body.scrollTop = target;
          setTimeout(() => {
            scrollLockActive = false;
            restoreScroll(target, lenisInst);
          }, 16);
        },
      });

      tl.fromTo(secondLayer.current, { y: '0%' }, { y: '-100%', duration: 0.45, ease: 'circ.inOut' })
        .fromTo(firstLayer.current, { y: '0%' }, { y: '-100%', duration: 0.45, ease: 'circ.inOut' }, '<50%');
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
      leave={(next: () => void, _from: string, to: string) => {
        if (lenis?.current) lenis.current.stop();
        const isGoingToProject = to.startsWith('/projects/');
        const savedScroll = safeSessionStorage.getItem('projects-scroll');
        const isReturningHome = (to === '/' || to === '') && savedScroll && !isGoingToProject;
        if (isGoingToProject) safeSessionStorage.setItem('navigating-to-project', 'true');
        scrollTargetRef.current = isReturningHome ? parseInt(savedScroll, 10) : 0;

        const tl = gsap
          .timeline({ onComplete: next })
          .fromTo(
            firstLayer.current,
            { y: '100%' },
            { y: '0%', duration: 0.5, ease: 'circ.inOut' }
          )
          .fromTo(
            secondLayer.current,
            { y: '100%' },
            { y: '0%', duration: 0.5, ease: 'circ.inOut' },
            '<50%'
          );

        tl.add(() => {
          document.documentElement.scrollTop = scrollTargetRef.current;
          document.body.scrollTop = scrollTargetRef.current;
          if (window.__lenis) window.__lenis.scrollTo(scrollTargetRef.current, { immediate: true });
        }, 0.5);

        return () => {
          tl.kill();
        };
      }}
      enter={(next: () => void) => {
        if (_isCurtainCovering) {
          startTransition(next);
          return () => {};
        }

        let scrollLockActive = false;
        const runScrollLock = () => {
          if (!scrollLockActive) return;
          const y = scrollTargetRef.current;
          document.documentElement.scrollTop = y;
          document.body.scrollTop = y;
          requestAnimationFrame(runScrollLock);
        };

        const tl = gsap
          .timeline({
            onComplete: () => {
              const target = scrollTargetRef.current;
              if (window.__lenis) window.__lenis.scrollTo(target, { immediate: true });
              document.documentElement.scrollTop = target;
              document.body.scrollTop = target;
              setTimeout(() => {
                scrollLockActive = false;
                restoreScroll(target, lenis);
              }, 16);
            },
          })
          .fromTo(
            secondLayer.current,
            { y: '0%' },
            { y: '-100%', duration: 0.5, ease: 'circ.inOut' }
          )
          .fromTo(
            firstLayer.current,
            { y: '0%' },
            { y: '-100%', duration: 0.5, ease: 'circ.inOut' },
            '<50%'
          )
          .call(() => {
            requestAnimationFrame(() => {
              startTransition(next);
            });
          }, undefined, '<50%');

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

        return () => {
          scrollLockActive = false;
          tl.kill();
        };
      }}
    >
      <main>{children}</main>

      <div
        ref={firstLayer}
        className="fixed inset-0 z-[9994] translate-y-full bg-accent pointer-events-none"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={secondLayer}
        className="fixed inset-0 z-[9995] translate-y-full bg-ink pointer-events-none"
        style={{ willChange: 'transform' }}
      />
    </TransitionRouter>
  );
}
