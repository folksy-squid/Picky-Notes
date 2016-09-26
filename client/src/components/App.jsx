import React from 'react';
import Connection from '../Connection.js'
import { Link } from 'react-router';
import Navbar from './Navbar.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
    console.log('apps props:', this.props)
  }

  render() {
    return (
      <div>
        <Navbar/>
        {this.props.children}
      </div>
    );
  }
}

export default Connection(App);