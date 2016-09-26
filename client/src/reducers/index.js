/* jshint esversion: 6 */
import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import reducer1 from './reducer1.js';
import reducer2 from './reducer2.js';

export default combineReducers({
  reducer1,
  reducer2,
  routing: routerReducer
});