/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/feed",
        destination: `https://s3.jgs.me/${process.env.MINIO_BUCKET}/feed.xml`,
      },
    ];
  },
};

module.exports = nextConfig;
