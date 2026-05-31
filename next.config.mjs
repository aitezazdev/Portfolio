const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  compress: true,
  experimental: {
    optimizePackageImports: ['gsap', 'lucide-react', 'react-icons'],
  },
  poweredByHeader: false,
  reactStrictMode: false,
};
export default nextConfig;
