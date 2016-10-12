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
          <IndexLinkContainer to="/">
            <a href='#'>
              <Navigation.Brand>
                Picky Notes
              </Navigation.Brand>
            </a>
          </IndexLinkContainer>
          <Navigation.Toggle />
        </Navigation.Header>
        <Navigation.Collapse>
          <Nav pullRight>
            <LinkContainer to="/join">
              <NavItem eventKey={1}>
                Join Room
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/new">
              <NavItem eventKey={2}>
                New Room
              </NavItem>
            </LinkContainer>
            <NavItem eventKey={3} href="/" onClick={this.logout.bind(this)}>
              Logout
            </NavItem>
          </Nav>
        </Navigation.Collapse>
      </Navigation>
    )
  }
}

export default Connection(Navbar);
