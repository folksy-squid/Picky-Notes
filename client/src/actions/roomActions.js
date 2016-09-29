/*jshint esversion: 6 */

export function createRoom (data) {
  return {
    type: 'CREATE_ROOM',
    data
  };
}
