const path = require("path");

const webpack = require("webpack");

const CopyWebpackPlugin = require("copy-webpack-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const merge = require("webpack-merge").merge;
const common = require("./webpack.common.js");

const PATHS = {
  src: path.join(__dirname, "../src"),
  dist: path.join(__dirname, "../dist"),
};

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        //exclude: /node_modules/u,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  devServer: {
    // inline: true,
    //mode: 'development',
    host: "0.0.0.0",
    port: 8889,
    static: {
      directory: path.resolve(__dirname, "asset"), // 정적 파일 제공 경로
    },
    watchFiles: ["src/**/*"],
    open: {
      app: {
        name: "chrome",
        arguments: ["--new-window", "--auto-open-devtools-for-tabs"],
      },
    },
  },
  plugins: [
    //new BundleAnalyzerPlugin()
    new CopyWebpackPlugin({
      patterns: [{ from: "dist", to: "dist" }],
    }),
  ],
});
