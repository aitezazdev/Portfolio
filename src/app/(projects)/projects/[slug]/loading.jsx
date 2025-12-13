'use client';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Loading() {
  return (
    <section className="min-h-screen bg-[#080807] text-white px-6 md:px-48 py-10 space-y-6">
      <div className="w-24 h-6">
        <Skeleton baseColor="#2c2c2c" highlightColor="#525252" />
      </div>

      <div className="mb-6">
        <Skeleton heig ht={64} width="60%" baseColor="#2c2c2c" highlightColor="#525252" />
      </div>

      <div className="mb-8 mt-10">
        <Skeleton height={20} width={100} baseColor="#2c2c2c" highlightColor="#525252" />
        <Skeleton
          height={16}
          width="80%"
          className="mt-2"
          baseColor="#2c2c2c"
          highlightColor="#525252"
        />
      </div>

      <div className="mb-14 space-y-2">
        <Skeleton height={20} width={120} baseColor="#2c2c2c" highlightColor="#525252" />
        <Skeleton count={4} height={16} width="100%" baseColor="#2c2c2c" highlightColor="#525252" />
      </div>

      <div className="flex flex-col gap-6 mb-16">
        <Skeleton
          height={300}
          className="rounded-xl"
          baseColor="#2c2c2c"
          highlightColor="#525252"
        />
        <Skeleton
          height={300}
          className="rounded-xl"
          baseColor="#2c2c2c"
          highlightColor="#525252"
        />
      </div>

      <div className="relative flex justify-center items-center mt-auto py-8">
        <div className="text-center space-y-2">
          <Skeleton height={20} width={150} baseColor="#2c2c2c" highlightColor="#525252" />
          <Skeleton height={20} width={200} baseColor="#2c2c2c" highlightColor="#525252" />
        </div>

        <div className="absolute right-0 w-10 h-10 rounded-full bg-[#6b645c]"></div>
      </div>
    </section>
  );
}
