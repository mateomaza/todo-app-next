const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (process.env.ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: 'auto',
          openAnalyzer: true,
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;