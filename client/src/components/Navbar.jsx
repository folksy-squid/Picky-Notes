import React from 'react';
import Connection from '../Connection.js';
import { Link } from 'react-router';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  logout() {
    this.props.dispatch(this.props.logOut());
  }

  toggleNav() {
    document.getElementById('navbar-collapse1')
  }

  render() {
    return (
      <nav className="navbar navbar-default navbar-static-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed btn-info" data-toggle="collapse" data-target="#navbar-collapse1" onClick={toggleNav}>
              <span className="sr-only">Toggle Navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">Picky Notes</a>
          </div>
          <div className="navbar-collapse collapse" id="navbar-collapse1">
            <ul className="nav navbar-nav navbar-right">
              <li className="nav-item">
                <Link className="nav-link " to="/notebook">My Lectures</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/join">Join Room</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link " to="/new">New Room</Link>
              </li>
              <li className="nav-item">
                <a href="/" className="nav-link" onClick={this.logout.bind(this)} >Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Connection(Navbar);
