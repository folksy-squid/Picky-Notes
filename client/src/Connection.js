/*jshint esversion: 6 */
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from './actions/actionCreators';

const mapStateToProps = (state) => ({ notes: state.notes });

const mapDispatchToProps = (dispatch) => bindActionCreators(actionCreators, dispatch);

const Connection = (view)=> connect(mapStateToProps, mapDispatchToProps)(view);

export default Connection;
