/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
    serverActions: { enabled: true }
  }
};
export default nextConfig;
