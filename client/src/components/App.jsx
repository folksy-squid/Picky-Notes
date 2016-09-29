import React from 'react';
import Connection from '../Connection.js';
import { Link } from 'react-router';


class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
export default Connection(App);
