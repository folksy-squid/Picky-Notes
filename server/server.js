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
  db.sync();                  // use for production
  // db.sync({force: true});     // use for development when you need to drop database
  // .then(() => {
  //   console.log('Database is synced');
  // });
});

var io = require('socket.io').listen(listen);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => console.log('a user disconnected'));
});


module.exports = app;
