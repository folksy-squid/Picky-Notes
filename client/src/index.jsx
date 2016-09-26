/*jshint esversion: 6 */

/* <- Import components -> */
import App from './components/App.jsx';
import Landing from './components/Landing.jsx';
import Main from './components/Main.jsx';
import Lecture from './components/Lecture.jsx';
import Compile from './components/Compile.jsx';
import NewRoom from './components/NewRoom.jsx';
import JoinRoom from './components/JoinRoom.jsx';
import Lobby from './components/Lobby.jsx';
import Notebook from './components/Notebook.jsx';
import Review from './components/Review.jsx';

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

render();