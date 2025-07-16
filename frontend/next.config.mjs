/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      // If you also deploy / preview on Strapi Cloud:
      {
        protocol: 'https',
        hostname: 'dazzling-baseball-a65e615659.strapiapp.com',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
