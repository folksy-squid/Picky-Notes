import React from 'react';
import Connection from '../Connection.js'
import Navbar from './Navbar.jsx'
import { Link } from 'react-router';

class Main extends React.Component {
  constructor (props) {
    super(props)
    console.log('mains props:', props)
  }
  render(){
    return (
      <div>
        <Navbar/>
        {this.props.children}
      </div>
    )
  }
}

export default Connection(Main);