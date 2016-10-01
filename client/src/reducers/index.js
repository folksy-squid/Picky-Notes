/* jshint esversion: 6 */
import {combineReducers} from 'redux';
import {routerReducer as routing} from 'react-router-redux';

<<<<<<< fc8ea1d4d5605dbe652b7a2d5815baf2b4d03888
import note from './noteReducers.js';
import user from './userReducers.js';
import room from './roomReducers.js';
=======
import * as note from './noteReducers.js';
import * as user from './userReducers.js';
import * as room from './roomReducers.js';

// const isFetching = ( state = false, action ) => {
//   switch (action.type) {
//     case types.CREATE_REQUEST:
//       return true;
//     case types.REQUEST_SUCCESS:
//     case types.REQUEST_FAILURE:
//       return false;
//     default:
//       return state;
//   }
// };

export const changeLocation = () => {

}
>>>>>>> Merging conflicts in index.jsx

export default combineReducers({
  user,
  note,
  room,
  routing
});