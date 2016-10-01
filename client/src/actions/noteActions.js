/*jshint esversion: 6 */
export const submitNote = (socket, content) => {
  return {
    type: 'SUBMIT_NOTE',
    socket,
    content
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

export const replaceNotes = (allNotes) => {
  return {
    type: 'REPLACE_NOTES',
    allNotes
  };
};
