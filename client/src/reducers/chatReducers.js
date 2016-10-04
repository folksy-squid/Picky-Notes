/*jshint esversion: 6 */

export default (state = {}, action) => {

  if (action.type === 'SEND_MESSAGE') {
    let user = action.user;
    let socket = action.socket;
    let message = action.message;

    socket.emit('message sent', user, message);
  }

  return state;
};
