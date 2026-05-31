'use client';

import { useRef, startTransition, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { TransitionRouter } from 'next-transition-router';
import { useLenis } from '@/components/providers/SmoothScrollProvider';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
const getPageName = (path) => {
  if (!path || path === '/') return 'HOME';
  if (path.startsWith('/projects/')) return 'PROJECT';
  const segment = path.split('/').filter(Boolean).pop();
  return segment ? segment.toUpperCase().replace(/-/g, ' ') : 'PORTFOLIO';
};
export default function Providers({ children }) {
  const overlayRef = useRef(null);
  const textRef = useRef(null);
  const scrollTargetRef = useRef(0);
  const [pageName, setPageName] = useState('');
  const lenis = useLenis();
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);
  return (
    <TransitionRouter
      auto={true}
      leave={(next, from, to) => {
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
          window.scrollTo(0, scrollTargetRef.current);
          document.documentElement.scrollTop = scrollTargetRef.current;
          if (window.__lenis) {
            window.__lenis.scrollTo(scrollTargetRef.current, {
              immediate: true,
            });
          }
        }, 0.5);
        return () => tl.kill();
      }}
      enter={(next) => {
        gsap.set(overlayRef.current, {
          transformOrigin: 'top',
        });
        let scrollLockActive = false;
        const runScrollLock = () => {
          if (!scrollLockActive) return;
          const y = scrollTargetRef.current;
          window.scrollTo(0, y);
          document.documentElement.scrollTop = y;
          requestAnimationFrame(runScrollLock);
        };
        const tl = gsap.timeline({
          onComplete: () => {
            scrollLockActive = false;
            gsap.set(overlayRef.current, {
              pointerEvents: 'none',
            });
            const target = scrollTargetRef.current;
            if (lenis?.current) {
              lenis.current.start();
            }
            window.scrollTo(0, target);
            document.documentElement.scrollTop = target;
            if (window.__lenis) {
              window.__lenis.scrollTo(target, {
                immediate: true,
              });
            }
            requestAnimationFrame(() => {
              ScrollTrigger.refresh();
              if (window.__lenis) {
                window.__lenis.scrollTo(target, {
                  immediate: true,
                });
              }
              window.scrollTo(0, target);
              if (target > 0) {
                setTimeout(() => {
                  if (lenis?.current) {
                    lenis.current.scrollTo(target, {
                      immediate: true,
                    });
                  }
                  window.scrollTo(0, target);
                }, 150);
              }
            });
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
          window.scrollTo(0, scrollTargetRef.current);
          document.documentElement.scrollTop = scrollTargetRef.current;
          if (window.__lenis) {
            window.__lenis.scrollTo(scrollTargetRef.current, {
              immediate: true,
            });
          }
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
