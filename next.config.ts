import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
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
    ],
  },
  // The value below is a workaround for development given that the
  // server is proxied in the editor.
  // In a production deployment, this should be removed.
  experimental: {},
  allowedDevOrigins: ['https://*.cloudworkstations.dev'],
};

export default nextConfig;
