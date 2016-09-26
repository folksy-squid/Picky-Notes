export default (state = {}, action) => {

  if (action.type === 'CREATE_USER'){
    state = action.user;
  }

  return state;
};