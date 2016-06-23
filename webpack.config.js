var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

const banner = ''+Date.now();

module.exports = {
  entry: {
    bundle: "./index.jsx"
  },
  output: {
    path: __dirname,
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['react-hot', 'babel-loader']
      },
      {
        test: /\.less$/,
        loader: "style-loader!css-loader?localIdentName=[path][name]__[hash:base64:5]__[local]!less-loader"
      },
    ]
  },
  plugins: [new webpack.BannerPlugin(banner)],
  devServer: {
    stats: 'warnings-only',
  }
};
