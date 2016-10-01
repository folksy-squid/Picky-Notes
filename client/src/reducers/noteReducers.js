export default (state = [], action) => {
  if (action.type === 'SUBMIT_NOTE') {
    action.socket.emit('new note', {content: action.content});
  }

  if (action.type === 'ADD_NOTE') {
    state.push(action.note);
  }

  if (action.type === 'EDIT_NOTE') {
  }

  if (action.type === 'REPLACE_NOTES') {
    state = action.allNotes.sort((a, b) => Date.parse(a.audioTimestamp) - Date.parse(b.audioTimestamp));
  }

  return state;
};
