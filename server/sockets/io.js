const {joinRoom, addNote, isAllReady, saveAllNotes} = require('./io-helpers');
const {findRoom} = require('../database/db-helpers');

module.exports = (listen) => {
  const io = require('socket.io').listen(listen);
  const rooms = io.sockets.adapter.rooms;
  const connected = io.sockets.connected;

  io.on('connection', (socket) => {
    var getClientNames = (roomId, cb) => {
      var res = [];
      var roomIds = rooms[roomId].sockets;
      console.log('room ids', roomIds);
      if (roomIds) {
        for (var id in roomIds) {
          var sockets = io.sockets;
          console.log('id', id);
          console.log('sockets', sockets);
          socketUser = connected[id].user;
          console.log('socketuser!!!:', socketUser);
          res.push(socketUser);
        }
        console.log('res!!!::', res);
      }
      cb(res);
      return;
    };

      //console.log('a user connected');
    //console.log('a user connected');

    socket.on('create room', (pathUrl, user) => {
      // verify if pathUrl and userId are valid
      if (pathUrl.length === 5 && user) {
        // verify if room at pathUrl exists in database
        findRoom(pathUrl, (found) => {
          if (found) {
            joinRoom(socket, pathUrl, user, (user) => socket.emit('create room success', user.name));
          } else {
            socket.emit('create room error', `Room '${pathUrl}' not found`);
          }
        });
      } else {
        socket.emit('create room error', `Room '${pathUrl}' is invalid`);
      }
    });

    socket.on('join room', (pathUrl, user) => {
      // verify if pathUrl and userId are valid and if room at pathUrl exists
      if (pathUrl.length === 5 && user && rooms[pathUrl]) {
        joinRoom(socket, pathUrl, user, (user) => {
          if (socket.pathUrl) {
            findRoom(socket.pathUrl, (found) => {
              getClientNames(socket.pathUrl, (participants) => {
                console.log('these are participants', participants);
                socket.emit('join room success', participants, found.dataValues);
              });
            })
            io.in(socket.pathUrl).emit('new user joined room', user);
          }
        });
        return;
      } else {
        socket.emit('join room error', `Room '${pathUrl}' was not found`);
      }
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

    socket.on('user ready', () => {
      socket.ready = true;
      io.in(socket.pathUrl).emit('user ready', socket.userId);
      if (isAllReady(socket.pathUrl, rooms, connected)) {
        io.in(socket.pathUrl).emit('all ready');
        saveAllNotes(socket.pathUrl, () => {
          io.in(socket.pathUrl).emit('all notes saved');
        });
      }
    });

    socket.on('new note', (note) => {
      if (note) {
        addNote(socket, note, (result) => socket.emit('add note success', result));
        return;
      }
      socket.emit('add note error', 'Note does not exist you asshat');
    });

    socket.on('disconnect', () => {
      io.in(socket.pathUrl).emit('user disconnected', socket.user);
    });
    //socket.on('disconnect', () => console.log('a user disconnected'));
  });
  return io;
};
