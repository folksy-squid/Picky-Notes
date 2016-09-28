const {joinRoom} = require('./io-helpers');
const {findRoomId} = require('../database/db-helpers');

module.exports = (listen) => {
  const io = require('socket.io').listen(listen);
  const rooms = io.sockets.adapter.rooms;

  io.on('connection', (socket) => {
    //console.log('a user connected');

    socket.on('create room', (pathUrl, userId) => {
      // verify if pathUrl and userId is valid
      if (pathUrl.length === 5 && userId) {
        // find roomId with pathUrl
        var roomId = pathUrl; // temp
      }

      if (roomId) {
        joinRoom(socket, roomId, userId, () => socket.emit('create room success'));
      } else {
        socket.emit('create room error', `Room '${pathUrl}' is invalid`);
      }
    });

    socket.on('join room', (pathUrl, userId) => {
      // verify if pathUrl and userId is valid
      if (pathUrl.length === 5 && userId) {
        // find roomId with pathUrl
        findRoomId(pathUrl, (roomId) => {
          console.log(roomId);
        });
        var roomId = pathUrl; // temp
      }

      if (roomId && rooms[roomId]) {
        joinRoom(socket, roomId, userId, () => socket.emit('join room success'));
      } else {
        socket.emit('join room error', `Room '${pathUrl}' was not found`);
      }
    });

    socket.on('lecture start', (roomId) => {
      if (socket.roomId) {
        io.in(socket.roomId).emit('lecture started');
      } else {
        socket.emit('lecture start error', 'You do not belong to a room');
      }
    });

    socket.on('lecture end', (roomId) => {
      if (socket.roomId) {
        io.in(socket.roomId).emit('lecture ended');
      } else {
        socket.emit('lecture end error', 'You do not belong to a room');
      }
    });

    socket.on('new note', (note) => {
      if (note) {

        /* redis ==> add note to "userId:roomId" List of notes*/
        // note = { userId, content, roomId, timeStamp }
        // userId:roomId
        // save notes into redis
      }
    });

    //socket.on('disconnect', () => console.log('a user disconnected'));
  });
  return io;
};
