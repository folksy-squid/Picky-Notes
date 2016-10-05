/*jshint esversion: 6 */

const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('./passport');
const hotreload = require('./hotreload');

module.exports = (app, express) => {
//  app.use(morgan('dev'));
  if (process.env.NODE_ENV === 'client') {
    hotreload(app);
  }
  app.use(passport.initialize());
  app.use(bodyParser.json());
  app.use(express.static('../'));
};
