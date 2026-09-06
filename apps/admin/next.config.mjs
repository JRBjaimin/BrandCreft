/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@brandcraft/types', '@brandcraft/validation', '@brandcraft/api-client'],
};

export default nextConfig;
