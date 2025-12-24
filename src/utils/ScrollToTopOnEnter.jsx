'use client';

import { useEffect } from 'react';
import { useTransitionState } from 'next-transition-router';

export default function ScrollToTopOnEnter() {
  const { stage, isReady } = useTransitionState();

  useEffect(() => {
    if (stage === 'none' && isReady) {
      window.scrollTo(0, 0);
    }
  }, [stage, isReady]);

  return null;
}
