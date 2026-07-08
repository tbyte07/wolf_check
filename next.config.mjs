/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Thumbnails are served through our own /api/thumb route, but allow the
    // known static hosts in case a real thumbnail_url is added later.
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "p16-sign.tiktokcdn-us.com" },
      { protocol: "https", hostname: "**.tiktokcdn.com" },
    ],
  },
};

export default nextConfig;
