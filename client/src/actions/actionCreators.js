/*jshint esversion: 6 */

// store your actions in here!
export function createUser (user) {
  return {
    type: 'CREATE_USER',
    user
  };
}

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