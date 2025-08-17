/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ⬅️ isso ignora todos os erros de TS durante o build
  },
  images: {
    domains: ["localhost", "midara-midias.s3.us-east-1.amazonaws.com"],
  },
};

module.exports = nextConfig;
