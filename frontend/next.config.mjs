/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Local dev
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },

      // Strapi Cloud API host (JSON, admin, etc.)
      {
        protocol: 'https',
        hostname: 'dazzling-baseball-a65e615659.strapiapp.com',
        port: '',
        pathname: '/uploads/**',
      },

      // 🔥  Strapi Cloud media CDN host (actual image bytes)
      {
        protocol: 'https',
        hostname: 'dazzling-baseball-a65e615659.media.strapiapp.com',
        port: '',
        pathname: '/**',          // or '/uploads/**' – either works
      },

      // (Optional) wildcard to future-proof – Next 13+ supports **:
      // {
      //   protocol: 'https',
      //   hostname: '**.media.strapiapp.com',
      //   port: '',
      //   pathname: '/**',
      // },
    ],
  },
};

export default nextConfig;
