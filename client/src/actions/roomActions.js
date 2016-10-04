/*jshint esversion: 6 */
export const createRoom = (data, user, createRoom) => ({
  type: 'CREATE_ROOM',
  data,
  user,
  createRoom
});

export const joinSocketRoom = (pathUrl, user, joinedRoom) => ({
  type: 'JOIN_SOCKET_ROOM',
  pathUrl,
  user,
  joinedRoom
});

export const addParticipant = (participant) => ({
  type: 'ADD_PARTICIPANT',
  participant
});

export const removeParticipant = (participant) => ({
  type: 'REMOVE_PARTICIPANT',
  participant
});

export const readyParticipant = (participant) => ({
  type: 'READY_PARTICIPANT',
  participant
});

export const setRoomInfo = (pathUrl, user, cb) => ({
  type: 'SET_ROOM_INFO',
  pathUrl,
  user,
  cb
});

export const createAudioStream = (cb) => ({
  type: 'CREATE_STREAM_TO_SERVER',
  cb
});

export const startRecording = (cb) => ({
  type: 'START_RECORDING',
  cb
});

export const stopRecording = (cb) => ({
  type: 'STOP_RECORDING',
  cb
});
