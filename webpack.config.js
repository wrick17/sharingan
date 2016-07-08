var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
const banner = ''+Date.now();
var autoprefixer = require('autoprefixer');

module.exports = {
  entry: {
    bundle: "./index.jsx"
  },
  output: {
    path: __dirname,
    publicPath: "/dist/",
    filename: "[name].js"
  },
  module: {
    noParse: /node_modules\/localforage\/dist\/localforage.js/,
    loaders: [
      {
        test: /\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['react-hot', 'babel-loader']
      },
      {
        test: /\.less$/,
        loader: "style-loader!css-loader!postcss-loader!less-loader"
      }
    ],
  },
  postcss: [ autoprefixer({ browsers: ['last 3 versions', '> 1%'] }) ],
  plugins: [
    new webpack.BannerPlugin(banner),
    new ExtractTextPlugin("style.css")
  ],
  devtool: 'eval',
  devServer: {
    stats: 'warnings-only',
  }
};

// "style-loader!css-loader?localIdentName=[path][name]__[hash:base64:5]__[local]!less-loader
