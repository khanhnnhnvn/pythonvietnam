
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
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
        protocol: 'https' as const,
        hostname: 'khanhnn.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // The value below is a workaround for development given that the
  // server is proxied in the editor.
  // In a production deployment, this should be removed.
  experimental: {},
  allowedDevOrigins: ['https://*.cloudworkstations.dev', 'https://*.firebase.studio'],
};

export default nextConfig;
