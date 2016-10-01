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

import {joinSocketRoom} from './actions/roomActions'
import {getCurrentView, getRoomCodeFromUrl} from './helpers'

const routes = createRoutes(store);

// const checkLobby = ({roomCode}) => {

//   let user = store.getState().user.information && store.getState().user.information[0];
//   let participants = store.getState().room.participants;
//   let host = participants && participants[0];

//   if (host && user && host.id !== user.id) {
//     store.dispatch(joinSocketRoom(roomCode, user, (err, success)=>{
//       if (err){
//         console.log('there was an error joining the room.');
//       } else {
//         console.log('join room success.');
//       }
//     }))
//   } else {
//     // redirect to 404 page...
//     console.log('sorry not allowed....')
//   }
// }

// // if you need to perform checks before mounting component
// const getInfo = {
//   'lobby': checkLobby
// };

// history.listen(location=> {
//   let currentView = getCurrentView(location.pathname);
//   let roomCode = getRoomCodeFromUrl(location.pathname);
//   return getInfo[currentView] && getInfo[currentView]({roomCode});
// });

render((<Provider store={store}>
    <Router history={history} >
      {routes}
    </Router>
  </Provider>),
  document.getElementById('root')
);
