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
  <Router history={browserHistory} >
    <Route path='/' component={App} >
      <IndexRoute component={Landing} />
    </Route>
  </Router>

  <App />),
  document.getElementById('root')
)

render();
store.subscribe(render);