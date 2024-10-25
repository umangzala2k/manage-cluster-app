import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/cluster/performance-metrics',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;


