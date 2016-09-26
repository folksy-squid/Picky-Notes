import React from 'react';
import { Link } from 'react-router';
import Navbar from './Navbar.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var children = React.cloneElement(this.props.children, this.props)
    return (
      <div>
        <Navbar/>
        {children}
      </div>
    );
  }
}

export default App;