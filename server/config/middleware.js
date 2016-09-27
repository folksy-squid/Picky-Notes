const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('./passport');



module.exports = (app, express) => {
//  app.use(morgan('dev'));
  app.use(passport.initialize());
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));
};
