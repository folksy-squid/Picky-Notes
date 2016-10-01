/*jshint esversion: 6 */

const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('./passport');

// create webpack middleware
const webpack = require('webpack');
const webpackconfig = require('../../webpack.config.js');

// hooks webpack up to express
const webpackDevMiddleware = require('webpack-dev-middleware');
// hooks webpack up to hot module reloading
const webpackHotMiddleware = require('webpack-hot-middleware');

const compiler = webpack(webpackconfig);

module.exports = (app, express) => {
//  app.use(morgan('dev'));
  app.use(webpackDevMiddleware(compiler, {
    //so we don't see every output that webpack is doing in console
    noInfo: true,
    //path that the dev simulates as path
    publicPath: webpackconfig.output.publicPath
  }));
  app.use(webpackHotMiddleware(compiler));

  app.use(express.static('./client/dist'));

  app.use(passport.initialize());
  app.use(bodyParser.json());
  // app.use(express.static(__dirname + '/../../client'));

};
