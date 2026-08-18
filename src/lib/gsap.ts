import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, useGSAP, CustomEase);
if (typeof window !== 'undefined' && !CustomEase.get('snellenberg')) {
  CustomEase.create('snellenberg', '0.76, 0, 0.24, 1');
}

export { gsap, ScrollTrigger, useGSAP, CustomEase };

