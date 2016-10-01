/*jshint esversion: 6 */
export const createUser = (user) => {
  return {
    type: 'CREATE_USER',
    user
  };
};

export const logOut = () => {
  return {
    type: 'DELETE_USER'
  };
};
