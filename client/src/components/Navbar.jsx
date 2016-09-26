import React from 'react';
import { Link } from 'react-router';

class Navbar extends React.Component {
  //hello from the other side
  render() {
    return (
      <nav className="navbar navbar-static-top">
        <div className="container-fluid">
          <ul className="nav navbar-nav">
            <a className="navbar-brand">Picky Notes</a>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li className="nav-item">
              <Link className="nav-link" to="/join">Join Room</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link " to="/new">New Room</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link " to="/notebook">My Notebook</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/logout">Logout</a>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}

export default Navbar;