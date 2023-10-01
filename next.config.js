const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = (phase, { defaultConfig }) => {
  // Configuration for all phases
  const commonConfig = {
    // ... your common configuration if any
    // transpilePackages: ["./src/app/api"]
    webpack: (config, { isServer }) => {
        if (!isServer) {
          config.resolve.fallback = {
            fs: false,
            path: false,
            stream: false,
          };
        }
    
        return config;
      },
  };

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    // Merging development configuration
    return withBundleAnalyzer({
      ...commonConfig,
      // ... your development-only config
    });
  }

  // Merging configuration for all phases except development
  return withBundleAnalyzer({
    ...commonConfig,
    // ... other configuration for all phases except development
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
  });
};
