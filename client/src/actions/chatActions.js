/*jshint esversion: 6 */
export const sendMessage = (socket, user, message) => ({
  type: 'SEND_MESSAGE',
  socket,
  user,
  message
});