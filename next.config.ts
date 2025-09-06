
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This is required to allow the Studio preview to access the Next.js dev server.
    allowedDevOrigins: [
      'https://*.cloudworkstations.dev',
      'https://*.firebase.studio',
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
