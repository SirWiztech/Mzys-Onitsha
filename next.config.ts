import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'standalone',
  // NOTE: mysql2 (and its deps like iconv-lite) are intentionally NOT in
  // serverExternalPackages. They are pure JS (no native binaries), so bundling
  // them inline keeps the deployed bundle self-contained — runtime externals
  // get pruned from node_modules by the Anybuild/next-bundle deploy optimizer
  // and the app then fails with "Cannot find module 'mysql2'".
};

export default nextConfig;
