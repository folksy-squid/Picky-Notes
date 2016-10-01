/* jshint esversion: 6 */
import {combineReducers} from 'redux';
import {routerReducer as routing} from 'react-router-redux';

import note from './noteReducers.js';
import user from './userReducers.js';
import room from './roomReducers.js';

export default combineReducers({
  user,
  note,
  room,
  routing
});