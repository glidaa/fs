const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  reactScriptsVersion: "react-scripts",
  webpack: {
    configure: {
      plugins: [
        new BundleAnalyzerPlugin()
      ],
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
