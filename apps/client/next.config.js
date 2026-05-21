/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['assets.coingecko.com'],
  },
};

module.exports = nextConfig;
