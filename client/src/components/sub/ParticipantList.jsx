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
    this.state = {
      view: getCurrentView(pathname),
      readyStatusDisplay: 'none'
    };
  }

  newUserJoinedRoom(user) {
    this.props.dispatch(addParticipant(user));
  }

  userDisconnected(user) {
    this.props.dispatch(removeParticipant(user));
  }

  userReady(user) {
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
      socket.on('user disconnected', this.props.checkHostLecture);

    } else if (this.state.view === 'lobby') {
      socket.on('user disconnected', this.props.checkHostLobby);
    }
  }

  componentWillUnmount() {
    console.log('unmounting')
    const socket = this.props.room.socket;
    if (socket) {
      socket.removeListener('new user joined room');
      socket.removeListener('user disconnected');
      socket.removeListener('user ready');
      this.state.view === 'lobby' && socket.removeListener('user disconnected', this.props.checkHostLobby);
    }
  }

  render() {
    var participantLength = this.props.room.participants.length;
    var classColor = (i) => 'participant' + i;
    return (
      <div className="participants">
        <h4>
          Participants ({participantLength}/10)
        </h4>
        {this.props.room.participants.map(({name, readyStatus}, i) =>
        <div key={i}>
          <i className={`fa fa-user ${classColor(`${i}`)}`} aria-hidden="true"></i>
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
