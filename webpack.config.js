var path = require('path');
var webpack = require('webpack');

// Add spec files to compile
module.exports = {
  entry: [
    //entry for webpack to look for current code when change
    'webpack-hot-middleware/client',
    //entry to create bundle for the first time entering app
    './client/src/index.jsx'
  ],
  output: {
    // path: path.join(__dirname, '/client/dist'),
    path: path.resolve('./client/dist'),
    filename: 'index.bundle.js',
    publicPath: '/'
  },
  // devServer: {
  //   hot: true,
  //   inline: true,
  //   port: 7700,
  //   historyApiFallback: true
  // },
  externals: {
    'cheerio': 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  },
  plugins: [
    // optimizes the order and efficiency of module usage
    new webpack.optimize.OccurrenceOrderPlugin(),
    // allows changes to be replaced 'hot-modularly'. >> A middleware within your server
    new webpack.HotModuleReplacementPlugin(),
    // won't allow webpack to finish the build if it encounters an error
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015', 'react-hmre']
      }
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }]
  },
  devtool: 'inline-source-map'
};
