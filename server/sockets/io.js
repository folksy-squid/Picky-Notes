module.exports = (listen) => {
  const io = require('socket.io').listen(listen);
  const rooms = io.sockets.adapter.rooms;

  io.on('connection', (socket) => {
    //console.log('a user connected');

    socket.on('join room', (room) => {
      if (room && room.length === 5 && rooms[room]) {
        socket.room = room;
        socket.emit('join room success');
        socket.join(room);
        // console.log(socket.id);
        // console.log(socket.adapter.rooms);
        // console.log(io.sockets.adapter.rooms[room]);
        // io.in(room).emit('user joined', room);
      } else {
        socket.emit('join room error', `Room '${room}' was not found`);
      }
    });

    socket.on('create room', (room) => {
      if (room && room.length === 5) {
        socket.room = room;
        socket.emit('create room success');
        socket.join(room);
      } else {
        socket.emit('create room error', `Room '${room}' is invalid`);
      }
    });

    socket.on('lecture start', (room) => {
      if (socket.room) {
        io.in(socket.room).emit('lecture started');
      } else {
        socket.emit('lecture start error', 'You do not belong to a room');
      }
    });

    socket.on('lecture end', (room) => {
      if (socket.room) {
        io.in(socket.room).emit('lecture ended');
      } else {
        socket.emit('lecture end error', 'You do not belong to a room');
      }
    });

    socket.on('new note', (note) => {
      if (note) {
        // save notes into redis
      }
    });

    //socket.on('disconnect', () => console.log('a user disconnected'));
  });
  return io;
};