import type { NextConfig } from "next";

const backendUrl = process.env.API_BASE_URL || 'http://localhost:8000/api';

const nextConfig: NextConfig = {
  trailingSlash: true,
  async rewrites() {
    return [
      // トレイリングスラッシュがある場合はそのまま通す
      {
        source: '/api/proxy/:path*/',
        destination: `${backendUrl}/:path*/`,
      },
      // トレイリングスラッシュがない場合
      {
        source: '/api/proxy/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
