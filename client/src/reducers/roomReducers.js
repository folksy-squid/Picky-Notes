/*jshint esversion: 6 */

/*
  ==========================================
    mediaDevices.getUserMedia Polyfill
  ==========================================
*/
var promisifiedOldGUM = function(constraints) {

  // First get ahold of getUserMedia, if present
  var getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

  // Some browsers just don't implement it - return a rejected promise with an error
  // to keep a consistent interface
  if (!getUserMedia) {
    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
  }

  // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
  return new Promise(function(resolve, reject) {
    getUserMedia.call(navigator, constraints, resolve, reject);
  });

};

// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
}

const constraints = { audio: true };
let largeChunk = [];
let interval = null;

const createSocketRoom = (state, host, pathUrl, createRoom) => {
  if (state.socket) {
    state.socket.disconnect();
    state.socket = null;
  }
  // this is if server is localhost
  var socket = io();
  // if server is not localhost,
  // then set up io to know where the server is
  socket.emit('create room', pathUrl, host);
  socket.on('create room success', () => {
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
          url: `/api/rooms?pathUrl=${res.pathUrl}`,
          contentType: 'application/json',
          data: JSON.stringify({userId: action.user.id}),
          success: (response) => {
            state.participants = [action.user];
            state.socket = createSocketRoom(state, action.user, res.pathUrl, action.createRoom);
            state.roomInfo = res;
          }
        });
      },
      error: function( res, status ) {
        console.log(res);
      }
    });
  }

  if (action.type === 'JOIN_SOCKET_ROOM') {
    $.ajax({
      method: 'POST',
      url: `/api/rooms?pathUrl=${action.pathUrl}`,
      contentType: 'application/json',
      data: JSON.stringify({userId: action.user.id}),
      success: (response) => {
        if (state.socket) {
          state.socket.disconnect();
          state.socket = null;
        }
        var socket = io();
        socket.emit('join room', action.pathUrl, action.user);
        socket.on('join room error', () => {
          socket.disconnect();
          state.socket = null;
          action.joinedRoom('Room was not found');
        });
        socket.on('join room success', (participants, roomInfo, status) => {
          state.socket = socket;
          state.roomInfo = roomInfo;
          state.participants = participants;
          action.joinedRoom(null, 'success', roomInfo, participants, status);
        });
      }
    });
  }

  const findUser = (list, user) => list.findIndex( obj => obj.id === user.id);

  if (action.type === 'LEAVE_SOCKET_ROOM') {
    state.socket && state.socket.disconnect();
    return {
      ...state,
      socket: null
    };
  }

  if (action.type === 'ADD_PARTICIPANT') {
    return {
      ...state,
      participants: state.participants.concat([action.participant])
    };
  }

  if (action.type === 'REMOVE_PARTICIPANT') {
    var index = findUser(state.participants, action.participant);
    if (index !== -1) { state.participants.splice(index, 1); }
    return {
      ...state,
      participants: state.participants
    };
  }

  if (action.type === 'READY_PARTICIPANT') {
    const userId = action.participant.id;
    state.participants.forEach((participant) => {
      if (userId === participant.id) {
        participant.readyStatus = true;
      }
    });
    return {
      ...state,
    };
  }

  if (action.type === 'SET_ROOM_INFO') {
    $.ajax({
      method: 'GET',
      url: `/api/rooms?userId=${action.user.id}&pathUrl=${action.pathUrl}`,
      success: (res) => {
        if (res === 'error') {
          action.cb(res);
        } else {
          state.roomInfo = res.roomInfo;
          state.participants = res.participants;
          action.cb(null, res);
        }
      }
    });
  }

  if (action.type === 'START_RECORDING') {

    // create audio stream from microphone
    navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {

      // record audio stream with MediaRecorder
      state.mediaRecorder = new MediaRecorder(stream);
      state.mediaRecorder.start();

      // push blobs/data into largeChunk
      state.mediaRecorder.ondataavailable = function(e) {
        largeChunk.push(e.data);
      };

      // Send largeChunks of data to the server through socket
      interval = setInterval(() => {
        state.socket.emit('upload stream', largeChunk);
        largeChunk = [];
      }, 10000);


      // When recording stops, stop the interval and
      // send the last chunk of data
      state.mediaRecorder.onstop = function(e) {
        clearInterval(interval);
        interval = null;

        state.socket.emit('stop stream', largeChunk);
        largeChunk = [];
      };

    })
    .catch(error => {
      console.log(error);
    });

  }

  if (action.type === 'STOP_RECORDING') {
    if (!state.mediaRecorder) { return; }
    state.mediaRecorder.stop();
    state.mediaRecorder.stream.getTracks()[0].stop();
    state.mediaRecorder = null;
  }

  if (action.type === 'GET_AUDIO_FROM_ROOM') {
    $.ajax({
      method: 'GET',
      url: `/api/audio/${action.pathUrl}`,
      success: (response) => {
        if (response === 'audio url') {
          action.cb(response);
        } else {
          state.roomInfo.audioUrl = response;
          action.cb(null, response);
        }
      }
    });
  }

  return state;
};
