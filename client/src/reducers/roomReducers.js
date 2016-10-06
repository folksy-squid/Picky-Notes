/*jshint esversion: 6 */
// need to import socket streams
import ss from 'socket.io-stream';

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

const convertoFloat32ToInt16 = buffer => {
  var l = buffer.length;
  var buf = new Int16Array(l);

  while (l--) {
    buf[l] = buffer[l] * 0xFFFF;    //convert to 16 bit
  }
  return buf.buffer;
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
      url: `/api/rooms/${action.pathUrl}`,
      contentType: 'application/json',
      data: JSON.stringify({userId: action.user.id}),
      success: (response) => {
        var socket = io();
        socket.emit('join room', action.pathUrl, action.user);
        socket.on('join room error', () => {
          socket.disconnect();
          state.socket = null;
          action.joinedRoom('join room error');
        });
        socket.on('join room success', (participants, roomInfo) => {
          state.socket = socket;
          state.roomInfo = roomInfo;
          state.participants = participants;
          action.joinedRoom(null, 'success', roomInfo, participants);
        });
      }
    });
  }

  const findUser = (list, user) => list.findIndex( obj => obj.id === user.id);

  if (action.type === 'LEAVE_SOCKET_ROOM') {
    state.socket.disconnect();
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
    state.participants[findUser(state.participants, action.participant)].readyStatus = true;
    return {
      ...state,
      participants: state.participants
    };
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

  if (action.type === 'CREATE_STREAM_TO_SERVER') {
    // initiate audio stream
    state.stream = ss.createStream();
    ss(state.socket).emit('start stream', state.stream);
    state.recording = false;

    const audioSuccess = e => {
      const audioContext = window.AudioContext || window.webkitAudioContext;
      const context = new audioContext();

      // the sample rate is in context.sampleRate
      const audioInput = context.createMediaStreamSource(e);

      var bufferSize = 2048;
      const recorder = context.createScriptProcessor(bufferSize, 1, 1);

      recorder.onaudioprocess = e => {
        if (!state.recording) { return; }
        var left = e.inputBuffer.getChannelData(0);
        state.stream.write(new ss.Buffer(convertoFloat32ToInt16(left)));
      };

      audioInput.connect(recorder);
      recorder.connect(context.destination);
    };

    if (!navigator.getUserMedia) {
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia || navigator.msGetUserMedia;
    }
    if (navigator.getUserMedia) {
      navigator.getUserMedia({ audio: true }, audioSuccess, e => console.log('Error capturing audio.'));
    } else {
      console.log('getUserMedia not supported in this browser.');
    }
  }

  if (action.type === 'START_RECORDING') {
    state.recording = true;
  }

  if (action.type === 'STOP_RECORDING') {
    state.recording = false;
    ss(state.socket).emit('stop stream');
  }
  if (action.type === 'GET_AUDIO_FROM_ROOM') {
    $.ajax({
      method: 'GET',
      url: `/api/audio/${action.pathUrl}`,
      success: (response) => {
        state.roomInfo.audioUrl = response;
        action.cb();
      }
    });
  }

  return state;
};
