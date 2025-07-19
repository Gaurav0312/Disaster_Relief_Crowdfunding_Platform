/** @type {import('next').NextConfig} */
const nextConfig = {

  experimental: {
    scrollRestoration: true
  },
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/api/**',
      },
      // Add other image domains you're using
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dxqerqng1/image/upload/**',
      },
    ],
  },
};
export default nextConfig;
