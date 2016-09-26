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

/* <- Set up router -> */
render(
  (<Provider store={store}>
    <Router history={history} >
      <Route path='/' component={App} >
        <IndexRoute component={Landing} />
        <Route path='/main' component={Main}>
          <Route path='/notebook' component={Notebook} />
          <Route path='/new' component={NewRoom} />
          <Route path='/join' component={JoinRoom} />
          <Route path='/lobby' component={Lobby} />
          <Route path='/review' component={Review} />
        </Route>
        <Route path='/lecture' component={Lecture} />
        <Route path='/compile' component={Compile} />
      </Route>
    </Router>
  </Provider>
  ),
  document.getElementById('root')
);
