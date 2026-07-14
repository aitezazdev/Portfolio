'use client';

import React, { useRef, startTransition, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { TransitionRouter } from 'next-transition-router';
import { useLenis } from '@/components/providers/SmoothScrollProvider';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

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
 * - Syncs Lenis internal state BEFORE calling start() so it never smooth-scrolls away.
 * - Pauses Lenis around ScrollTrigger.refresh() to prevent refresh-triggered position drift.
 * - Keeps a rAF lock running for a few extra frames after Lenis resumes to absorb any late jitter.
 */
function restoreScroll(target: number, lenisInst: React.RefObject<Lenis | null> | null | any) {
  // Step 1: While Lenis is still stopped, sync its internal scroll target
  const lenisObj = lenisInst?.current || window.__lenis;
  if (lenisObj) {
    lenisObj.scrollTo(target, { immediate: true });
  }
  // Also write to DOM directly (belt-and-suspenders)
  document.documentElement.scrollTop = target;
  document.body.scrollTop = target;

  // Step 2: Run a tight rAF lock for ~200ms to absorb any jitter from Lenis resuming
  let lockFrames = 12; // ~200ms at 60fps
  const lockLoop = () => {
    document.documentElement.scrollTop = target;
    document.body.scrollTop = target;
    if (lenisObj) lenisObj.scrollTo(target, { immediate: true });
    lockFrames--;
    if (lockFrames > 0) requestAnimationFrame(lockLoop);
  };
  requestAnimationFrame(lockLoop);

  // Step 3: Now start Lenis (its internal target is already at `target`, so no drift)
  if (lenisInst?.current) lenisInst.current.start();

  // Step 4: Pause Lenis, refresh ScrollTrigger, then resume — prevents refresh causing drift
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
      // Final safety net at 200ms (covers SmoothScrollProvider's own 500ms refresh)
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

  // Keep a ref to lenis so popstate handler (with [] deps) always gets the latest value
  const lenisRef = useRef(lenis);
  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  // Keep a ref to setPageName so we can call it from the stable popstate handler
  const setPageNameRef = useRef(setPageName);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // Push dummy state when on a project page to intercept back navigation
  useEffect(() => {
    if (pathname && pathname.startsWith('/projects/')) {
      if (!history.state || history.state.isDummy !== true) {
        history.pushState({ isDummy: true }, '', window.location.href);
      }
    }
  }, [pathname]);

  // Single, permanent popstate handler ([] deps) — uses module-level flag + refs so it's always correct
  useEffect(() => {
    const playCurtainIn = () => {
      _isCurtainCovering = true;
      const lenisInst = lenisRef.current;
      if (lenisInst?.current) lenisInst.current.stop();

      setPageNameRef.current('HOME');
      gsap.set(overlayRef.current, {
        scaleY: 0,
        transformOrigin: 'bottom',
        pointerEvents: 'auto',
      });
      gsap.set(textRef.current, { y: 50, opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          // Navigate back — this will trigger another popstate for "/"
          history.back();
        },
      });
      tl.to(overlayRef.current, { scaleY: 1, duration: 0.6, ease: 'power3.inOut' });
      tl.to(textRef.current, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2');
    };

    const playCurtainOut = (target) => {
      _isCurtainCovering = false;
      const lenisInst = lenisRef.current;
      // Stop Lenis and pre-sync its position so it won't drift when it resumes
      if (lenisInst?.current) lenisInst.current.stop();
      if (window.__lenis) window.__lenis.scrollTo(target, { immediate: true });
      document.documentElement.scrollTop = target;
      document.body.scrollTop = target;

      // Snap overlay to fully-covering immediately (same DOM element, always valid)
      gsap.set(overlayRef.current, {
        scaleY: 1,
        transformOrigin: 'top',
        pointerEvents: 'auto',
      });
      gsap.set(textRef.current, { y: 0, opacity: 1 });

      // Lock scroll while curtain covers page
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
          // Keep the rAF lock running a little longer — stop it AFTER restoreScroll is settled
          gsap.set(overlayRef.current, { pointerEvents: 'none' });

          // Pre-sync Lenis internal target before starting it (prevents drift)
          if (window.__lenis) window.__lenis.scrollTo(target, { immediate: true });
          document.documentElement.scrollTop = target;
          document.body.scrollTop = target;

          // Give restoreScroll a few frames of the lock still active
          setTimeout(() => {
            scrollLockActive = false;
            restoreScroll(target, lenisInst);
          }, 16); // one frame delay
        },
      });

      tl.to(textRef.current, { y: -50, opacity: 0, duration: 0.25, ease: 'power3.in', delay: 0.2 });
      tl.to(overlayRef.current, { scaleY: 0, duration: 0.55, ease: 'power3.inOut' }, '-=0.15');
    };

    const handlePopState = (event: PopStateEvent) => {
      const path = window.location.pathname;
      const isProjectPage = path.startsWith('/projects/');

      // Case 1: On project page, user clicked browser back (popping dummy state → back to real state)
      if (isProjectPage && (!event.state || event.state.isDummy !== true)) {
        playCurtainIn();
        return;
      }

      // Case 2: Arrived at home after curtain-in navigated us back
      if ((path === '/' || path === '') && _isCurtainCovering) {
        const savedScroll = sessionStorage.getItem('projects-scroll');
        const target = savedScroll ? parseInt(savedScroll, 10) : 0;
        playCurtainOut(target);
        return;
      }

      // Case 3: Any other back navigation to home — just restore scroll
      if (path === '/' || path === '') {
        const savedScroll = sessionStorage.getItem('projects-scroll');
        if (savedScroll) {
          const target = parseInt(savedScroll, 10);
          restoreScroll(target, lenisRef.current);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty — we use refs for all mutable state

  return (
    <TransitionRouter
      auto={true}
      leave={(next: () => void, from: string, to: string) => {
        if (lenis?.current) {
          lenis.current.stop();
        }
        setPageName(getPageName(to));
        const isGoingToProject = to.startsWith('/projects/');
        const savedScroll = sessionStorage.getItem('projects-scroll');
        const isReturningHome = (to === '/' || to === '') && savedScroll && !isGoingToProject;
        if (isGoingToProject) {
          sessionStorage.setItem('navigating-to-project', 'true');
        }
        scrollTargetRef.current = isReturningHome ? parseInt(savedScroll, 10) : 0;
        gsap.set(overlayRef.current, {
          scaleY: 0,
          transformOrigin: 'bottom',
          pointerEvents: 'auto',
        });
        gsap.set(textRef.current, {
          y: 50,
          opacity: 0,
        });
        const tl = gsap.timeline({
          onComplete: next,
        });
        tl.to(overlayRef.current, {
          scaleY: 1,
          duration: 0.6,
          ease: 'power3.inOut',
        });
        tl.to(
          textRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
          },
          '-=0.2',
        );
        tl.add(() => {
          // Pre-sync scroll while curtain still covers
          document.documentElement.scrollTop = scrollTargetRef.current;
          document.body.scrollTop = scrollTargetRef.current;
          if (window.__lenis) window.__lenis.scrollTo(scrollTargetRef.current, { immediate: true });
        }, 0.5);
        return () => tl.kill();
      }}
      enter={(next: () => void) => {
        // If _isCurtainCovering is set, the popstate handler is managing the overlay — don't interfere
        if (_isCurtainCovering) {
          startTransition(next);
          return () => {};
        }
        gsap.set(overlayRef.current, {
          transformOrigin: 'top',
        });
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

            // Pre-sync Lenis internal target BEFORE starting it — prevents drift
            if (window.__lenis) window.__lenis.scrollTo(target, { immediate: true });
            document.documentElement.scrollTop = target;
            document.body.scrollTop = target;

            // Give restoreScroll a frame of lock still active before unlocking
            setTimeout(() => {
              scrollLockActive = false;
              gsap.set(overlayRef.current, { pointerEvents: 'none' });
              restoreScroll(target, lenis);
            }, 16);
          },
        });
        tl.add(() => {
          const isNavigatingToProject = sessionStorage.getItem('navigating-to-project') === 'true';
          const savedScroll = sessionStorage.getItem('projects-scroll');
          if (!isNavigatingToProject && savedScroll) {
            scrollTargetRef.current = parseInt(savedScroll, 10);
            sessionStorage.removeItem('projects-scroll');
          } else {
            scrollTargetRef.current = 0;
          }
          sessionStorage.removeItem('navigating-to-project');
          document.documentElement.scrollTop = scrollTargetRef.current;
          document.body.scrollTop = scrollTargetRef.current;
          // Pre-sync Lenis while it's stopped
          if (window.__lenis) window.__lenis.scrollTo(scrollTargetRef.current, { immediate: true });
          scrollLockActive = true;
          requestAnimationFrame(runScrollLock);
        }, 0);
        tl.to(
          textRef.current,
          {
            y: -50,
            opacity: 0,
            duration: 0.25,
            ease: 'power3.in',
          },
          0.1,
        );
        tl.to(
          overlayRef.current,
          {
            scaleY: 0,
            duration: 0.55,
            ease: 'power3.inOut',
          },
          '-=0.15',
        );
        tl.call(
          () => {
            requestAnimationFrame(() => {
              startTransition(next);
            });
          },
          undefined,
          0.3,
        );
        return () => {
          scrollLockActive = false;
          tl.kill();
        };
      }}
    >
      <main>{children}</main>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9995] bg-[#080807] flex items-center justify-center pointer-events-none scale-y-0"
        style={{
          transformOrigin: 'bottom',
          willChange: 'transform',
        }}
      >
        <div
          ref={textRef}
          className="text-[#e8e8e3] font-display text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-widest opacity-0"
        >
          {pageName}
        </div>
      </div>
    </TransitionRouter>
  );
}
