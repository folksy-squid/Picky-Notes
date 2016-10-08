/*jshint esversion: 6 */
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
    state.notes = state.notes.map((note, i) => {
      if (note.id === action.noteId) {
        note.content = action.newText;
        note.changed = true;
      }
      return note;
    });
  }

  if (action.type === 'REPLACE_NOTES') {
    var notes = action.allNotes.sort((a, b) => Date.parse(a.audioTimestamp) - Date.parse(b.audioTimestamp));

    state.notes = [{audioTimestamp: 0}].concat(notes);
    state.audioTimestampArray = notes.map((note) => {
      return Number(note.audioTimestamp) / 1000;
    });
    action.cb && action.cb();
    return state;
  }

  if (action.type === 'REMOVE_NOTES') {
    return {
      ...state,
      notes: [],
      audioTimestamp: []
    };
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
    if (!window.timer) {
      window.timer;
    }
    if (window.timer) {
      window.clearTimeout(window.timer);
    }
    state.currentNoteSelected = action.index;
    state.wavePos = action.wavePos;
    state.diff = (state.audioTimestampArray[state.currentNoteSelected] - state.wavePos);
    state.notes.forEach((note) => {
      note['highlight'] = null;
    });
    const updateNote = () => {
      if (state.highlightedIndex >= 0) {
        state.notes.forEach((note) => {
          note['highlight'] = null;
        });
      }
      if (state.currentNoteSelected > -1) {
        state.notes[state.currentNoteSelected]['highlight'] = true;
        state.highlightedIndex = state.currentNoteSelected;
      }

      window.timer && window.clearTimeout(window.timer);
      state.diff = (state.audioTimestampArray[state.currentNoteSelected] - state.wavePos);
      state.wavePos = state.wavePos + state.diff;
      state.currentNoteSelected++;
      if (state.audioTimestampArray[state.currentNoteSelected - 1]) {
        window.timer = window.setTimeout(updateNote, state.diff * 1000 + 10);
      }


    };
    updateNote();
    return state;
  }
  if (action.type === 'REMOVE_TIMER') {
    console.log('removing the timer', window.timer);
    if (window.timer) {
      window.clearTimeout(window.timer);
    }
    return state;
  }
  return {...state};
};
