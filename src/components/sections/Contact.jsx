'use client';

import React, { useState, useEffect, useRef } from 'react';
import AnimatedHeading from '@/components/ui/AnimateHeading';
import AnimateDescription from '@/components/ui/AnimateDescription';
import AnimatedButton from '@/components/ui/AnimatedButton';
const Contact = () => {
  const sectionRef = useRef(null);
  const headingText = 'Contact';
  const descriptionText =
    'Have a project in mind or just want to say hello? Feel free to reach out.';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
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
      {
        threshold: 0,
        rootMargin: '0px',
      },
    );
    observer.observe(section);
    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);
  const validateName = (name) => {
    if (name.trim().length < 2) return false;
    if (!/[a-zA-Z]/.test(name)) return false;
    const fakeNames = ['test', 'abc', 'xyz', 'asdf', 'qwerty', 'john doe', 'test user'];
    if (fakeNames.includes(name.toLowerCase().trim())) return false;
    if (/^\d+$/.test(name.trim())) return false;
    if (/(.)\1{4,}/.test(name)) return false;
    return true;
  };
  const validateMessage = (message) => {
    if (message.trim().length < 30) return false;
    const words = message.trim().split(/\s+/);
    if (words.length < 5) return false;
    const spamPhrases = ['test message', 'testing', 'asdf', 'qwerty'];
    if (spamPhrases.some((p) => message.toLowerCase().includes(p))) return false;
    if (/(.)\1{10,}/.test(message)) return false;
    return true;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name])
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
  };
  const handleSubmit = async () => {
    setErrors({});
    setSubmitStatus(null);
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (!validateName(formData.name)) newErrors.name = 'Please enter a valid name';
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
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          message: '',
        });
      } else {
        if (data && data.error) {
          setErrors((prev) => ({
            ...prev,
            email: data.error,
          }));
        } else {
          setSubmitStatus('error');
        }
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  const isDisabled = isSubmitting;
  return (
    <section ref={sectionRef} id="contact" className="bg-[#e8e8e3] py-16 md:pt-10 md:pb-24">
      <div className="w-[93%] mx-auto rounded-xl bg-[#080807] text-[#d1d1c7] px-6 sm:px-10 md:px-12 lg:px-20 p-16">
        <AnimatedHeading
          text={headingText}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6"
        />
        <div className="max-w-2xl mb-12">
          <AnimateDescription
            text={descriptionText}
            className="text-sm sm:text-base md:text-lg lg:text-xl opacity-80 font-sans leading-relaxed"
          />
        </div>
        <div className="max-w-2xl space-y-6 p-6 sm:p-8 rounded-lg mx-auto bg-[#24231f]">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-medium text-sm sm:text-base">
              Your Name <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full px-4 py-3 text-sm sm:text-base border rounded-md bg-[#312f2d] focus:outline-none transition-colors border-gray-500 focus:border-gray-400 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
              disabled={isDisabled}
            />
            {errors.name && <p className="text-red-400 text-xs sm:text-sm">{errors.name}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-medium text-sm sm:text-base">
              Your Email <span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
              placeholder="you@example.com"
              className={`w-full px-4 py-3 text-sm sm:text-base border rounded-md bg-[#312f2d] focus:outline-none transition-colors border-gray-500 focus:border-gray-400 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
              disabled={isDisabled}
            />
            {errors.email && <p className="text-red-400 text-xs sm:text-sm">{errors.email}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="font-medium text-sm sm:text-base">
              Message <span className="text-red-400">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              spellCheck={false}
              autoCorrect="off"
              autoComplete="off"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              className={`w-full px-4 py-3 text-sm sm:text-base border rounded-md bg-[#312f2d] resize-none focus:outline-none transition-colors border-gray-500 focus:border-gray-400 ${errors.message ? 'border-red-500 focus:border-red-500' : ''}`}
              disabled={isDisabled}
            />
            {errors.message && <p className="text-red-400 text-xs sm:text-sm">{errors.message}</p>}
            <p className="text-xs text-[#a29e9a]">
              {formData.message.length} / 30 minimum characters
            </p>
          </div>

          {submitStatus === 'success' && (
            <div className="p-4 bg-green-900/30 border border-green-600 rounded-md">
              <p className="text-green-400 text-sm">
                Thank you! Your message has been sent successfully.
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="p-4 bg-red-900/30 border border-red-600 rounded-md">
              <p className="text-red-400 text-sm">Something went wrong. Please try again later.</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
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

        <div className="mt-16 md:mt-24 text-center px-4 sm:px-6 overflow-hidden">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#6b645c] mb-6">
            Or reach out directly
          </p>
          <button
            type="button"
            data-cursor="copy"
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
            className="group relative inline-block cursor-none text-[#d1d1c7] font-display font-black uppercase leading-none hover:text-[#10b981] transition-colors duration-300 max-w-full"
            style={{
              fontSize: 'clamp(0.65rem, 4.5vw, 4.5rem)',
              overflowWrap: 'break-word',
              wordBreak: 'break-all',
            }}
          >
            aitezazsikandar@gmail.com
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#10b981] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out block" />
          </button>
        </div>
      </div>

      <div
        id="email-copy-toast"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 9998,
          background: '#10b981',
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
          pointerEvents: 'none',
        }}
      >
        ✓ Copied to clipboard
      </div>
    </section>
  );
};
export default Contact;
