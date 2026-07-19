/**
 * Single entry-point for GSAP plugin registration.
 * Import this once (usually in ClientLayout) so every component
 * can use ScrollTrigger / useGSAP without re-registering.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
