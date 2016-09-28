const joinRoom = (socket, roomId, userId, cb) => {
  socket.roomId = roomId;
  socket.userId = userId;
  socket.join(roomId);
  /* redis ==> add userId to "roomId" Set */
  cb();
};

module.exports = {
  joinRoom
};
