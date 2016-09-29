var path = require('path');


// Add spec files to compile
module.exports = {
  entry: './client/src/index.jsx',
  output: {
    path: path.join(__dirname, '/client/dist'),
    filename: 'index.bundle.js',
    publicPath: 'http://localhost:7700/dist',
  },
  devServer: {
    hot: true,
    inline: true,
    port: 7700,
    historyApiFallback: true
  },
  externals: {
    'cheerio': 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015']
      }
    }]
  },
  devtool: 'source-map'
};
