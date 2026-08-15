import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/store", destination: "/services", permanent: true },
      { source: "/store/:path*", destination: "/services", permanent: true },
      { source: "/checkout", destination: "/services", permanent: true },
      { source: "/checkout/:path*", destination: "/services", permanent: true },
      // Short, sayable URL for the packages page — easy to give out over the
      // phone or print, and what people type when looking for prices.
      { source: "/pricing", destination: "/programs/packages", permanent: true },
      { source: "/packages", destination: "/programs/packages", permanent: true },
    ];
  },
};

export default nextConfig;
