const bodyParser = require('body-parser');
const morgan = require('morgan');

module.exports = (app, express, compiler, config) => {
//  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));

  // add webpack middleware
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.path
  }));

  app.use(require('webpack-hot-middleware')(compiler));
};
