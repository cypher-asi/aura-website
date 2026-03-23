import type { NextConfig } from 'next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ourNodeModules = path.resolve(__dirname, 'node_modules');

const nextConfig: NextConfig = {
  transpilePackages: ['@cypher-asi/zui'],
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve = config.resolve ?? {};

    // Prevent webpack from following the zui symlink, which would cause
    // it to resolve react from ../zui/node_modules instead of ours.
    config.resolve.symlinks = false;

    // Ensure our node_modules is searched first for shared dependencies.
    config.resolve.modules = [
      ourNodeModules,
      ...(config.resolve.modules ?? ['node_modules']),
    ];

    return config;
  },
};

export default nextConfig;
