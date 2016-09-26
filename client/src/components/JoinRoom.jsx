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
      <div>'this is the joinroom view'</div>
    )
  }
}

export default Connection(JoinRoom)