/*jshint esversion: 6 */

export function createRoom (data, user, createRoom) {
  console.log('called createRoom');
  return {
    type: 'CREATE_ROOM',
    data,
    user,
    createRoom
  };
}

export function joinSocketRoom (pathUrl, user, joinedRoom) {
  return {
    type: 'JOIN_SOCKET_ROOM',
    pathUrl,
    user,
    joinedRoom
  };
}

export function addParticipant(participant) {
  return {
    type: 'ADD_PARTICIPANT',
    participant
  };
}
