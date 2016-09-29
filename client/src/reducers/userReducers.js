/*jshint esversion: 6 */

export default (state = {}, action) => {

  if (action.type === 'CREATE_USER'){
    console.log('creating user.');
    state.information = action.user;
  }

  if (action.type === 'DELETE_USER'){
    if (window.document.cookie){
      window.document.cookie += '; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      delete state.information;
    }
  }

  return state;
};