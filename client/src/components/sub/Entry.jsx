import React from 'react';
import Connection from '../../Connection.js';
import { Link } from 'react-router';

class Entry extends React.Component {
  constructor (props) {
    super(props);
  }
  render() {
    // Render an Entry component for each entry
    // (use map)
    return (
      <div className="col-sm-6 col-md-4">
        <Link to={`/review/${this.props.entry.pathUrl}`}>
          <div>{`${this.props.entry.topic} by ${this.props.entry.lecturer}`}</div>
          <img style={{maxHeight: '200px', maxWidth: '200px'}} src='https://image.freepik.com/free-icon/file-interface-symbol-of-a-white-page-with-one-folded-corner_318-41811.jpg' />
          <div>{`${this.props.entry.class}`}</div>
        </Link>
      </div>
    );
  }
}

export default Connection(Entry);
