/*jshint esversion: 6 */
const createSocketRoom = (state, host, pathUrl, createRoom) => {
  // this is if server is localhost
  var socket = io();
  // if server is not localhost,
  // then set up io to know where the server is
  socket.emit('create room', pathUrl, host);
  socket.on('create room success', () => {
    console.log('successfully created socket room');
    createRoom(pathUrl);
  });
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
      success: (res, status) => {
        $.ajax({
          method: 'POST',
          url: `/api/rooms/${res.pathUrl}`,
          contentType: 'application/json',
          data: JSON.stringify({userId: action.user.id})
        });
        console.log('the response: ', res);
        state.participants = [action.user];
        state.socket = createSocketRoom(state, action.user, res.pathUrl, action.createRoom);
        state.roomInfo = res;
      },
      error: function( res, status ) {
        console.log(res);
      }
    });
  }

  if (action.type === 'JOIN_SOCKET_ROOM') {
    $.ajax({
      method: 'POST',
      url: `/api/rooms/${res.pathUrl}`,
      data: {userId: action.user.id}
    });
    var socket = io();
    console.log('joining room');
    socket.emit('join room', action.pathUrl, action.user);
    socket.on('join room error', () => {
      socket.disconnect();
      state.socket = null;
      action.joinedRoom('join room error');
    });

    socket.on('join room success', (participants, roomInfo) => {
      console.log('join room success');
      state.socket = socket;
      state.roomInfo = roomInfo;
      state.participants = participants;
      action.joinedRoom(null, 'success', roomInfo);
    });
  }

  const findUser = (list, user) => list.findIndex( obj => obj.id === user.id);

  if (action.type === 'LEAVE_SOCKET_ROOM') {
    state.socket.disconnect();
    state.socket = null;
  }

  if (action.type === 'ADD_PARTICIPANT') {
    state.participants.push(action.participant);
  }

  if (action.type === 'REMOVE_PARTICIPANT') {
    var index = findUser(state.participants, action.participant);
    if (index !== -1) { state.participants.splice(index, 1); }
  }

  if (action.type === 'READY_PARTICIPANT') {
    state.participants[findUser(state.participants, action.participant)].readyStatus = true;
  }
  if (action.type === 'SET_ROOM_INFO') {
    $.ajax({
      method: 'GET',
      url: `/api/users/${action.user.id}?pathUrl=${action.pathUrl}`,
      success: (res) => {
        if (res === 'error') {
          action.cb(res);
        } else {
          state.roomInfo = res;
          action.cb(null, res);
        }
      }
    });
  }
  return state;
};
