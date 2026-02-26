/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Untuk logo dan foto lokal di /public tidak perlu domain
  },
};

module.exports = nextConfig;
