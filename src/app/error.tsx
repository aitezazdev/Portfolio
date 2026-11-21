'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream text-ink flex flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-deep mb-6">Something broke</p>
      <h1 className="font-display font-semibold tracking-[-0.04em] leading-[0.95] text-[clamp(2.5rem,10vw,7rem)]">
        That wasn&apos;t <span className="italic font-normal" style={{ fontFamily: 'var(--font-fraunces), serif' }}>supposed to happen</span>
      </h1>
      <p className="mt-6 max-w-md text-warm text-base sm:text-lg">Please try again. If it keeps happening, email me and I will look into it.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-10 inline-flex h-12 items-center rounded-full bg-accent px-8 text-sm font-medium text-on-accent cursor-pointer transition-colors hover:bg-accent-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        TRY AGAIN
      </button>
    </div>
  );
}
