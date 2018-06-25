var webpack = require("webpack");
var path = require("path");

const modulePath = dir => path.resolve(__dirname, "node_modules", dir)

module.exports = {
  entry: {
    app: [
      `script-loader!${modulePath("vega/build/vega.min.js")}`,
      `script-loader!${modulePath("vega-lite/build/vega-lite.min.js")}`,
      `script-loader!${modulePath("@mapd/connector/dist/browser-connector.js")}`,
      path.resolve(__dirname, "./index.js")
    ]
  },
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "assets"),
    publicPath: "/assets/",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "./index.js"),
        ],
        loader: "babel-loader"
      }
    ]
  }
};