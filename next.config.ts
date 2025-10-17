/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Applies to all API routes
        source: "/api/:path*",
        headers: [
          // Allows any origin to access your API
          { key: "Access-Control-Allow-Origin", value: "*" },
          // Allows the specified methods
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          // Allows the specified headers
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;