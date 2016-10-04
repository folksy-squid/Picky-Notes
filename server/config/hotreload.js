// create webpack middleware
const webpack = require('webpack');
const webpackconfig = require('../../webpack.config.js');

// hooks webpack up to express
const webpackDevMiddleware = require('webpack-dev-middleware');
// hooks webpack up to hot module reloading
const webpackHotMiddleware = require('webpack-hot-middleware');
const compiler = webpack(webpackconfig);

//hot module reloading middleware
module.exports = (app) => {
  console.log('running hotreload!');
  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackconfig.output.publicPath,
    noInfo: true,
    stats: {
      colors: true,
      chunks: false,
      'errors-only': true
    }
  }));
  app.use(webpackHotMiddleware(compiler, {
    log: console.log
  }));

  return app;
};
