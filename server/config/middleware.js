/*jshint esversion: 6 */

const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('./passport');
const hotreload = require('./hotreload');

module.exports = (app, express) => {
//  app.use(morgan('dev'));
  // process.env.NODE_ENV === 'client' && hotreload(app);
  // process.env.NODE_ENV === 'dev' && console.log('NOT running hotreload');
  app.use(passport.initialize());
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));
};
