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
    ];
  },
};

export default nextConfig;
