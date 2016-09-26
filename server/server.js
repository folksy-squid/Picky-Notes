const express = require('express');
const {db} = require('./database/db-config');

const app = express();

// add middleware
require('./config/middleware.js')(app, express);

// add routes
require('./config/routes.js')(app, express);

// set port depending on prod or dev
const port = process.env.NODE_ENV === 'production' ? 80 : 3000;

if (!module.parent) {
  const listen = app.listen(port, () => {
    console.log('Server listening on port ' + port);
    db.sync();
    // .then(() => {
    //   console.log('Database is synced');
    // });
  });

  // listen for incoming sockets on this server
  var io = require('socket.io').listen(listen);


  io.on('connection', (socket) => {
    console.log('a user connected');
    
    // listen to room 'KUNAL'
    socket.on('join room', (name, room) => {
      socket.join(room);
      io.in(room).emit('user joined', `${name} has joined room: ${room}`);
    });
    
    socket.on('disconnect', () => console.log('a user disconnected'));
  });
}


module.exports = {app, io};
