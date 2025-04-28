import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental:{
    serverComponentsHmrCache:false
  },
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"https://jydmdwlcglzfjwartfkz.supabase.co"
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/embed",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-src 'self' http://roadsidecoder.created.app",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
