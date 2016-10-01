/*jshint esversion: 6 */
export function submitNote (socket, content) {
  return {
    type: 'SUBMIT_NOTE',
    socket,
    content
  };
}

export function addNote (note) {
  return {
    type: 'ADD_NOTE',
    note
  };
}

export function editNote (noteId, newText) {
  return {
    type: 'EDIT_NOTE',
    noteId,
    newText
  };
}

export function replaceNotes (allNotes) {
  return {
    type: 'REPLACE_NOTES',
    allNotes
  };
}
