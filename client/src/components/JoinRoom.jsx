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
    var context = this;
    var pathUrl = this.state.value;
    var userId = this.props.getState().user.information[0].id;

    var cb = function(err, success){
      if (err){
        context.setState({error: true});
      } else {
        context.context.router.push(`/lobby/${context.state.value}`);
      }
    }

    this.props.dispatch(this.props.joinSocketRoom(pathUrl, userId, cb))

    this.refs.joinRoomInput.value = '';

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
