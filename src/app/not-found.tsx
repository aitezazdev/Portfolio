import Link from 'next/link';

export const metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream text-ink flex flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-deep mb-6">Error 404</p>
      <h1 className="font-display font-semibold tracking-[-0.04em] leading-[0.95] text-[clamp(3rem,12vw,9rem)]">
        Lost in <span className="italic font-normal" style={{ fontFamily: 'var(--font-fraunces), serif' }}>the storm</span>
      </h1>
      <p className="mt-6 max-w-md text-warm text-base sm:text-lg">I cannot find that page. It may have moved, or the link might be wrong.</p>
      <Link
        href="/"
        className="mt-10 inline-flex h-12 items-center rounded-full bg-accent px-8 text-sm font-medium text-on-accent no-underline transition-colors hover:bg-accent-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        BACK HOME →
      </Link>
    </div>
  );
}
