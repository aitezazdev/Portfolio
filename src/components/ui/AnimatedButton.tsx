'use client';

import React, { useRef, useEffect, ElementType } from 'react';
import { gsap } from '@/lib/gsap';

interface AnimatedButtonProps {
  onClick?: (e: React.MouseEvent<any>) => void;
  topText: React.ReactNode;
  bottomText: React.ReactNode;
  variant?: 'light' | 'primary' | 'outline' | 'dark';
  className?: string;
  as?: ElementType;
  disabled?: boolean;
  [key: string]: any;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  onClick,
  topText,
  bottomText,
  variant = 'dark',
  className = '',
  as = 'button',
  disabled = false,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<any>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);

  const Component = as;

  let bgColor, textColor, borderColor, rippleColor, hoverBgColor, originalBgColor;
  switch (variant) {
    case 'light':
      bgColor = 'bg-transparent';
      textColor = 'text-elevated';
      borderColor = 'border-2 border-elevated';
      rippleColor = 'rgba(42, 42, 42, 0.1)';
      hoverBgColor = 'rgba(42, 42, 42, 0.05)';
      originalBgColor = 'transparent';
      break;
    case 'primary':
      bgColor = 'bg-forest';
      textColor = 'text-white';
      borderColor = '';
      rippleColor = 'rgba(255,255,255,0.2)';
      hoverBgColor = '#084c36';
      originalBgColor = '#0c6145';
      break;
    case 'outline':
      bgColor = 'bg-transparent';
      textColor = 'text-warm';
      borderColor = 'border border-muted';
      rippleColor = 'rgba(97, 92, 86, 0.1)';
      hoverBgColor = 'rgba(97, 92, 86, 0.05)';
      originalBgColor = 'transparent';
      break;
    case 'dark':
    default:
      bgColor = 'bg-elevated';
      textColor = 'text-white';
      borderColor = '';
      rippleColor = 'rgba(255, 255, 255, 0.15)';
      hoverBgColor = '#3b3b3b';
      originalBgColor = '#2a2a2a';
      break;
  }

  const handleMouseEnter = (e: React.MouseEvent<any>) => {
    const button = buttonRef.current;
    const ripple = rippleRef.current;
    if (!button || !ripple) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const maxDistance = Math.max(
      Math.hypot(x, y),
      Math.hypot(rect.width - x, y),
      Math.hypot(x, rect.height - y),
      Math.hypot(rect.width - x, rect.height - y),
    );
    const finalScale = (maxDistance * 2) / 100;

    gsap.set(ripple, { left: x, top: y, scale: 0, opacity: 1 });
    gsap.to(ripple, { scale: finalScale, opacity: 0.6, duration: 0.6, ease: 'power2.out' });
    gsap.to(button, { backgroundColor: hoverBgColor, duration: 0.4, ease: 'power2.out' });
  };

  const handleButtonMouseLeave = () => {
    const button = buttonRef.current;
    const ripple = rippleRef.current;
    if (!button || !ripple) return;
    gsap.to(ripple, { scale: 0, opacity: 0, duration: 0.5, ease: 'power2.out' });
    gsap.to(button, { backgroundColor: originalBgColor, duration: 0.4, ease: 'power2.out' });
  };

  useEffect(() => {
    const el = buttonRef.current;
    if (!el || disabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.35, y: y * 0.35, duration: 0.4, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [disabled]);

  return (
    <div ref={containerRef} className="inline-block p-8 -m-8 pointer-events-auto">
      <Component
        ref={buttonRef}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleButtonMouseLeave}
        disabled={disabled}
        className={`relative text-xs md:text-sm outline-none overflow-hidden h-10 md:h-12 px-4 sm:px-6 md:px-8 rounded-full ${bgColor} ${textColor} ${borderColor} group cursor-pointer font-medium inline-block ${className}`}
        style={{ transformOrigin: 'center' }}
        {...props}
      >
        <span
          ref={rippleRef}
          className="absolute pointer-events-none rounded-full w-[100px] h-[100px] -translate-x-1/2 -translate-y-1/2"
          style={{ backgroundColor: rippleColor, opacity: 0 }}
        />

        <span className="flex items-center justify-center h-full transition-transform duration-400 ease-in-out group-hover:-translate-y-full relative z-10">
          {topText}
        </span>

        <span className="flex items-center justify-center h-full absolute inset-0 top-full transition-transform duration-400 ease-in-out group-hover:-translate-y-full z-10">
          {bottomText}
        </span>
      </Component>
    </div>
  );
};

export default AnimatedButton;
