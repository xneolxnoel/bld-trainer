import type { NextConfig } from "next";

// GitHub Pages basePath:
// - Custom domain (e.g. https://bldtrainer.com/): keep basePath as ""
// - Default project URL (e.g. https://xneolxnoel.github.io/bld-trainer/): set to "/bld-trainer"
const basePath = "";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
