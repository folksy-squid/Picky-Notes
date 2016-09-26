/*jshint esversion: 6 */

/* <- Imports and Declarations -> */
const browserHistory = ReactRouter.browserHistory;
const syncHistoryWithStore = ReactRouterRedux.syncHistoryWithStore;
const compose = Redux.compose;
import reducers from './reducers';

/* <- Set up store -> */
const defaultState = {

};

const store = createStore(reducers, defaultState);

/* <- Export store -> */
export const history = syncHistoryWithStore(browserHistory, store);

export default store;