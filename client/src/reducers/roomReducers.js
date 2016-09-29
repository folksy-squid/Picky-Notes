/*jshint esversion: 6 */
const createSocketRoom = (host, pathUrl, createRoom) => {
  // this is if server is localhost
  var socket = io();
  // if server is not localhost,
  // then set up io to know where the server is
  socket.emit('create room', pathUrl, host);
  socket.on('create room success', function(){
    console.log('successfully created socket room');
    createRoom(pathUrl);
  });
  console.log(socket);
  return socket;
};




export default (state = {}, action) => {
  if (action.type === 'CREATE_ROOM') {
    // ajax call passing in action.data and then setting state in the success
    $.ajax({
      method: 'POST',
      url: '/api/rooms',
      contentType: 'application/json',
      data: JSON.stringify(action.data),
      success: function(res, status){
        console.log('the response: ', res);
        state.socket = createSocketRoom(action.user, res.pathUrl, action.createRoom);
        state.roomInfo = res;
      },
      error: function( res, status ) {
        console.log(res);
      }
    });
  }

  if (action.type === 'LEAVE_SOCKET_ROOM'){
    state.socket.disconnect();
    state.socket = null;
  }

  if (action.type === 'JOIN_SOCKET_ROOM'){
    var socket = io();
    socket.emit('join room', action.pathUrl, action.user);

    socket.on('join room error', () => {
      console.log('we have failed to join a room');
      socket.disconnect();
      state.socket = null;
      action.cb('error');
    });

    socket.on('join room success', (name) => {
      console.log(`${name} has successfully joined a room`);
      state.socket = socket;
      action.joinedRoom(null, 'success');

      // get the users from the socket and save it to our store
    });
  }

  if (action.type === 'LEAVE_SOCKET_ROOM'){
    state.socket.disconnect();
    state.socket = null;
  }

  return state;
};
