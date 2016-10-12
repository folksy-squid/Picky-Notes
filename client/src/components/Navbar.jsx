import React from 'react';
import { Link, Router } from 'react-router';
import {connect} from 'react-redux';
import {IndexLinkContainer, LinkContainer} from 'react-router-bootstrap';
import {mapStateToProps} from '../Connection.js'
import {joinSocketRoom} from '../actions/roomActions';
import {Navbar as Navigation, Nav, NavItem, NavDropdown, MenuItem, FormGroup, FormControl, Modal, Button} from 'react-bootstrap';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      error: false,
      value: null
    }
  }
  static get contextTypes() {
    return {
      router: React.PropTypes.object.isRequired,
    };
  }

  logout() {
    this.props.dispatch(this.props.logOut());
  }

  showModal() {
    this.setState({show: true});
  }

  hideModal() {
    this.setState({show: false})
  }

  updateInput(e) {
    this.setState({value: e.target.value});
  }

  submitInput(e) {
    e.preventDefault();
    var realm = this;
    var pathUrl = this.state.value;
    var user = this.props.getState().user.information[0];
    var joinedRoom = (err, success, ...args) => {
      this.setState({ show: false });
      if (err) {
        console.log(err);
      } else if (args[2] === 'lecture') {
        realm.context.router.push(`/lecture/${realm.state.value}`);
      } else {
        realm.context.router.push(`/lobby/${realm.state.value}`);
      }
    };
    this.props.dispatch(joinSocketRoom(pathUrl, user, joinedRoom));
    this.refs.joinRoomInput.value = '';
  }

  render() {

    let close = () => this.setState({ show: false });

    /*=============================
    =            Modal            =
    =============================*/

    let modal = (
      <Modal show={this.state.show} onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title id="modal-title">Join Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
          <form onSubmit={this.submitInput.bind(this)} className="" role="join">
            <div className="form-group">
              <input ref="joinRoomInput" onChange={this.updateInput.bind(this)} type="text" className="form-control" placeholder="Enter Access Code" />
            {(this.state.error) ?
              (<div className="alert alert-danger">
                <a data-dismiss="alert">&times;</a>
                <strong>Error!</strong> Invalid Access Code. Try again!
              </div>) : ''}
            </div>
          </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={this.submitInput.bind(this)}className="btn btn-primary">Join</button>
        </Modal.Footer>
      </Modal>
    )

    /*==============================
    =            Navbar            =
    ==============================*/

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
            <NavItem active={false} eventKey={1} onClick={this.showModal.bind(this)}>
              Join Room
            </NavItem>
            <LinkContainer to="/new">
              <NavItem active={false} eventKey={2}>
                New Room
              </NavItem>
            </LinkContainer>
            <NavItem active={false} eventKey={3} href="/" onClick={this.logout.bind(this)}>
              Logout
            </NavItem>
          </Nav>
        </Navigation.Collapse>
        {modal}
      </Navigation>
    )

  }
}

export default connect(mapStateToProps)(Navbar);
