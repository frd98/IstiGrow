/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // static export for easy deployment (Vercel/Netlify/Firebase Hosting)
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
