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
    path: path.join(__dirname, 'dist'),
    filename: 'index.bundle.js',
    publicPath: '/dist/'
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
    // won't allow webpack to finish the build if it encounters an error
    // new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      // exclude: /node_modules/,
      loaders: ['react-hot', 'babel'],
      include: APP_DIR
      // query: {
      //   presets: ['react', 'es2015', 'react-hmre']
      // }
    }]
  }
};
