import React from 'react';

export default function ProjectLoading() {
  return (
    <section className="min-h-screen bg-[#080807] text-white px-6 md:px-48 py-10 animate-pulse">
      {/* Back button skeleton */}
      <div className="mb-12">
        <div className="h-6 w-20 bg-[#1e1e1c] rounded-md" />
      </div>

      {/* Title skeleton */}
      <div className="mb-8 flex items-center justify-between">
        <div className="h-14 w-3/4 max-w-xl bg-[#1e1e1c] rounded-xl" />
        <div className="hidden md:flex gap-4">
          <div className="w-14 h-14 rounded-full bg-[#1e1e1c]" />
          <div className="w-14 h-14 rounded-full bg-[#1e1e1c]" />
        </div>
      </div>

      {/* Tech stack skeleton */}
      <div className="mb-8">
        <div className="h-5 w-28 bg-[#1e1e1c] rounded mb-2" />
        <div className="h-6 w-full max-w-md bg-[#161615] rounded" />
      </div>

      {/* Description skeleton */}
      <div className="mb-12">
        <div className="h-5 w-32 bg-[#1e1e1c] rounded mb-3" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-[#161615] rounded" />
          <div className="h-4 w-5/6 bg-[#161615] rounded" />
          <div className="h-4 w-4/6 bg-[#161615] rounded" />
        </div>
      </div>

      {/* Image card skeleton */}
      <div className="flex flex-col gap-12 mb-16">
        <div className="w-full aspect-[16/10] max-h-[750px] bg-[#161615] border border-[#2a2a28] rounded-xl flex items-center justify-center">
          <div className="text-gray-600 font-mono text-xs uppercase tracking-widest">
            Loading Project Preview...
          </div>
        </div>
      </div>
    </section>
  );
}
