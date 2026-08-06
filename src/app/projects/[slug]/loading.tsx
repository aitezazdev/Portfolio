import React from 'react';

export default function ProjectLoading() {
  return (
    <section className="min-h-screen bg-[#080807] text-white px-6 md:px-48 py-10 relative overflow-hidden select-none">
      <style>{`
        @keyframes shimmerGlow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes subtlePulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .shimmer-box {
          position: relative;
          overflow: hidden;
          background-color: #121211;
          border: 1px solid #1f1f1d;
        }
        .shimmer-box::after {
          content: '';
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.04) 30%,
            rgba(108, 60, 225, 0.08) 50%,
            rgba(255, 255, 255, 0.04) 70%,
            transparent 100%
          );
          animation: shimmerGlow 2.2s infinite ease-in-out;
        }
        .pulse-subtle {
          animation: subtlePulse 2s infinite ease-in-out;
        }
      `}</style>

      {/* Top Back Navigation Skeleton */}
      <div className="mb-12">
        <div className="shimmer-box h-7 w-24 rounded-full flex items-center px-3">
          <div className="h-2 w-12 bg-white/10 rounded" />
        </div>
      </div>

      {/* Header & Action Buttons Skeleton */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="shimmer-box h-12 md:h-16 w-3/4 max-w-2xl rounded-2xl" />
        <div className="flex gap-4">
          <div className="shimmer-box w-12 h-12 md:w-14 md:h-14 rounded-full" />
          <div className="shimmer-box w-12 h-12 md:w-14 md:h-14 rounded-full" />
        </div>
      </div>

      {/* Metadata Section: Tech Stack */}
      <div className="mb-8">
        <div className="h-4 w-28 bg-[#1f1f1d] rounded mb-3 pulse-subtle" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="shimmer-box h-7 w-24 rounded-full" />
          ))}
        </div>
      </div>

      {/* Description Section */}
      <div className="mb-12">
        <div className="h-4 w-32 bg-[#1f1f1d] rounded mb-4 pulse-subtle" />
        <div className="space-y-3 max-w-4xl">
          <div className="shimmer-box h-4 w-full rounded-md" />
          <div className="shimmer-box h-4 w-11/12 rounded-md" />
          <div className="shimmer-box h-4 w-4/5 rounded-md" />
        </div>
      </div>

      {/* Main Image Showcase Card Skeleton */}
      <div className="flex flex-col gap-12 mb-16">
        <div className="shimmer-box w-full aspect-[16/10] max-h-[750px] rounded-2xl flex flex-col items-center justify-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#6C3CE1] pulse-subtle shadow-[0_0_12px_rgba(108,60,225,0.6)]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
            Loading Project Media
          </span>
        </div>
      </div>
    </section>
  );
}
