'use client';

import React, { useState, useEffect, useRef } from 'react';
import AnimatedHeading from '@/components/ui/AnimateHeading';
import AnimateDescription from '@/components/ui/AnimateDescription';
import AnimatedButton from '@/components/ui/AnimatedButton';

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingText = 'Contact';
  const descriptionText =
    'Have a project in mind or just want to say hello? Feel free to reach out.';

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
    <section ref={sectionRef} id="contact" className="bg-cream py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 w-full">
        <div className="rounded-3xl bg-ink text-light p-8 sm:p-12 md:p-16 lg:p-20 border border-elevated-dark">
          <AnimatedHeading
            text={headingText}
            className="text-[clamp(2.5rem,7vw,6.5rem)] font-black tracking-tight leading-none uppercase mb-6"
          />
          <div className="max-w-2xl mb-12">
            <AnimateDescription
              text={descriptionText}
              className="text-base sm:text-lg text-gray-soft font-sans leading-relaxed"
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className="max-w-2xl space-y-6 p-6 sm:p-8 rounded-2xl mx-auto bg-surface border border-white/[0.04]"
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
                className={`w-full px-4 py-3 text-sm sm:text-base border rounded-xl bg-surface-mid text-cream placeholder-[#6a6a68] focus:outline-none transition-all duration-300 border-white/[0.08] focus:border-forest focus:ring-1 focus:ring-forest/30 ${
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
                className={`w-full px-4 py-3 text-sm sm:text-base border rounded-xl bg-surface-mid text-cream placeholder-[#6a6a68] focus:outline-none transition-all duration-300 border-white/[0.08] focus:border-forest focus:ring-1 focus:ring-forest/30 ${
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
                className={`w-full px-4 py-3 text-sm sm:text-base border rounded-xl bg-surface-mid text-cream placeholder-[#6a6a68] resize-none focus:outline-none transition-all duration-300 border-white/[0.08] focus:border-forest focus:ring-1 focus:ring-forest/30 ${
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
          </form>

          <div className="mt-16 pt-12 border-t border-elevated-dark flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-warm mb-2 font-mono">
                Direct Contact
              </p>

              <button
                type="button"
                aria-label="Copy email address to clipboard"
                onClick={() => {
                  navigator.clipboard.writeText('aitezazsikandar@gmail.com');
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
                className="group relative inline-block cursor-none text-light font-display font-black uppercase leading-none hover:text-forest transition-colors duration-300 max-w-full whitespace-nowrap"
                style={{
                  fontSize: 'clamp(0.65rem, 3.4vw, 4.5rem)',
                  whiteSpace: 'nowrap',
                }}
              >
                aitezazsikandar@gmail.com
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-forest origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out block" />
              </button>
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
          background: '#6C3CE1',
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
