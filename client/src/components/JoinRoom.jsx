import React from 'react';
import Connection from '../Connection.js'
import { Link } from 'react-router';

class JoinRoom extends React.Component {
  constructor (props) {
    super(props)
    console.log('join room props:', props);

  }
  render(){
    return (
      <div className="container">
        <h2>Join Room</h2>
        <div>
        <form className="" role="join">
          <div className="form-group">
            <input type="text" name="access-code" className="form-control" placeholder="Access Code">
            <span className="input-group-btn">
              <button className="btn btn-default" type="button">Join</button>
            </span>
          </div>
        </form>
        </div>
      </div>
    )
  }
}

export default Connection(JoinRoom)