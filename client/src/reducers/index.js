/* jshint esversion: 6 */
import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import noteReducers from './noteReducers.js';
import userReducers from './userReducers.js';
import roomReducers from './roomReducers.js';

export default combineReducers({
  user: userReducers,
  note: noteReducers,
  room: roomReducers,
  routing: routerReducer
});