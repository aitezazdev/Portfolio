import { useLenis } from '@/components/SmoothScrollProvider';
import { useRouter } from 'next/navigation';

export const useHandleLinkClick = (setIsMenuOpen) => {
  const router = useRouter();
  const lenisRef = useLenis();

  return (href) => {
    if (setIsMenuOpen) setIsMenuOpen(false);

    const [path, hash] = href.split('#');

    if (path !== window.location.pathname) {
      router.push(href);
      return;
    }

    const el = document.getElementById(hash);
    if (el && lenisRef?.current) {
      lenisRef.current.scrollTo(el, {
        offset: 0,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    window.history.pushState(null, '', `#${hash}`);
  };
};
