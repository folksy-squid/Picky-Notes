var path = require('path');


// Add spec files to compile
module.exports = {
  entry: './client/src/index.jsx',
  output: {
    path: path.join(__dirname, '/client/dist'),
    filename: 'index.bundle.js',
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