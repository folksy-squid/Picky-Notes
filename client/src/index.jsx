/*jshint esversion: 6 */

/* <- Import modules -> */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

/* <- Import store and routes -> */
import createRoutes from './routes.jsx';
import store, { history } from './store';
import {createUser, getUser} from './actions/userActions';
import {joinSocketRoom} from './actions/roomActions';
import {getCurrentView, getRoomCodeFromUrl} from './helpers';

const routes = createRoutes(store);

render((<Provider store={store}>
    <Router history={history} >
      {routes}
    </Router>
  </Provider>),
  document.getElementById('root')
);
