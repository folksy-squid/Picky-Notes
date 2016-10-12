import React from 'react';
import Connection from '../Connection.js';
import { Link } from 'react-router';
import {IndexLinkContainer, LinkContainer} from 'react-router-bootstrap';
import {Navbar as Navigation} from 'react-bootstrap';
import {Nav, NavItem} from 'react-bootstrap';

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
      <Navigation>
        <Navigation.Header>
          <Navigation.Brand>
            <a href="#">Picky Notes</a>
          </Navigation.Brand>
          <Navigation.Toggle />
        </Navigation.Header>
        <Navigation.Collapse>
          <Nav pullRight>
            <IndexLinkContainer to="/">
              <NavItem eventKey={1}>
                My Lectures
              </NavItem>
            </IndexLinkContainer>
            <LinkContainer to="/join">
              <NavItem eventKey={2}>
                Join Room
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/new">
              <NavItem eventKey={3}>
                New Room
              </NavItem>
            </LinkContainer>
            <NavItem eventKey={4} href="/" onClick={this.logout.bind(this)}>
              Logout
            </NavItem>
          </Nav>
        </Navigation.Collapse>
      </Navigation>
    )
  }
}

export default Connection(Navbar);
