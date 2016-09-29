/*jshint esversion: 6 */

export default (state = {}, action) => {

  if (action.type === 'CREATE_ROOM'){
    // ajax call passing in action.data and then setting state in the success
    $.ajax({
      method: 'POST',
      url: '/api/rooms',
      data: action.data,
      success: function(res, status){
        console.log('the response: ', res);
        state.socket = createSocketRoom(action.data.hostId, res.pathUrl);
        state.roomInfo = res;
      },
      error: function( res, status ){
        console.log(res);
      }
    });
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

const createSocketRoom = (hostId, pathUrl) => {
  // this is if server is localhost
  var socket = io();
  // if server is not localhost,
  // then set up io to know where the server is
  socket.emit('create room', pathUrl, hostId);
  socket.on('create room success', function(){
    console.log('successfully created socket room');
    return socket;
  });
};
