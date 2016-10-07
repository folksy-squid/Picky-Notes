export default (state = {notes: []}, action) => {
  if (action.type === 'SUBMIT_NOTE') {
    action.socket.emit('new note', {content: action.content});
  }

  if (action.type === 'ADD_NOTE') {
    return {
      ...state,
      notes: state.notes.concat([action.note])
    };
  }

  if (action.type === 'EDIT_NOTE') {
    state = state.map((note, i) => {
      if (note.id === action.noteId) {
        note.content = action.newText;
        note.changed = true;
      }
      return note;
    });
  }

  if (action.type === 'REPLACE_NOTES') {
    var notes = action.allNotes.sort((a, b) => Date.parse(a.audioTimestamp) - Date.parse(b.audioTimestamp));

    state.notes = notes;
    state.audioTimestampArray = notes.map((note) => {
      return Number(note.audioTimestamp) / 1000;
    });
    action.cb();
    return state;
  }
    // state = action.allNotes.sort((a, b) => Date.parse(a.audioTimestamp) - Date.parse(b.audioTimestamp));

  if (action.type === 'REMOVE_NOTES') {
    return {
      ...state,
      notes: [],
      audioTimestamp: []
    };
    // state = [];
  }

  if (action.type === 'SELECT_NOTE') {
    state.notes = state.notes.map((note) => {
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
    return state;
  }

  if (action.type === 'SET_TIMER') {
    let currentNoteSelected = action.index - 1;
    console.log('triggering timer');
    var wavePos = action.wavePos;
    const updateNote = () => {
      console.log('there is a timer', state.timer);
      if (state.timer) {
        clearTimeout(state.timer);
      }
      currentNoteSelected++;
      let diff = (state.audioTimestampArray[currentNoteSelected] - wavePos);
      wavePos = wavePos + diff;

      console.log('diff:', diff, wavePos, state.audioTimestampArray[currentNoteSelected]);

      if (state.audioTimestampArray.length > currentNoteSelected) {
        state.timer = window.setTimeout(updateNote, diff * 1000);
      }
    };
    updateNote();
    return state;
  }

  return state;
};
