// require Redis
const {addUserToCacheRoom} = require('../cache/cache-helpers');

const joinRoom = (socket, pathUrl, userId, cb) => {
  socket.pathUrl = pathUrl;
  socket.userId = userId;
  socket.join(pathUrl);
  /* redis ==> add userId to "pathUrl" Set */
  addUserToCacheRoom(pathUrl, userId, () => console.log('added user to cache room'));
  cb();
};

module.exports = {
  joinRoom
};
