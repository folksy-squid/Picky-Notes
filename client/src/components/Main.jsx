import React from 'react';
import Connection from '../Connection.js';
import Navbar from './Navbar.jsx';
import { Link } from 'react-router';

export class Main extends React.Component {
  constructor (props) {
    super(props);
  }
  render() {
    return (
      <div className="main">
        <Navbar checkFilter={this.props.route.checkFilter}/>
        {this.props.children}
      </div>
    );
  }
}

export default Main;
