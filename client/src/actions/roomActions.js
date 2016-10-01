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
