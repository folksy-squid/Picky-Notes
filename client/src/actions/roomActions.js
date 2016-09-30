/*jshint esversion: 6 */
export const createRoom = (data, user, createRoom) => {
  // console.log('called createRoom');
  return {
    type: 'CREATE_ROOM',
    data,
    user,
    createRoom
  };
};

export const joinSocketRoom = (pathUrl, user, joinedRoom) => {
  return {
    type: 'JOIN_SOCKET_ROOM',
    pathUrl,
    user,
    joinedRoom
  };
};

export const addParticipant = (participant) => {
  return {
    type: 'ADD_PARTICIPANT',
    participant
  };
};

export const removeParticipant = (participant) => {
  return {
    type: 'REMOVE_PARTICIPANT',
    participant
  };
};
