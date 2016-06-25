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
    path: path.join(__dirname, 'dist'),
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
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader!less-loader")
      }
    ],
  },
  postcss: [ autoprefixer({ browsers: ['last 3 versions', '> 1%'] }) ],
  plugins: [
    new webpack.BannerPlugin(banner),
    new ExtractTextPlugin("style.css"),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
  devtool: 'cheap-module-source-map',
  devServer: {
    stats: 'warnings-only',
  }
};

// "style-loader!css-loader?localIdentName=[path][name]__[hash:base64:5]__[local]!less-loader
