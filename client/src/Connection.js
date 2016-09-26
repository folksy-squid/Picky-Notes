/*jshint esversion: 6 */
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from './actions/actionCreators';
import App from './components/App.jsx';

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