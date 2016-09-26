import React from 'react';
import Connection from '../Connection.js'
import { Link } from 'react-router';

class Notebook extends React.Component {
  constructor (props) {
    super(props);
    console.log('state:', this.state);
    console.log('props:', props);
  }

  render(){
    return (
      <div>'this is the notebook page'</div>
    )
  }
}

export default Connection(Notebook);