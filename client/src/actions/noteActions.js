/*jshint esversion: 6 */

export function addNote (timestamp, text) {
  return {
    type: 'ADD_NOTE',
    timestamp,
    text
  };
}

export function editNote (noteId, newText) {
  return {
    type: 'EDIT_NOTE',
    noteId,
    newText
  };
}

