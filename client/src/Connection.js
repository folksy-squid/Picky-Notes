/*jshint esversion: 6 */
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from './actions/actionCreators';

function mapStateToProps(state) {
  return {
    notes: state.notes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

const Connection = function (view){
  return connect(mapStateToProps, mapDispatchToProps)(view);
};

export default Connection;