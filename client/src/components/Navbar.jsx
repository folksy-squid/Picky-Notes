import React from 'react';
import { Link, Router } from 'react-router';
import {connect} from 'react-redux';
import {IndexLinkContainer, LinkContainer} from 'react-router-bootstrap';
import {joinSocketRoom} from '../actions/roomActions';
import {logOut} from '../actions/userActions';
import NoteReducer from '../reducers/noteReducers';
import RoomReducer from '../reducers/roomReducers';
import UserReducer from '../reducers/userReducers';
import {Navbar as Navigation, Nav, NavItem, NavDropdown, MenuItem, FormGroup, FormControl, Modal, Button} from 'react-bootstrap';
import Dropdown from './sub/Dropdown2.jsx'

export class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      error: false,
      value: null
    };
  }
  // static get contextTypes() {
  //   return {
  //     router: React.PropTypes.object.isRequired,
  //   };
  // }

  logout() {
    this.props.dispatch(logOut());
  }

  showModal() {
    this.setState({show: true});
  }

  hideModal() {
    this.setState({show: false});
  }

  updateInput(e) {
    this.setState({value: e.target.value});
  }

  submitInput(e) {
    e.preventDefault();
    var realm = this;
    var pathUrl = this.state.value;
    var user = this.props.user.information[0];
    var joinedRoom = (err, success, ...args) => {
      this.setState({ show: false });
      if (err) {
        console.log(err);
      } else if (args[2] === 'lecture') {
        this.props.dispatch(push(`/lecture/${realm.state.value}`));
      } else {
        this.props.dispatch(push(`/lobby/${realm.state.value}`));
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
      <Modal show={this.state.show} bsSize="small" onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title id="modal-title">Join Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
          <form onSubmit={this.submitInput.bind(this)} className="" role="join">
            <div className="form-group form__nao">
              <span className="input input--nao">
                <input className="input__field input__field--nao" type="text" id="input-1" onChange={this.updateInput.bind(this)}/>
                <label className="input__label input__label--nao" for="input-1">
                  <span className="input__label-content input__label-content--nao">Enter Access Code</span>
                </label>
                <svg className="graphic graphic--nao" width="300%" height="100%" viewBox="0 0 1200 60" preserveAspectRatio="none">
                  <path d="M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0"/>
                </svg>
              </span>

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
    );

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
          {this.props.checkFilter() && (
            <li role="presentation">
              <Navigation.Form>
                <FormGroup>
                  <FormControl type="text" placeholder="Search" />
                </FormGroup>
              </Navigation.Form>
            </li>
            <Dropdown2 />
          )}
            <NavItem eventKey={1} onClick={this.showModal.bind(this)}>
              Join Room
            </NavItem>
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
        {modal}
      </Navigation>
    );

  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    RoomReducer,
    UserReducer,
    NoteReducer,
  };
};

export default connect(mapStateToProps)(Navbar);
