import type { NextConfig } from "next";

// Custom domain: guidelinesgenius.dathproject.com — site served at root,
// so no basePath. `output: "export"` produces a static `out/` directory
// that GitHub Pages can serve. `images.unoptimized: true` is required
// because GitHub Pages has no image-optimization server.
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "www.guidelinegenius.com" },
      { protocol: "https", hostname: "guidelinegenius.com" },
    ],
  },
};

export default config;
