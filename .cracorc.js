module.exports = {
  reactScriptsVersion: "react-scripts" /* (default value) */,
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "crypto": require.resolve("crypto-browserify"),
          "stream": require.resolve("stream-browserify")
        }
      },
      module: {
        rules: [
          {
            test: /\.m?js/,
            resolve: {
              fullySpecified: false
            }
          }
        ]
      }
    },
  },
};