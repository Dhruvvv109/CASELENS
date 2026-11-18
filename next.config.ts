import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* config options here - no backend needed, all data is in-memory */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};
export default nextConfig;