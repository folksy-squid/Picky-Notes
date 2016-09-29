/*jshint esversion: 6 */

export function createRoom (data) {
  return {
    type: 'CREATE_ROOM',
    data
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
