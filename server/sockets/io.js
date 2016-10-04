/*jshint esversion: 6 */
const {joinRoom, addNote, isAllReady, saveAllNotes, saveStartTime} = require('./io-helpers');
const {findRoom} = require('../database/db-helpers');

module.exports = (listen) => {
  const io = require('socket.io').listen(listen);
  const ss = require('socket.io-stream');
  const wav = require('wav');

  const rooms = io.sockets.adapter.rooms;
  const connected = io.sockets.connected;

  io.on('connection', (socket) => {

    var getClientNames = (roomId, cb) => {
      var result = [];
      var roomIds = rooms[roomId].sockets;
      if (roomIds) {
        for (var id in roomIds) {
          var sockets = io.sockets;
          socketUser = connected[id].user;
          result.push(socketUser);
        }
      }
      return cb(result);
    };

    const createFile = () => {
      const outFile = `audio/${socket.pathUrl}.wav`;
      return new wav.FileWriter(outFile, {
        channels: 1,
        sampleRate: 48000,
        bitDepth: 16
      });
    };

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
                socket.emit('join room success', participants, found.dataValues);
              });
            });
            io.in(socket.pathUrl).emit('new user joined room', user);
          }
        });
        return;
      } else {
        socket.emit('join room error', `Room '${pathUrl}' was not found`);
      }
    });

    socket.on('sending message', (user, message) => {
      console.log('socket.pathUrl', socket.pathUrl);
      if (socket.pathUrl) {
        io.in(socket.pathUrl).emit('message received');
      } else {
        socket.emit('sending message error', 'You are not connected to a room');
      }
    });

    socket.on('lecture start', () => {
      if (socket.pathUrl) {
        saveStartTime(socket.pathUrl, Date.now());
        io.in(socket.pathUrl).emit('lecture started');
      } else {
        socket.emit('lecture start error', 'You do not belong to a room');
      }
    });

    socket.on('lecture end', () => {
      if (socket.pathUrl) {
        io.in(socket.pathUrl).emit('lecture ended');
      } else {
        socket.emit('lecture end error', 'You do not belong to a room');
      }
    });

    socket.on('user ready', () => {
      socket.ready = true;
      io.in(socket.pathUrl).emit('user ready', socket.user);
      if (isAllReady(socket.pathUrl, rooms, connected)) {
        io.in(socket.pathUrl).emit('all ready');
        getClientNames(socket.pathUrl, (arrOfClients) => {
          saveAllNotes(socket.pathUrl, arrOfClients, () => {
            io.in(socket.pathUrl).emit('all notes saved');
          });
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

    // Audio Streaming to Server
    ss(socket).on('start stream', (stream) => {
      const fileWriter = createFile();
      console.log('inside stream');
      stream.pipe(fileWriter);

      ss(socket).on('end', function() {
        console.log('ending stream');
        fileWriter.end();
        console.log('wrote to file ' + outFile);
      });
    });
  });
  return io;
};
