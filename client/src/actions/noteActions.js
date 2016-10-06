/*jshint esversion: 6 */
export const submitNote = (socket, content) => {
  return {
    type: 'SUBMIT_NOTE',
    socket,
    content
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
