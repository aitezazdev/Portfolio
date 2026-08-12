import React, { useRef, useEffect, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { TransitionRouter } from 'next-transition-router';
import Lenis from '@studio-freight/lenis';
import { safeSessionStorage } from '@/utils/storage';

// ... (keep existing imports)

let _isCurtainCovering = false;

// Immediate preloader completion on init
const initialPreloaderComplete = () => {
  safeSessionStorage.setItem('preloader-shown', 'true');
  window.dispatchEvent(new CustomEvent('preloaderComplete'));
};

// ... (keep existing ScrollTrigger setup)

useEffect(() => {
  // Initial curtain animation - immediate completion
  if (firstLayer.current && secondLayer.current) {
    gsap.set(firstLayer.current, { y: '0%' });
    gsap.set(secondLayer.current, { y: '0%' });

    const tl = gsap.timeline({
      onComplete: () => {
        safeSessionStorage.setItem('preloader-shown', 'true');
        window.dispatchEvent(new CustomEvent('preloaderComplete'));
      }
    });

    tl.fromTo(secondLayer.current, { y: '0%' }, { y: '-100%', duration: 0.5, ease: 'circ.inOut' })
      .fromTo(firstLayer.current, { y: '0%' }, { y: '-100%', duration: 0.5, ease: 'circ.inOut' }, '<50%');
  }
}, []);

// ... (keep rest of the component)