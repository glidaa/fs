// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  reactScriptsVersion: "react-scripts",
  webpack: {
    configure: {
      plugins: [
        new CompressionPlugin(),
        // new BundleAnalyzerPlugin()
      ],
      resolve: {
        fallback: {
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
