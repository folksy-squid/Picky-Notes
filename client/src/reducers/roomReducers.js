/*jshint esversion: 6 */

export default (state = {}, action) => {

  if (action.type === 'CREATE_ROOM'){
    // ajax call passing in action.data and then setting state in the success
    console.log(action.data);
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
    console.log('data:', action.data);
  }

  var createSocketRoom = (hostId, pathUrl) => {
    var socket = io();
    socket.emit('create room', pathUrl, hostId);
    return socket;
  };

  if (action.type === 'JOIN_SOCKET_ROOM'){

  }

  if (action.type === 'DELETE_SOCKET_ROOM'){

  }


  return state;
};
