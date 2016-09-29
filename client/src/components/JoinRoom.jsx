import React from 'react';
import Connection from '../Connection.js';
import { Link, Router } from 'react-router';

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
    this.refs.joinRoomInput.value = '';
    console.log(this.state.value);
    this.socket = io();
    this.socket.on('user info', () => {
      this.socket.emit(this.props.User)
    });
    this.socket.emit('join room', this.state.value);
    this.socket.on('room not found', () => {
      this.socket.disconnect();
      this.socket = null;
    });

    this.socket.on('join room success', () => {
      console.log('i have successfully joined a room');
      this.context.router.push(`/lobby/${this.state.value}`);
    });
    this.socket.on('join room error', (err) => {
      this.setState({error: true});
      console.log('i have errored out', err);
    });

  }
  render() {
    var context = this;
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
            {(context.state.error) ?
              (<div className="alert alert-danger">
                <a dataDismiss="alert">&times;</a>
                <strong>Error!</strong> Invalid Access Code. Try again!
              </div>) : ''}
          </div>
        </form>
        </div>
      </div>
    );
  }
}

export default Connection(JoinRoom);
