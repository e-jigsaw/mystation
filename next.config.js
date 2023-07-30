/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  rewrites: async () => {
    return [
      {
        source: "/api/feed",
        destination: "https://s3.jgs.me/mystation/feed.xml",
      },
    ];
  },
};

module.exports = nextConfig;
