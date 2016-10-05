import React from 'react';
import {connect} from 'react-redux';
import {addParticipant, removeParticipant, readyParticipant} from '../../actions/roomActions';
import roomReducer from '../../reducers/roomReducers';
import {getCurrentView} from '../../helpers.js';

class ParticipantList extends React.Component {
  constructor(props) {
    super(props);

    let pathname = props.routing.locationBeforeTransitions.pathname;
    let currentView = getCurrentView(pathname);
    console.log(props.room.participants);
    this.state = {
      participants: props.room.participants,
      view: getCurrentView(pathname),
      readyStatusDisplay: 'none'
    };
  }

  newUserJoinedRoom(user) {
    console.log('new user joined room');
    this.props.dispatch(addParticipant(user));
  }

  userDisconnected(user) {
    console.log('a user has disconnected', user);
    this.props.dispatch(removeParticipant(user));
  }

  userReady(user) {
    console.log('a user is ready', user);
    this.props.dispatch(readyParticipant(user));
  }

  componentWillMount() {
    const socket = this.props.room.socket;
    if (socket) {
      socket.on('new user joined room', this.newUserJoinedRoom.bind(this));
      socket.on('user disconnected', this.userDisconnected.bind(this));
      socket.on('user ready', this.userReady.bind(this));
    }

    if (this.state.view === 'lecture') {
      this.state.readyStatusDisplay = 'inline-block';
    }
  }

  componentWillUnmount() {

    console.log('unmounting participant component');
    const socket = this.props.room.socket;
    if (socket) {
      socket.removeListener('new user joined room');
      socket.removeListener('user disconnected');
      socket.removeListener('user ready');
    }
  }

  render() {
    console.log(this.props);
    var participantLength = this.props.room.participants.length;
    var classColor = (i) => 'participant' + i;
    return (
      <div className="participants">
        <h4>
          Participants ({participantLength}/10)
        </h4>
        {this.props.room.participants.map(({name, readyStatus}, i) =>
        <div key={i}>
          <i className={`ion ion-android-person ${classColor(`${i}`)}`} aria-hidden="true"></i>
          <span>{name}</span>&nbsp;
          <span className={`btn-ready ${classColor(`${i}`)}`} style={{display: this.state.readyStatusDisplay}}>{readyStatus ? 'Ready' : 'Not Ready'}</span>
        </div>)}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    roomReducer
  };
};

export default connect(mapStateToProps)(ParticipantList);
