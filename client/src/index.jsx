/*jshint esversion: 6 */

/* <- Import components -> */
import Connection from './Connection'
import Landing from './components/Landing';
import Main from './components/Main';
import Lecture from './components/Lecture';
import Compile from './components/Compile';
import NewRoom from './components/NewRoom';
import JoinRoom from './components/JoinRoom';
import Lobby from './components/Lobby';
import Notebook from './components/Notebook';
import Review from './components/Review';

/* <- Import store -> */
import store, {history} from './store';

/* <- Declarations -> */
const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const IndexRoute = ReactRouter.IndexRoute;
const Provider = ReactRedux.Provider;

/* <- Set up router -> */
const render = () => ReactDOM.render((
  <Provider store={store}>
    <Router history={history} >
      <Route path='/' component={Connection} >
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

render();