// require Redis


const createRoom = () => {
  console.log('inside createRoom');
  // add room to Redis (activeRooms)
};

const joinRoom = (socket, pathUrl, userId, cb) => {
  socket.pathUrl = pathUrl;
  socket.userId = userId;
  socket.join(pathUrl);
  /* redis ==> add userId to "pathUrl" Set */
  cb();
};

module.exports = {
  createRoom,
  joinRoom
};
