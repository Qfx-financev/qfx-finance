/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['assets.coingecko.com'],
  },
};

module.exports = nextConfig;

// Force API URL
process.env.NEXT_PUBLIC_API_URL = 'https://api.qfx-finance.com';

// Force API URL
process.env.NEXT_PUBLIC_API_URL = 'https://api.qfx-finance.com';
