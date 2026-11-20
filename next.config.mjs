/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // One address for search engines and shared links: the Vercel address
  // sends every path to the club's own domain (bought 21 November 2026).
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "joka-meditates.vercel.app" }],
        destination: "https://jokameditates.org/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
