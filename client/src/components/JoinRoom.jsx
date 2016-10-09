import React from 'react';
import Connection from '../Connection.js';
import { Link, Router } from 'react-router';
import {mapStateToProps} from '../Connection.js';
import {joinSocketRoom} from '../actions/roomActions';
import {connect} from 'react-redux';

class JoinRoom extends React.Component {
  constructor (props) {
    super(props);
    console.log('join room props:', props);
    this.state = {
      error: false
    };
  }
  static get contextTypes() {
    return {
      router: React.PropTypes.object.isRequired,
    };
  }
  updateInput(e) {
    this.setState({value: e.target.value});
  }
  submitInput(e) {
    e.preventDefault();
    var realm = this;
    var pathUrl = this.state.value;
    var user = this.props.getState().user.information[0];
    var joinedRoom = (err, success, ...args) => {
      if (err) {
        console.log(err);
      } else if (args[2] === 'lecture') {
        realm.context.router.push(`/lecture/${realm.state.value}`);
      } else {
        realm.context.router.push(`/lobby/${realm.state.value}`);
      }
    };
    this.props.dispatch(joinSocketRoom(pathUrl, user, joinedRoom));
    this.refs.joinRoomInput.value = '';
  }
  render() {
    return (
      <div className="container">
        <h2>Join Room</h2>
        <div>
        <form onSubmit={this.submitInput.bind(this)} className="" role="join">
          <div className="form-group">
            <input ref="joinRoomInput" onChange={this.updateInput.bind(this)} type="text" className="form-control" placeholder="Access Code" />
            <span className="input-group-btn">
              <button className="btn btn-default">Join</button>
            </span>
            {(this.state.error) ?
              (<div className="alert alert-danger">
                <a data-dismiss="alert">&times;</a>
                <strong>Error!</strong> Invalid Access Code. Try again!
              </div>) : ''}
          </div>
        </form>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(JoinRoom);
