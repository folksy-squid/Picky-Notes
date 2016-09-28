/*jshint esversion: 6 */
const express = require('express');
const {db} = require('./database/db-config');

const app = express();

// add middleware
require('./config/middleware.js')(app, express);

// add routes
require('./config/routes.js')(app, express);

// set port depending on prod or dev
const port = process.env.NODE_ENV === 'production' ? 80 : 3000;

const listen = app.listen(port, () => {
  console.log('Server listening on port ' + port);
  db.sync();
  // .then(() => {
  //   console.log('Database is synced');
  // });
});

const ioServer = require('./sockets/io.js')(listen);

module.exports = {app, ioServer};
