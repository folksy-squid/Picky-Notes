export default (state = [], action) => {
  if (action.type === 'SUBMIT_NOTE') {
    action.socket.emit('new note', {content: action.content});
  }

  if (action.type === 'ADD_NOTE') {
    console.log(state);
    state.push(action.note);
    console.log(state)
  }

  if (action.type === 'EDIT_NOTE') {
  }

  return state;
};