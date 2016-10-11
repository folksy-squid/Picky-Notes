/*jshint esversion: 6 */
export default (state = {notes: [], deleted: []}, action) => {
  if (action.type === 'SUBMIT_NOTE') {
    action.socket.emit('new note', {content: action.content, thought: action.thought});
  }

  if (action.type === 'ADD_NOTE') {
    let notes = state.notes.concat([action.note]);
    notes = notes.sort((a, b) => a.audioTimestamp - b.audioTimestamp);

    let justNotes = notes.filter(note=>!note.thought);
    let justThoughts = notes.filter(note=>note.thought);
    let audioTimestampArray = state.justNotes.map(note=> Number(note.audioTimestamp) / 1000);

    return {
      ...state,
      notes,
      justNotes,
      justThoughts,
      audioTimestampArray
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

  if (action.type === 'EDIT_TIMESTAMP') {
    const notes = state.notes.map((note, i) => {
      if (note.id === action.noteId) {
        note.audioTimestamp = action.newTimestamp;
        note.changed = true;
      }
      return note;
    });
    return {
      ...state,
      notes,
    };
  }

  if (action.type === 'REPLACE_NOTES') {
    let notes = action.allNotes.sort((a, b) => a.audioTimestamp - b.audioTimestamp);

    state.notes = [{audioTimestamp: 0}].concat(notes);
    // console.log('state.notes in noteReducer', notes);
    state.justNotes = state.notes.filter(note=>!note.thought);
    state.justThoughts = notes.filter(note=>note.thought);
    state.audioTimestampArray = state.justNotes.map(note=> Number(note.audioTimestamp) / 1000);
    // console.log('notes in justNotes', state.justNotes);
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

  if (action.type === 'SET_CLASS') {

    if (window.timer) {
      window.clearTimeout(window.timer);
    }

    let upcomingNoteIndex = action.index;
    let wavePos = action.wavePos;

    const updateNote = (idx) => {
      state.justNotes.forEach(note => note['highlight'] = null);
      state.justNotes[idx]['highlight'] = true;
      let diff = state.audioTimestampArray[idx + 1] - wavePos;
      wavePos = wavePos + diff;
      idx++;
      if (state.audioTimestampArray[idx] > -1) {
        window.timer = window.setTimeout(updateNote.bind(this, idx), diff * 1000);
      }
    };
    let idx = upcomingNoteIndex - 1 < 0 ? 0 : upcomingNoteIndex - 1;
    if (action.actionState === 'paused') {
      state.justNotes.forEach(note => note['highlight'] = null);
      state.justNotes[idx]['highlight'] = true;
    } else {
      updateNote(idx);
    }

    return state;
  }

  if (action.type === 'REMOVE_TIMER') {
    // console.log('removing the timer', window.timer);
    if (window.timer) {
      window.clearTimeout(window.timer);
    }
    return state;
  }
  if (action.type === 'SET_ARROW') {
    state.justNotes.forEach(note => delete note['arrow']);
    state.justNotes[action.arrowPos]['arrow'] = true;
    return {...state};
  }
  if (action.type === 'REMOVE_ARROW') {
    console.log('removing arrows');
    state.justNotes.forEach(note => delete note['arrow']);
    return {...state};
  }

  return {...state};
};
