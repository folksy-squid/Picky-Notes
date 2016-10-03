/*jshint esversion: 6 */
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from './actions/index.js';
import store from './store';

const mapStateToProps = () => (store);


const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch);

const Connection = (view)=>
  connect(mapStateToProps, mapDispatchToProps)(view);

export {mapStateToProps};
export default Connection;
