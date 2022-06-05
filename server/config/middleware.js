/*jshint esversion: 6 */

const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('./passport');
var session = require("express-session");
var compression = require('compression');
// const hotreload = require('./hotreload');

module.exports = (app, express) => {
//  app.use(morgan('dev'));
  if (process.env.NODE_ENV === 'client') {
    hotreload(app);
  }
  app.use(compression());
  app.use(passport.initialize());
  app.use(bodyParser.json());
  app.use(express.static('../'));
  app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true,
    })
  );
};
