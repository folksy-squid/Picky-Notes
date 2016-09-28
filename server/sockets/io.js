const {createRoom, joinRoom} = require('./io-helpers');
const {findRoom} = require('../database/db-helpers');

module.exports = (listen) => {
  const io = require('socket.io').listen(listen);
  const rooms = io.sockets.adapter.rooms;

  io.on('connection', (socket) => {
    //console.log('a user connected');

    socket.on('create room', (pathUrl, userId) => {
      // verify if pathUrl and userId are valid
      if (pathUrl.length === 5 && userId) {
        // verify if room at pathUrl exists in database
        findRoom(pathUrl, (found) => {
          if (true) {
            createRoom();
            joinRoom(socket, pathUrl, userId, () => socket.emit('create room success'));
          }
        });
      }
      socket.emit('create room error', `Room '${pathUrl}' is invalid`);
    });

    socket.on('join room', (pathUrl, userId) => {
      // verify if pathUrl and userId are valid and if room at pathUrl exists
      if (pathUrl.length === 5 && userId && rooms[pathUrl]) {
        joinRoom(socket, pathUrl, userId, () => socket.emit('join room success'));
        return;
      }
      socket.emit('join room error', `Room '${pathUrl}' was not found`);
    });

    socket.on('lecture start', (pathUrl) => {
      if (socket.pathUrl) {
        io.in(socket.pathUrl).emit('lecture started');
      } else {
        socket.emit('lecture start error', 'You do not belong to a room');
      }
    });

    socket.on('lecture end', (pathUrl) => {
      if (socket.pathUrl) {
        io.in(socket.pathUrl).emit('lecture ended');
      } else {
        socket.emit('lecture end error', 'You do not belong to a room');
      }
    });

    socket.on('new note', (note) => {
      if (note) {

        /* redis ==> add note to "userId:pathUrl" List of notes*/
        // note = { userId, content, pathUrl, timeStamp }
        // userId:pathUrl
        // save notes into redis
      }
    });

    //socket.on('disconnect', () => console.log('a user disconnected'));
  });
  return io;
};
