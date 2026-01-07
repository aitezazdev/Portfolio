import { useLenis } from '@/components/SmoothScrollProvider';
import { useRouter } from 'next/navigation';

export const useHandleLinkClick = (setIsMenuOpen) => {
  const router = useRouter();
  const lenisRef = useLenis();

  return (href) => {
    const [path, hash] = href.split('#');

    if (path !== window.location.pathname) {
      if (setIsMenuOpen) setIsMenuOpen(false);
      router.push(href);
      return;
    }

    if (lenisRef?.current) {
      lenisRef.current.start();
    }

    if (setIsMenuOpen) {
      setTimeout(() => setIsMenuOpen(false), 50);
    }

    const el = document.getElementById(hash);
    
    if (el && lenisRef?.current) {
      setTimeout(() => {
        lenisRef.current.scrollTo(el, {
          offset: 0,
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }, 100);
    } else if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }

    window.history.pushState(null, '', `#${hash}`);
  };
};