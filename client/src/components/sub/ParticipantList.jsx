import React from 'react';
import {mapStateToProps} from '../../Connection.js';
import {connect} from 'react-redux';
import {addParticipant, removeParticipant, readyParticipant} from '../../actions/roomActions';
import {getCurrentView} from '../../helpers.js';

class ParticipantList extends React.Component {
  constructor(props) {
    super(props);

    let pathname = props.getState().routing.locationBeforeTransitions.pathname;
    let currentView = getCurrentView(pathname);

    this.state = {
      participants: props.getState().room.participants,
      view: getCurrentView(pathname),
      readyStatusDisplay: 'none'
    };
  }

  newUserJoinedRoom(user) {
    console.log('new user joined room');
    this.props.dispatch(addParticipant(user));
    this.setState({participants: this.props.getState().room.participants});
  }

  userDisconnected(user) {
    console.log('a user has disconnected', user);
    this.props.dispatch(removeParticipant(user));
    this.setState({participants: this.props.getState().room.participants});
  }

  userReady(user) {
    console.log('a user is ready', user);
    this.props.dispatch(readyParticipant(user));
    this.setState({participants: this.props.getState().room.participants});
  }

  componentWillMount() {
    var socket = this.props.getState().room.socket;

    socket.on('new user joined room', this.newUserJoinedRoom.bind(this));
    socket.on('user disconnected', this.userDisconnected.bind(this));
    socket.on('user ready', this.userReady.bind(this));

    if (this.state.view === 'lecture') {
      this.state.readyStatusDisplay = 'inline-block';
    }
  }

  componentWillUnmount() {
    console.log('unmounting this component', this.newUserJoinedRoom);
    var socket = this.props.getState().room.socket;
    socket.removeListener('new user joined room', this.newUserJoinedRoom);
    socket.removeListener('user disconnected', this.userDisconnected);
    socket.removeListener('user ready', this.userReady);
  }

  render() {
    var participantLength = this.state.participants.length;
    var classColor = (i) => 'participant' + i;
    return (
      <div className="participants">
        <h4>
          Participants ({participantLength}/10)
        </h4>
        {this.state.participants.map(({name, readyStatus}, i) =>
        <div key={i}>
          <i className="ion ion-android-person {classColor({i})}" aria-hidden="true"></i>
          <span>{name}</span>&nbsp;
          <span className='btn-ready' style={{display: this.state.readyStatusDisplay}}>{readyStatus ? 'Ready' : 'Not Ready'}</span>
        </div>)}
      </div>
    );
  }
}

export default connect(mapStateToProps)(ParticipantList);
