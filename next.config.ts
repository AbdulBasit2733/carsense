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
        hostname:"jydmdwlcglzfjwartfkz.supabase.co"
      },
      {
        protocol:"https",
        hostname:"images.unsplash.com"
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
