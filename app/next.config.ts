
/** @type {import('next').NextConfig} */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const nextConfig = {
  async rewrites() {
    return [
      { source: '/api/:path*',  destination: `${API_URL}/api/:path*` },
      { source: '/media/:path*', destination: `${API_URL}/media/:path*` },
    ]
  },
}

module.exports = nextConfig
