/* jshint esversion: 6 */
import {combineReducers} from 'redux';
import {routerReducer as routing} from 'react-router-redux';

import note from './noteReducers';
import user from './userReducers';
import room from './roomReducers';
import waveform from './waveformReducers';

export default combineReducers({
  user,
  note,
  room,
  routing,
  waveform
});
