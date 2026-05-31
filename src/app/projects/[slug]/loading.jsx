export default function Loading() {
  return (
    <section className="min-h-screen bg-[#080807] text-white px-6 md:px-48 py-10">
      <div className="animate-pulse">
        <div className="h-6 w-20 bg-[#2a2825] rounded-md mb-12" />
        <div className="h-16 md:h-24 bg-[#1a1917] rounded-lg mb-10 w-3/4" />
        <div className="mb-10 space-y-3">
          <div className="h-4 w-28 bg-[#1a1917] rounded" />
          <div className="h-4 w-64 bg-[#1a1917] rounded" />
        </div>
        <div className="mb-14 space-y-3">
          <div className="h-4 w-32 bg-[#1a1917] rounded" />
          <div className="h-4 w-full bg-[#1a1917] rounded" />
          <div className="h-4 w-4/5 bg-[#1a1917] rounded" />
          <div className="h-4 w-3/5 bg-[#1a1917] rounded" />
        </div>
        <div className="space-y-8">
          <div className="h-64 md:h-[400px] bg-[#1a1917] rounded-xl" />
          <div className="h-64 md:h-[400px] bg-[#1a1917] rounded-xl" />
        </div>
      </div>
    </section>
  );
}
