import React from 'react';
import Connection from '../Connection.js'
import { Link } from 'react-router';

class Navbar extends React.Component {
  constructor(props){
    super(props);
  }

  logout() {
    this.props.dispatch(this.props.logOut());
  }

  render() {
    return (
      <nav className="navbar navbar-static-top">
        <div className="container-fluid">
          <ul className="nav navbar-nav">
            <a className="navbar-brand">Picky Notes</a>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li className="nav-item">
              <Link className="nav-link " to="/notebook">My Notebook</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/join">Join Room</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link " to="/new">New Room</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" onClick={this.logout.bind(this)} to="/">Logout</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Connection(Navbar);
