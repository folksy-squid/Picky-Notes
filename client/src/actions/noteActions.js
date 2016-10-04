/*jshint esversion: 6 */
export const submitNote = (socket, content) => {
  return {
    type: 'SUBMIT_NOTE',
    socket,
    content
  };
};

export const addNote = (note) => {
  console.log('adding a note', note);
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

export const replaceNotes = (allNotes) => {
  return {
    type: 'REPLACE_NOTES',
    allNotes
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
