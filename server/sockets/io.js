/*jshint esversion: 6 */
const {joinRoom, addNote, isAllReady, saveAllNotes, saveStartTime, saveLectureTimeLength, uploadAudio, getUserNotes, getTimestampFromRoom} = require('./io-helpers');
const {findRoom, saveAudioToRoom} = require('../database/db-helpers');
const {startUploading, endUploading} = require('../config/audioUpload.js');
const lame = require('lame');
const fs = require('fs');

module.exports = (listen) => {
  const io = require('socket.io').listen(listen);
  const ss = require('socket.io-stream');

  const rooms = io.sockets.adapter.rooms;
  const connected = io.sockets.connected;

  io.on('connection', (socket) => {

    const getClientNames = (roomId, cb) => {
      let result = [];
      const roomIds = rooms[roomId].sockets;
      if (roomIds) {
        for (let id in roomIds) {
          let sockets = io.sockets;
          socketUser = connected[id].user;
          result.push(socketUser);
        }
      }
      return cb(result);
    };

    const endLecture = () => {
      if (socket.pathUrl) {
        saveLectureTimeLength(socket.pathUrl, Date.now());
        io.in(socket.pathUrl).emit('lecture ended');
      } else {
        socket.emit('lecture end error', 'You do not belong to a room');
      }
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
                getTimestampFromRoom(socket.pathUrl, (started) => {
                  const status = (started) ? 'lecture' : 'lobby';
                  socket.emit('join room success', participants, found.dataValues, status);
                });
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
      if (socket.pathUrl) {
        io.in(socket.pathUrl).emit('message received', user, message);
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

    socket.on('lecture end', endLecture);

    socket.on('user ready', () => {
      const pathUrl = socket.pathUrl;
      const socketIds = Object.keys(rooms[pathUrl].sockets);
      socketIds.forEach(socketId => {
        if (socket.user.id === connected[socketId].user.id) {
          connected[socketId].ready = true;
        }
      });

      io.in(pathUrl).emit('user ready', socket.user);
      if (isAllReady(pathUrl, rooms, connected)) {
        io.in(pathUrl).emit('all ready');
        saveAllNotes(pathUrl, () => {
          io.in(pathUrl).emit('all notes saved');
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

    socket.on('user reconnect', () => {
      getUserNotes(socket.pathUrl, socket.user.id, (notes) => {
        notes.length && socket.emit('old notes', notes);
      });
    });

    socket.on('lecture host', () => {
      socket.host = true;
    });

    socket.on('disconnect', () => {
      if (socket.host) {
        console.log('lecture host disconnected');
        io.in(socket.pathUrl).emit('host disconnected');
        endLecture();
      }
      io.in(socket.pathUrl).emit('user disconnected', socket.user);
      if (isAllReady(socket.pathUrl, rooms, connected)) {
        io.in(socket.pathUrl).emit('all ready');
        saveAllNotes(socket.pathUrl, () => {
          io.in(socket.pathUrl).emit('all notes saved');
        });
      }
    });

    // Audio Streaming to Server
    ss(socket).on('start stream', (stream) => {

      // define pathUrl, filePath of mp3, and create write stream
      const pathUrl = socket.pathUrl;
      const filePath = `audio/${pathUrl}.mp3`;
      const outputFile = fs.createWriteStream(filePath);

      // define mp3 LAME encoder properties
      const encoder = new lame.Encoder({ channels: 1, bitDepth: 16 });
      console.log('inside stream');

      const uploadToAWS = () => {
        var count = 0;
        let endStreamCB = (err, data) => {
          if (err) {
            console.log('error in uploading stream, retrying.', err);
            if (count < 5) {
              count++;
              return startUploading(filePath, pathUrl, endStreamCB);
            }
            console.log('Error persisted. Stop trying to upload again.', err);
          } else {
            saveAudioToRoom(pathUrl, data.Location, () => {
              console.log('saved audioUrl to database');
              fs.unlink(filePath, () => {
                console.log('successfully deleted audio from filesystem');
              });
            });
          }
        };

        encoder.end(null, null, startUploading(filePath, pathUrl, endStreamCB));
      };

      // pipe from stream, through encoder, to the outputFile
      stream.pipe(encoder).pipe(outputFile);

      // when stream has ended, attempt to upload to S3
      stream.on('end', uploadToAWS);

      // when stream ends unexpectedly, attempt to upload to S3
      stream.on('close', uploadToAWS);

    });
  });
  return io;
};
