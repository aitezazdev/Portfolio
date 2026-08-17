'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  disabled?: boolean;
}

const Magnetic: React.FC<MagneticProps> = ({
  children,
  strength = 0.35,
  className = '',
  disabled = false,
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    const target = targetRef.current;
    if (!trigger || !target || disabled) return;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = trigger.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
      const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
      gsap.to(target, { x, y, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
    };

    const handleMouseLeave = () => {
      gsap.to(target, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)', overwrite: 'auto' });
    };

    trigger.addEventListener('mousemove', handleMouseMove);
    trigger.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      trigger.removeEventListener('mousemove', handleMouseMove);
      trigger.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, disabled]);

  return (
    <div ref={triggerRef} className={`inline-block ${className}`.trim()}>
      <div ref={targetRef} className="w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default Magnetic;
