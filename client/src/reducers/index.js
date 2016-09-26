/* jshint esversion: 6 */
const combineReducers = Redux.combineReducers;
const routerReducer = ReactRouterRedux.routerReducer;

import reducer1 from './reducer1.js';
import reducer2 from './reducer2.js';

export default combineReducers({
  reducer1,
  reducer2,
  routing: routerReducer
});