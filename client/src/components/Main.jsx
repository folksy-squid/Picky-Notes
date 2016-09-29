import React from 'react';
import Connection from '../Connection.js'
import Navbar from './Navbar.jsx'
import { Link } from 'react-router';

class Main extends React.Component {
  constructor (props) {
    super(props);
  }
  render() {
    return (
      <div className="main">
        <Navbar/>
        {this.props.children}
      </div>
    );
  }
}

export default Main;
