/*jshint esversion: 6 */
export default (state = {notes: [], deleted: []}, action) => {
  if (action.type === 'SUBMIT_NOTE') {
    action.socket.emit('new note', {content: action.content, thought: action.thought});
  }

  if (action.type === 'ADD_NOTE') {
    let notes = state.notes.concat([action.note]);
    notes.sort((a, b) => a.audioTimestamp - b.audioTimestamp);
    return {
      ...state,
      notes,
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
    let notes = action.allNotes.sort((a, b) => a.audioTimestamp - b.audioTimestamp);

    state.notes = [{audioTimestamp: 0}].concat(notes);
    console.log('state.notes in noteReducer', notes);
    state.justNotes = notes.filter(note=>!note.thought);
    state.audioTimestampArray = state.justNotes.map(note=> Number(note.audioTimestamp) / 1000);
    console.log('notes in justNotes', state.justNotes);
    action.cb && action.cb();
    return {...state};
  }

  if (action.type === 'REMOVE_NOTES') {
    return {
      ...state,
      notes: [],
      audioTimestamp: []
    };
  }

  if (action.type === 'DELETE_NOTE') {
    let index = -1;
    for (let i = 0; i < state.notes.length; i++) {
      if (state.notes[i].id === action.noteId) {
        index = i;
        break;
      }
    }
    return {
      ...state,
      deleted: state.deleted.concat(state.notes.splice(index, 1)),
    };
  }

  if (action.type === 'CLEAR_DELETED_NOTES') {
    return {
      ...state,
      deleted: [],
    };
  }

  if (action.type === 'SELECT_NOTE') {
    let notes = state.notes;

    for (let i = 0; i < notes.length; i++) {
      if (notes[i].id === action.noteId) {
        notes[i].show = !notes[i].show;
        if (notes[i].changed) {
          delete notes[i].changed;
        } else {
          notes[i].changed = true;
        }
        break;
      }
    }
    return {...state};
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

    const updateNote = () => {
      state.justNotes.forEach(note => note['highlight'] = null);
      if (state.currentNoteSelected > -1) {
        state.justNotes[state.currentNoteSelected]['highlight'] = true;
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
