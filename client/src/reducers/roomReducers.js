/*jshint esversion: 6 */
const createSocketRoom = (hostId, pathUrl, cb) => {
  // this is if server is localhost
  var socket = io();
  // if server is not localhost,
  // then set up io to know where the server is
  socket.emit('create room', pathUrl, hostId);
  socket.on('create room success', function(){
    console.log('successfully created socket room');
    cb(null, pathUrl);
    return socket;
  });
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
        return {
          ...state,
          socket: createSocketRoom(action.data.hostId, res.pathUrl, action.cb),
          roomInfo: res
        }
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
    socket.emit('join room', action.pathUrl, action.userId);

    socket.on('join room error', () => {
      socket.disconnect();
      state.socket = null;
      action.cb('error');
    });

    socket.on('join room success', () => {
      state.socket = socket;
      action.cb(null, 'success');
    });
  }

  if (action.type === 'LEAVE_SOCKET_ROOM'){
    state.socket.disconnect();
    state.socket = null;
  }


  return state;
};
