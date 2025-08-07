/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ppqctvmpsmlagsmmmdee.supabase.co',
        port: '',
        pathname: '/storage/v1/object/sign/**',
      },
    ],
  },
};

module.exports = nextConfig;
