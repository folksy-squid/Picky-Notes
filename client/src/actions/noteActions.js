/*jshint esversion: 6 */
export const submitNote = (socket, content, thought) => {
  return {
    type: 'SUBMIT_NOTE',
    socket,
    content,
    thought
  };
};

export const removeNotes = () => {
  return {
    type: 'REMOVE_NOTES'
  };
};

export const addNote = (note) => {
  return {
    type: 'ADD_NOTE',
    note
  };
};

export const editNote = (noteId, newText) => {
  return {
    type: 'EDIT_NOTE',
    noteId,
    newText
  };
};

export const editTimestamp = (noteId, newTimestamp) => {
  return {
    type: 'EDIT_TIMESTAMP',
    noteId,
    newTimestamp,
  };
};

export const deleteNote = (noteId) => {
  return {
    type: 'DELETE_NOTE',
    noteId,
  };
};

export const clearDeletedNotes = () => {
  return {
    type: 'CLEAR_DELETED_NOTES',
  };
};

export const replaceNotes = (allNotes, cb) => {
  return {
    type: 'REPLACE_NOTES',
    allNotes,
    cb
  };
};

export const toggleNote = (noteId) => {
  return {
    type: 'SELECT_NOTE',
    noteId
  };
};

export const getNotesFromRoom = (pathUrl, user, cb) => {
  return {
    type: 'GET_NOTES_FROM_ROOM',
    pathUrl,
    user,
    cb
  };
};

export const setClass = (index, wavePos, actionState) => {
  return {
    type: 'SET_CLASS',
    index,
    wavePos,
    actionState
  };
};

export const removeTimer = () => {
  return {
    type: 'REMOVE_TIMER'
  };
};

export const setArrow = (arrowPos) => {
  return {
    type: 'SET_ARROW',
    arrowPos
  };
};

export const removeArrow = () => {
  return {
    type: 'REMOVE_ARROW'
  };
};

export const showHideThoughts = (load) => {
  return {
    type: 'SHOW_HIDE_THOUGHTS',
    load
  };
};
