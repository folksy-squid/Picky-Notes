/*jshint esversion: 6 */

/* <- Imports and Declarations -> */
import reducers from './reducers';
import App from './components/App.jsx';
import Landing from './components/Landing.jsx';

// Declare Redux Methods
const store = Redux.createStore(reducers);

// Declare ReactRouter Methods
const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const IndexRoute = ReactRouter.IndexRoute;
const browserHistory = ReactRouter.browserHistory;
/*<-// Imports and Declarations -> */

const render = () => ReactDOM.render((
  <Landing></Landing>
  /*<Router history={browserHistory} >
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
  </Router>*/
  ),
  document.getElementById('root')
);

render();
store.subscribe(render);