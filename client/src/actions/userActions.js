/*jshint esversion: 6 */
export function createUser (user) {
  return {
    type: 'CREATE_USER',
    user
  };
}

export function getUser () {
  return {
    type: 'GET_USER'
  };
}

export function logOut () {
  return {
    type: 'DELETE_USER'
  };
}