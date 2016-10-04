export default (state = [], action) => {
  if (action.type === 'SUBMIT_NOTE') {
    action.socket.emit('new note', {content: action.content});
  }

  if (action.type === 'ADD_NOTE') {
    state = state.concat([action.note]);
  }

  if (action.type === 'EDIT_NOTE') {
  }

  if (action.type === 'REPLACE_NOTES') {
    state = action.allNotes.sort((a, b) => Date.parse(a.audioTimestamp) - Date.parse(b.audioTimestamp));
  }

  if (action.type === 'SELECT_NOTE') {
    state = state.map((note, i) => {
      if (note.id === action.noteId) {
        note.show = !note.show;
        if (note.changed) {
          delete note.changed;
        } else {
          note.changed = true;
        }
      }
      return note;
    });
  }

  return state;
};
