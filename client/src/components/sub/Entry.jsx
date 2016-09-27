import React from 'react';
import Connection from '../Connection.js'
import { Link } from 'react-router';

class Entry extends React.Component {
  constructor (props) {
    super(props)
  }
  render(){
    // Render an Entry component for each entry
    // (use map)
    return (
      <div className="col-sm-6 col-md-4">
        'Here lies an Entry Component'
        (insert a sneaky preview of your note)
      </div>
    )
  }
}

export default Connection(Entry);