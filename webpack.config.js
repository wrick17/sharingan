var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: [
    "./index.js"
  ],
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['react-hot', 'babel-loader']
      },
      {
        test: /\.less$/,
        loader: "style-loader!css-loader?localIdentName=[path][name]__[hash:base64:5]__[local]!less-loader"
      },
    ]
  },
  // plugins: [new ExtractTextPlugin("style.css", {allChunks: false})],
  devServer: {
    stats: 'warnings-only',
  }
};


// loader: ExtractTextPlugin.extract("style-loader!css-loader?localIdentName=[path][name]__[hash:base64:5]__[local]!less-loader")
