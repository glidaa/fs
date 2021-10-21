const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const sassResourcesLoader = require("craco-sass-resources-loader");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  reactScriptsVersion: "react-scripts",
  plugins: [
    {
      plugin: sassResourcesLoader,
      options: {
        resources: "./src/scss/shared.scss",
      },
    },
  ],
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
