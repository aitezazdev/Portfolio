'use client';

import React, { useState, useEffect, useRef } from 'react';
import AnimatedHeading from '@/components/ui/AnimateHeading';
import ScrollWordReveal from '@/components/ui/ScrollWordReveal';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { gsap, useGSAP } from '@/lib/gsap';
import { EASE } from '@/lib/motion';
import { site } from '@/lib/site';
import { useReducedMotion } from '@/lib/useReducedMotion';

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const headingWords = [
    { t: "LET'S" },
    { t: 'talk', serif: true },
  ];

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => setSubmitStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            setErrors({});
            setSubmitStatus(null);
          }
        });
      },
      { threshold: 0, rootMargin: '0px' },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      if (reduced) return;
      const card = cardRef.current;
      const cta = ctaRef.current;

      // One-shot, NON-scrubbed reveals. Scrubbed positional parallax snapped
      // whenever ScrollTrigger.refresh() re-mapped scroll->progress (fonts,
      // images, pins). Non-scrubbed tweens hold their end state forever, so
      // a jump is impossible by construction.
      if (card) {
        gsap.fromTo(
          card,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: EASE.outCubic,
            scrollTrigger: { trigger: card, start: 'top 90%', once: true },
          }
        );
      }
      if (cta) {
        gsap.fromTo(
          cta,
          { x: 48, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: EASE.outCubic,
            scrollTrigger: { trigger: cta, start: 'top 94%', once: true },
          }
        );
      }
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateMessage = (text: string) => {
    const trimmed = text.trim();
    if (trimmed.length < 30) return false;
    const words = trimmed.split(/\s+/).filter(Boolean);
    return words.length >= 5;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (!validateMessage(formData.message))
      newErrors.message = 'Please enter a meaningful message (at least 30 characters, 5 words)';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      if (response.ok && data.success) {
        setSubmitStatus('success');
        setSuccessMessage(data.message || 'Thank you! Your message has been sent successfully.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
        if (data?.error) {
          setErrors({ server: data.error });
        }
      }
    } catch {
      clearTimeout(timeoutId);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting;

  return (
    <section ref={sectionRef} id="contact" className="bg-ink text-light pt-12 pb-16 md:pt-14 md:pb-24 relative overflow-hidden">
      <div ref={containerRef} className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 w-full">
        <div
          ref={cardRef}
          className="rounded-3xl bg-surface text-light p-8 sm:p-12 md:p-16 lg:p-20 border border-elevated-dark"
          style={{ willChange: 'transform' }}
        >
          <AnimatedHeading
            words={headingWords}
            className="text-[clamp(2.75rem,8.5vw,7.5rem)] tracking-tight mb-6 text-light"
          />
          <div className="max-w-2xl mb-12">
            <ScrollWordReveal
              text="Have a project in mind or just want to say hello? Feel free to reach out."
              offset={['start 0.95', 'end 0.7']}
              className="text-base sm:text-lg text-gray-soft font-sans leading-relaxed"
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className="max-w-2xl space-y-6 p-6 sm:p-8 rounded-2xl mx-auto bg-surface-mid border border-white/[0.04]"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-medium text-sm sm:text-base text-muted">
                Your Name <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                autoComplete="name"
                className={`w-full px-4 py-3 text-sm sm:text-base border rounded-xl bg-surface text-cream placeholder-[#6a6a68] focus:outline-none transition-all duration-300 border-white/[0.08] focus:border-accent focus:ring-1 focus:ring-accent/30 ${
                  errors.name ? 'border-red-500 focus:border-red-500' : ''
                }`}
                disabled={isDisabled}
              />
              {errors.name && <p className="text-red-400 text-xs sm:text-sm">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-medium text-sm sm:text-base text-muted">
                Your Email <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="you@example.com"
                className={`w-full px-4 py-3 text-sm sm:text-base border rounded-xl bg-surface text-cream placeholder-[#6a6a68] focus:outline-none transition-all duration-300 border-white/[0.08] focus:border-accent focus:ring-1 focus:ring-accent/30 ${
                  errors.email ? 'border-red-500 focus:border-red-500' : ''
                }`}
                disabled={isDisabled}
              />
              {errors.email && <p className="text-red-400 text-xs sm:text-sm">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="font-medium text-sm sm:text-base text-muted">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                className={`w-full px-4 py-3 text-sm sm:text-base border rounded-xl bg-surface text-cream placeholder-[#6a6a68] resize-none focus:outline-none transition-all duration-300 border-white/[0.08] focus:border-accent focus:ring-1 focus:ring-accent/30 ${
                  errors.message ? 'border-red-500 focus:border-red-500' : ''
                }`}
                disabled={isDisabled}
              />
              {errors.message && <p className="text-red-400 text-xs sm:text-sm">{errors.message}</p>}
              <p className="text-xs text-warm">{formData.message.length} / 30 minimum characters</p>
            </div>

            <div role="status" aria-live="polite">
              {errors.server && (
                <div className="p-4 bg-red-900/20 border border-red-600/40 rounded-xl mb-4">
                  <p className="text-red-400 text-sm">{errors.server}</p>
                </div>
              )}

              {submitStatus === 'success' && (
                <div className="p-4 bg-green-900/20 border border-green-600/40 rounded-xl mb-4">
                  <p className="text-green-400 text-sm">{successMessage}</p>
                </div>
              )}

              {submitStatus === 'error' && !errors.server && (
                <div className="p-4 bg-red-900/20 border border-red-600/40 rounded-xl mb-4">
                  <p className="text-red-400 text-sm">Something went wrong. Please try again later.</p>
                </div>
              )}
            </div>

            <div className="w-full flex justify-center md:justify-start">
              <button
                type="submit"
                disabled={isDisabled}
                className="inline-block border-0 bg-transparent p-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AnimatedButton
                  topText={isDisabled ? 'PLEASE WAIT...' : 'SEND MESSAGE'}
                  bottomText={isDisabled ? 'PROCESSING' : 'PROCEED →'}
                  variant="primary"
                  as="span"
                  className={isDisabled ? 'pointer-events-none' : ''}
                />
              </button>
            </div>
          </form>

          <div className="mt-16 pt-12 border-t border-elevated-dark flex flex-col items-center justify-center text-center w-full">
            <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
              <p className="text-xs uppercase tracking-widest text-warm mb-3 font-mono text-center">
                Direct Contact
              </p>

              <div ref={ctaRef} className="inline-block" style={{ willChange: 'transform' }}>
                <button
                  type="button"
                  aria-label={`Copy ${site.email} to clipboard`}
                  onClick={() => {
                    navigator.clipboard.writeText(site.email);
                    const toast = document.getElementById('email-copy-toast');
                    if (toast) {
                      toast.style.opacity = '1';
                      toast.style.transform = 'translateY(0)';
                      setTimeout(() => {
                        toast.style.opacity = '0';
                        toast.style.transform = 'translateY(8px)';
                      }, 2000);
                    }
                  }}
                  className="group relative inline-flex items-center justify-center cursor-pointer text-light font-display font-black uppercase leading-tight hover:text-accent transition-colors duration-300 max-w-full text-center"
                  style={{
                    fontSize: 'clamp(1.1rem, 4.2vw, 3rem)',
                  }}
                >
                  <span className="break-all sm:break-normal">{site.email}</span>
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out block" />
                </button>
              </div>

              <span className="font-mono text-[11px] text-warm/70 uppercase tracking-widest mt-2 block text-center">
                Click to copy email address
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        id="email-copy-toast"
        role="status"
        aria-live="polite"
        className="fixed bottom-8 right-8 z-[9998] pointer-events-none"
        style={{
          background: '#C45D3E',
          color: 'white',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '0.75rem 1.25rem',
          borderRadius: '9999px',
          opacity: 0,
          transform: 'translateY(8px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        ✓ Copied to clipboard
      </div>
    </section>
  );
};

export default Contact;
