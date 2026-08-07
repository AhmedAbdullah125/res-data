import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Uploads are served from the dashboard host (site logo, team photos,
    // testimonial avatars, blog covers, video posters…).
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dashboard.res-va.com',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
    ],
  },
}

export default nextConfig
