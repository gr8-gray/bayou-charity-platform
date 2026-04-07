import { withSentryConfig } from '@sentry/nextjs';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer }) {
    if (!isServer) {
      const existing = config.optimization.splitChunks?.cacheGroups ?? {};
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...existing,
          // Keep leaflet out of shared sync chunks — it's only needed on
          // /innisfree and /members/map (both load it via dynamic import)
          leaflet: {
            test: /node_modules[\\/]leaflet/,
            chunks: 'async',
            name: 'leaflet',
            enforce: true,
            priority: 30,
          },
        },
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'osiramhnynhwmlfyuqcp.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'ezndphlcgeonbfgelzjd.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com',
      },
      {
        protocol: 'https',
        hostname: '*.fbcdn.net',
      },
    ],
  },
  transpilePackages: ['@bayou/ui', '@bayou/supabase'],
};

export default withBundleAnalyzer(withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG || 'bayou-charity',
  project: process.env.SENTRY_PROJECT || 'bayou-web',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
}));
