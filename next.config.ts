import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'standalone',
  serverExternalPackages: ['mysql2', 'iconv-lite'],
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
