/*jshint esversion: 6 */

const bindActionCreators = Redux.bindActionCreators;
const connect = ReactRedux.connect;
import * as actionCreators from './actions/actionCreators';
import App from './components/App';

function mapStateToProps(state) {
  return {
    notes: state.notes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

const Connection = connect(mapStateToProps, mapDispatchToProps)(App);

export default Connection;