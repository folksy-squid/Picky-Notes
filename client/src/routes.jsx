/* <- Import modules -> */
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import {createUser, getUser} from './actions/userActions';

/* <- Import components -> */
import Landing from './components/Landing.jsx';
import Lecture from './components/Lecture.jsx';
import Compile from './components/Compile.jsx';
import NewRoom from './components/NewRoom.jsx';
import Lobby from './components/Lobby.jsx';
import Notebook from './components/Notebook.jsx';
import Review from './components/Review.jsx';
import Main from './components/Main.jsx';
import App from './components/App.jsx';

export default (store) => {

  const getUserFromCookie = (cookie) => {
    let slicedCookie = cookie.slice(17);
    let decoded = window.decodeURIComponent(slicedCookie);
    return JSON.parse(decoded).user;
  };

  const authCheck = (nextState, replace) => {

    if (document.cookie) {
      let user = getUserFromCookie(document.cookie);

      // if redux store does not have user,
      if (!store.getState().user || !store.getState().user.information) {
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

  let showFilter = false;
  const checkFilter = () => showFilter;

  const leaveNotebookView = (prevState) => {
    console.log('leaving');
    showFilter = false;
  }

  const enterNotebookView = (nextState, replace) => {
    console.log('entering');
    showFilter = true;
  }

  return (
    <Route path='/' component={App} >
      <IndexRoute component={Landing} onEnter={authCheck}/>
      <Route component={Main} onEnter={authCheck} checkFilter={checkFilter.bind(this)} >
        <Route path='/notebook' onLeave={leaveNotebookView.bind(this)} onEnter={enterNotebookView.bind(this)} component={Notebook} />
        <Route path='/new' component={NewRoom} />
        <Route path="/lobby/:roomId" component={Lobby}/>
        <Route path='/review/:roomId' component={Review} />
        <Route path='/compile/:roomId' component={Compile} onEnter={authCheck}/>
      </Route>
      <Route path='/lecture/:roomId' component={Lecture} onEnter={authCheck}/>
    </Route>
  );
};
