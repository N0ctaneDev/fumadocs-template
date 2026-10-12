import { createMDX } from "fumadocs-mdx/next";
import { siteConfig } from "./__CONFIG__";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  basePath: siteConfig.basePath,
  reactStrictMode: true,
  output: "export" as const, // ⭐ 必须
  images: {
    unoptimized: true, // GitHub Pages 不支持 Image 优化
  },
  trailingSlash: true,
  turbopack: {
    rules: {
      "*.tsx.virtual": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },
};

export default withMDX(config);
