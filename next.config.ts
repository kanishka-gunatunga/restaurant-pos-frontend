import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optional: Proxy API requests to Express backend during development
  // Uncomment when backend URL differs from frontend
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/api/:path*`,
  //     },
  //   ];
  // },
};

export default nextConfig;
