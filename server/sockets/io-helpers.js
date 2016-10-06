// require Redis
const {addUserToCache, addNoteToCache, getNotesFromRoom, deleteAllNotesAndRoom, addTimestampToCache, getUsersFromRoom, getNotesFromUser} = require('../cache/cache-helpers');
const {findRoom, createRoomNotes, saveStartTimestamp, saveTimeLength} = require('../database/db-helpers');

const joinRoom = (socket, pathUrl, user, cb) => {
  socket.pathUrl = pathUrl;
  socket.user = user;
  socket.ready = false;
  socket.join(pathUrl);
  /* redis ==> add userId to "pathUrl" Set */
  addUserToCache(pathUrl, user.id);
  cb(user);
};

const addNote = (socket, note, cb) => {
  const pathUrl = socket.pathUrl;
  const userId = socket.user.id;

  /* redis ==> add note to "userId:pathUrl" List of notes*/
  // note = { userId, content, pathUrl, timeStamp }
  addNoteToCache(pathUrl, userId, note, cb);
};

const isAllReady = (pathUrl, rooms, connected) => {
  if (!rooms[pathUrl]) { return true; }
  for (var socketId in rooms[pathUrl].sockets) {
    if (connected[socketId].ready === false) {
      return false;
    }
  }
  return true;
};

const saveAllNotes = (pathUrl, cb) => {
  // get roomId
  findRoom(pathUrl, (room) => {
    if (room) {
      getNotesFromRoom(pathUrl, (allNotes) => {
        // save all notes with roomId into database;
        if (allNotes.length === 0) { return cb(); }
        getUsersFromRoom(pathUrl)
        .then((arrOfClients) => {
          createRoomNotes(allNotes, room.id, arrOfClients, () => {
            cb();
            deleteAllNotesAndRoom(pathUrl);
          });
        });
      });
    } else {
      // socket.emit('create notes error', 'notes error');
    }
  });
};

const saveStartTime = (pathUrl, startTime) => {
  addTimestampToCache(pathUrl, startTime);
  saveStartTimestamp(pathUrl, startTime);
};

const saveLectureTimeLength = (pathUrl, endTime) => {
  saveTimeLength(pathUrl, endTime);
};

const uploadAudio = () => {

};

const getUserNotes = (pathUrl, userId, cb) => {
  getNotesFromUser(pathUrl, userId, cb);
};

module.exports = {
  joinRoom,
  addNote,
  isAllReady,
  saveAllNotes,
  saveStartTime,
  saveLectureTimeLength,
  uploadAudio,
  getUserNotes,
};
