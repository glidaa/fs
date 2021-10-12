const CracoWorkboxPlugin = require('craco-workbox');

module.exports = {
  reactScriptsVersion: "react-scripts",
  plugins: [
    {
      plugin: CracoWorkboxPlugin,
    },
  ],
  webpack: {
    configure: {
      resolve: {
        fallback: {
          crypto: require.resolve("crypto-browserify"),
          stream: require.resolve("stream-browserify"),
        },
      },
      module: {
        rules: [
          {
            test: /\.m?js/,
            resolve: {
              fullySpecified: false,
            },
          },
        ],
      },
    },
  },
};
