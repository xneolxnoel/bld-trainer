import type { NextConfig } from "next";

// Automatically set basePath for GitHub Pages project sites.
// For a user/org site (repo name = <username>.github.io), leave basePath empty.
// For a project site (repo name = my-repo), basePath should be "/my-repo".
const getBasePath = () => {
  if (process.env.GITHUB_ACTIONS && process.env.GITHUB_REPOSITORY) {
    const repo = process.env.GITHUB_REPOSITORY.split("/")[1];
    return `/${repo}`;
  }
  return "";
};

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  basePath: getBasePath(),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
