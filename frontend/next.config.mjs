/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  logging: {
    fetches: {
      fullUrl: true,
    }
  }
};

export default nextConfig;
