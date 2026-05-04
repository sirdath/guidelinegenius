import type { NextConfig } from "next";

// Repo at https://github.com/sirdath/guidelinegenius → served from
// https://sirdath.github.io/guidelinegenius/, so basePath is required.
// `output: "export"` produces a static `out/` directory that GitHub Pages can serve.
// `images.unoptimized: true` is required because GitHub Pages has no image
// optimization server.
const config: NextConfig = {
  output: "export",
  basePath: "/guidelinegenius",
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
