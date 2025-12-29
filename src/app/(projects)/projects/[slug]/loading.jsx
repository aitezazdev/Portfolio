'use client';

import ScrollToTopOnEnter from '@/utils/ScrollToTopOnEnter';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Loading() {
  return (
    <>
    <ScrollToTopOnEnter />
    <SkeletonTheme baseColor="#1a1917" highlightColor="#2a2825" borderRadius={12}>
      <section className="min-h-screen bg-[#080807] text-white px-6 md:px-48 py-10">
        {/* Back */}
        <Skeleton width={90} height={24} className="mb-12" />

        {/* Title */}
        <Skeleton height={80} className="mb-10" />

        {/* Tech stack */}
        <div className="mb-10">
          <Skeleton width={120} height={22} className="mb-4" />
          <Skeleton width="60%" height={18} />
        </div>

        {/* Description */}
        <div className="mb-14 space-y-3">
          <Skeleton width={140} height={22} className="mb-4" />
          <Skeleton count={3} height={18} />
        </div>

        {/* Images */}
        <div className="flex flex-col gap-8">
          <Skeleton height={400} />
          <Skeleton height={400} />
        </div>
      </section>
    </SkeletonTheme>
    </>
  );
}
