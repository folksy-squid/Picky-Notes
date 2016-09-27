/*jshint esversion: 6 */

/* <- Imports and Declarations -> */
import {compose, createStore} from 'redux';
import {browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import reducers from './reducers';

/* <- Set up store -> */
const defaultState = {
  user: {}
};

const store = createStore(reducers, defaultState);

/* <- Export store -> */
export const history = syncHistoryWithStore(browserHistory, store);

export default store;
