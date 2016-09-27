import React from 'react';
import Connection from '../Connection.js'
import { Link } from 'react-router';

class NewRoom extends React.Component {
  constructor (props) {
    super(props)
  }
  render(){
    return (
      <div class="container">
        <h2>New Room</h2>
        <div>
          <form>
            <input type="text" name="subject" placeholder="Subject">
            <input type="text" name="class" placeholder="Class">
            <input type="text" name="lecturer" placeholder ="Lecturer (optional)">
          </form>
        </div>
      </div>
    )
  }
}

export default Connection(NewRoom);