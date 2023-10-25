const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = (phase, { defaultConfig }) => {
  // Configuration for all phases
  const commonConfig = {
    webpack: (config, { isServer }) => {
      // Specify fallbacks for Node.js core modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };

      config.externals = config.externals || [];
      config.externals.push(function (context, request, callback) {
        if (/zlib-sync$/.test(request)) {
          return callback(null, 'commonjs ' + request);
        }
        callback();
      });

      return config;
    },
    async redirects() {
      return [
        {
          source: '/',
          destination: '/dashboard',
          permanent: true,
        },
      ];
    },
  };

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    // Merging development configuration
    return withBundleAnalyzer({
      ...commonConfig,
    });
  }

  // Merging configuration for all phases except development
  return withBundleAnalyzer({
    ...commonConfig,
    typescript: {
      ignoreBuildErrors: true,
    },
  });
};
