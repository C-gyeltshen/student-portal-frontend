import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Enable CORS for backend API calls
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
    ];
  },

  // Optional: Add rewrites if you want to proxy requests through Next.js
  // This can help avoid CORS issues in development
  async rewrites() {
    return [
      // Uncomment if you want to use Next.js as a proxy
      // {
      //   source: '/api/students/:path*',
      //   destination: 'http://localhost:8084/api/students/:path*',
      // },
      // {
      //   source: '/api/finance/:path*',
      //   destination: 'http://localhost:8085/api/:path*',
      // },
    ];
  },
};

export default nextConfig;
