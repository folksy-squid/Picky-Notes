module.exports = {
  entry: './client/src/index.jsx',
  output: {
    path: './client/dist',
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