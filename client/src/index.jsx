/*jshint esversion: 6 */

/* <- Import modules -> */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';

/* <- Import components -> */
import Landing from './components/Landing.jsx';
import Lecture from './components/Lecture.jsx';
import Compile from './components/Compile.jsx';
import NewRoom from './components/NewRoom.jsx';
import JoinRoom from './components/JoinRoom.jsx';
import Lobby from './components/Lobby.jsx';
import Notebook from './components/Notebook.jsx';
import Review from './components/Review.jsx';
import Main from './components/Main.jsx';
import App from './components/App.jsx';
/* <- Import store -> */
import store, { history } from './store';
import {createUser, getUser} from './actions/userActions';

const getUserFromCookie = (cookie) => {
  let slicedCookie = cookie.slice(17);
  let decoded = window.decodeURIComponent(slicedCookie);
  return JSON.parse(decoded).user;
};

const authCheck = (nextState, replace) => {
  if (document.cookie) {
    let user = getUserFromCookie(document.cookie);

    // if redux store does not have user,
    // console.log('auth-checking.', store.getState().user);
    if (!store.getState().user.information && user) {
      store.dispatch(createUser(user));
    }

    if (nextState.location.pathname === '/') {
      replace({
        pathname: '/notebook'
      });
    }
  } else {
    if (nextState.location.pathname !== '/') {
      replace({
        pathname: '/'
      });
    }
  }
};

render((<Provider store={store}>
    <Router history={history} >
      <Route path='/' component={App} >
        <IndexRoute component={Landing} onEnter={authCheck}/>
        <Route component={Main} onEnter={authCheck}>
          <Route path='/notebook' component={Notebook} onEnter={authCheck}/>
          <Route path='/new' component={NewRoom} />
          <Route path='/join' component={JoinRoom} />
          <Route path='/lobby' component={Lobby}/>
          <Route path="/lobby/:roomId" component={Lobby}/>
          <Route path='/review' component={Review} />
        </Route>
        <Route path='/lecture' component={Lecture} onEnter={authCheck}/>
        <Route path='/lecture/:roomId' component={Lecture} onEnter={authCheck}/>
        <Route path='/compile' component={Compile} onEnter={authCheck}/>
      </Route>
    </Router>
  </Provider>),
  document.getElementById('root')
);
