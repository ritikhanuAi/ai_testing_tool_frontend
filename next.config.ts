import type { NextConfig } from "next";

import path from "node:path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.111", "localhost", "127.0.0.1"],
  turbopack: {
    root: path.resolve(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
