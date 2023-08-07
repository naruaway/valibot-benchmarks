const TerserPlugin = require("terser-webpack-plugin");
// const mangle = false;
/** @type {import('webpack').Configuration} */
module.exports = {
  entry: { main: "./src/main.ts" },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: { pure_getters: true, passes: 5 },
          mangle: false,
          // mangle: mangle
          //   ? {
          //     properties: {
          //       reserved: ["errors", "minimum", "keys", "code", "path"],
          //     },
          //   }
          //   : true,
        },
      }),
    ],
  },
  resolve: {
    extensions: ["...", ".ts", ".tsx"],
    extensionAlias: {
      ".js": [".ts", ".js"],
      ".mjs": [".mts", ".mjs"]
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, use: {
          loader: "babel-loader", options: {
            presets: ["@babel/preset-typescript"],
          }
        }
      },
    ],
  },
};

