/*jshint esversion: 6 */
const {joinRoom, addNote, isAllReady, saveAllNotes, saveStartTime, saveLectureTimeLength, uploadAudio, getUserNotes, getTimestampFromRoom} = require('./io-helpers');
const {findRoom, saveAudioToRoom} = require('../database/db-helpers');
const {startUploading, endUploading} = require('../config/audioUpload.js');
const fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');

module.exports = (listen) => {
  const io = require('socket.io').listen(listen);

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

    socket.on('upload stream', largeChunk => {
      const pathUrl = socket.pathUrl;
      const filePath = `audio/${pathUrl}.webm`;

      fs.appendFile(filePath, Buffer.concat(largeChunk), err => {
        if (err) { return console.log(err); }
        console.log('append file success!');
      });
    });

    socket.on('stop stream', lastChunk => {
      console.log('saving and formatting to mp3');
      const pathUrl = socket.pathUrl;
      const originalFile = `audio/${pathUrl}.webm`;
      const outputFile = `audio/${pathUrl}.mp3`;

      const uploadToAWS = () => {
        var count = 0;
        let endStreamCB = (err, data) => {
          if (err) {
            console.log('error in uploading stream, retrying.', err);
            if (count < 5) {
              count++;
              return startUploading(outputFile, pathUrl, endStreamCB);
            }
            console.log('Error persisted. Stop trying to upload again.', err);
          } else {
            saveAudioToRoom(pathUrl, data.Location, () => {
              fs.unlink(outputFile, () => {
                console.log('successfully deleted .mp3 audio from filesystem');
              });
            });
          }
        };
        startUploading(outputFile, pathUrl, endStreamCB);
      };

      fs.appendFile(originalFile, Buffer.concat(lastChunk), err => {
        if (err) { return console.log(err); }
        console.log('write file success!');

        ffmpeg(fs.createReadStream(originalFile)).format('mp3')
        .output(outputFile)
        .on('end', () => {
          console.log('formatting finished!');
          uploadToAWS();
          fs.unlink(originalFile, () => {
            console.log('successfully deleted original audio file from filesystem');
          });
        })
        .on('error', err => {
          console.log(err);
        })
        .run();

      });
    });

  });

  return io;
};
