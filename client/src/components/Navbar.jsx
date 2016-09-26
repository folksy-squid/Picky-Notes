import React from 'react';
import { Link } from 'react-router';

class Navbar extends React.Component {
  render() {
    return (
      <nav id="navbar">
        <a className="navbar-brand">Picky Notes</a>
        <button className="navbar-toggler hidden-lg-up" type="button" data-toggle="collapse" data-target="#nav-content">
        ☰
        </button>
        <div className="collapse navbar-toggleable-md col-sm-10" id="nav-content">
          <ul className="nav navbar-nav">
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