/*jshint esversion: 6 */

export function createRoom (data, cb) {
  console.log('called createRoom');
  return {
    type: 'CREATE_ROOM',
    data,
    cb
  };
}

export function joinSocketRoom (pathUrl, userId, cb) {
  return {
    type: 'JOIN_SOCKET_ROOM',
    pathUrl,
    userId,
    cb
  };
}
