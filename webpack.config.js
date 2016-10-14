var path = require('path');
var webpack = require('webpack');
var APP_DIR = path.resolve(__dirname, 'client/src');

// Add spec files to compile
module.exports = {
  devtool: 'eval',
  entry: [
    //entry for webpack to look for current code when change
    'webpack-hot-middleware/client',
    'webpack/hot/dev-server',
    //entry to create bundle for the first time entering app
    APP_DIR + '/index.jsx'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.bundle.js',
    publicPath: 'http://localhost:8800/dist/'
  },
  // devServer: {
  //   hot: true,
  //   inline: true,
  //   port: 7700,
  //   historyApiFallback: true
  // },
  plugins: [
    // optimizes the order and efficiency of module usage
    // new webpack.optimize.OccurrenceOrderPlugin(),
    // allows changes to be replaced 'hot-modularly'. >> A middleware within your server
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: ['react-hot', 'babel'],
      include: APP_DIR
    },
    {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    },
    {
      test: /\.json$/,
      loader: 'json'
    },
    {
      test: /masonry|imagesloaded|fizzy\-ui\-utils|desandro\-|outlayer|get\-size|doc\-ready|eventie|eventemitter/,
      loader: 'imports?define=>false&this=>window'
    }]
  }
};
