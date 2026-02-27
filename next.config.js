/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
    // Izinkan data URL (base64) untuk foto produk yang belum pakai Cloudinary
    dangerouslyAllowSVG: false,
    unoptimized: false,
  },
};

module.exports = nextConfig;
