'use client';

export default function ProjectsLayout({ children }) {
  return (
    <>
      {children}
      <div
        className="page-transition fixed inset-0 bg-white z-50 pointer-events-none"
        style={{ transform: 'translateY(100%)' }}
      >
        <div
          className="page-transition--inner h-full w-full"
          style={{ transform: 'translateY(100%)' }}
        ></div>
      </div>
    </>
  );
}
