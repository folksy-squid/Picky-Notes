// require Redis
const {addUserToCache, addNoteToCache} = require('../cache/cache-helpers');

const joinRoom = (socket, pathUrl, userId, cb) => {
  socket.pathUrl = pathUrl;
  socket.userId = userId;
  socket.ready = false;
  socket.join(pathUrl);
  /* redis ==> add userId to "pathUrl" Set */
  // addUserToCache(pathUrl, userId, () => console.log('added user to cache'));
  addUserToCache(pathUrl, userId);
  cb();
};

const addNote = (socket, note, cb) => {
  const pathUrl = socket.pathUrl;
  const userId = socket.userId;

  /* redis ==> add note to "userId:pathUrl" List of notes*/
  // note = { userId, content, pathUrl, timeStamp }
  // addNoteToCache(pathUrl, userId, note, () => console.log('added note to cache'));
  addNoteToCache(pathUrl, userId, note, cb);
};

module.exports = {
  joinRoom,
  addNote
};
