const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  context: __dirname + "/app",
  plugins: [new MiniCssExtractPlugin()],
  mode: "production",
  entry: "./entry",
  output: {
    path: __dirname + "/public/javascripts",
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        // 対象となるファイルの拡張子.
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // スタイルシートをJSからlinkタグに展開する機能.
          //np"style-loader",
          // CSSをバンドルするための機能.
          "css-loader",
        ],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        include: path.resolve(
          __dirname,
          "./node_modules/bootstrap-icons/font/fonts"
        ),
        type: "asset/resource",
      },
    ],
  },
  optimization: {
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
};
