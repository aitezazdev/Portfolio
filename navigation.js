import { useRouter } from 'next/navigation';

export const useHandleLinkClick = (setIsMenuOpen) => {
  const router = useRouter();

  return (href) => {
    if (setIsMenuOpen) setIsMenuOpen(false);

    const [path, hash] = href.split('#');

    if (path !== window.location.pathname) {
      router.push(href);
      return;
    }

    const el = document.getElementById(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    window.history.pushState(null, '', `#${hash}`);
  };
};
