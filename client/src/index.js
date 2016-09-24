/*jshint esversion: 6 */
import reducers from './reducers';
import App from './components/App.jsx';

const store = Redux.createStore(reducers);
const rootEl = document.getElementById('root');

const render = () => ReactDOM.render(
  <App />,
  rootEl
);

render();
store.subscribe(render);
