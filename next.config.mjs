
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'khanhnn.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {},
  allowedDevOrigins: ['https://*.cloudworkstations.dev', 'https://*.firebase.studio'],
};

export default nextConfig;
