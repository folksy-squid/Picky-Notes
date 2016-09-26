import React from 'react';
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

export default App;