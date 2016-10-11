/*jshint esversion: 6 */
// need to import socket streams
import ss from 'socket.io-stream';

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
    console.log('successfully created socket room');
    createRoom(pathUrl);
  });
  return socket;
};

let audioStream;

const convertoFloat32ToInt16 = buffer => {
  let l = buffer.length;
  let buf = new Int16Array(l);

  while (l--) {
    buf[l] = buffer[l] * (0xFFFF - 0.5) + 0.5;    //convert to 16 bit
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
      url: `/api/users/${action.user.id}?pathUrl=${action.pathUrl}`,
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

  if (action.type === 'CREATE_STREAM_TO_SERVER') {
    // initiate audio stream
    state.stream = ss.createStream();
    // connect socket.io stream to server-side
    ss(state.socket).emit('start stream', state.stream);
    // initalize recording state
    state.recording = false;

    // on success of grabbing audio from browser...
    const audioSuccess = e => {
      const audioContext = window.AudioContext || window.webkitAudioContext;
      const context = new audioContext();
      // const lowPassfilter = context.createBiquadFilter();
      //   lowPassfilter.Q.value = 10;
      //   lowPassfilter.frequency.value = 100;
      //   lowPassfilter.type = 'lowpass';

      // const compressor = context.createDynamicsCompressor();
      //   compressor.ratio.value = 12;
      //   compressor.attack.value = 0;
      //   compressor.release.value = 0.5;
      // assign current audioStream to stop later
      audioStream = e;

      // the sample rate is in context.sampleRate
      const audioInput = context.createMediaStreamSource(e);

      var bufferSize = 16384;
      const recorder = context.createScriptProcessor(bufferSize, 1, 1);

      // when processing audio during recording
      recorder.onaudioprocess = e => {
        // if currently not in recording state, return
        if (!state.recording) { return; }
        // if currently recording, send audio through socket.io stream to server
        var left = e.inputBuffer.getChannelData(0);
        state.stream.write(new ss.Buffer(convertoFloat32ToInt16(left)));
      };

      // connections
      audioInput.connect(recorder);
      // compressor.connect(recorder);
      // highPassfilter.connect(lowPassfilter);
      // highPassfilter.connect(recorder);
      recorder.connect(context.destination);
      action.cb && action.cb();
    };


    // grab User Media depending on client-side browser
    if (!navigator.getUserMedia) {
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia || navigator.msGetUserMedia;
    }
    // error if unable to grab User Media from browser
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
    audioStream.getTracks()[0].stop();
    state.stream.end();
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
