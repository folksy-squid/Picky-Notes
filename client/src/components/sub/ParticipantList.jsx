import React from 'react';
import {mapStateToProps} from '../../Connection.js';
import {connect} from 'react-redux';
import {addParticipant, removeParticipant, readyParticipant} from '../../actions/roomActions';
import {getCurrentView} from '../../helpers.js';

var getCurrentView = function(pathname) {
  if (pathname === '/lobby') {
    return 'lobby';
  } else if (pathname === '/lectu') {
    return 'lecture';
  } else if (pathname === '/compi') {
    return 'compile';
  }
};


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

  componentWillMount() {
    // console.log('this.props', this.props);
    // console.log('this.props state', this.props.getState());
    var socket = this.props.getState().room.socket;

    socket.on('new user joined room', (user) => {
      console.log('new user joined room');
      this.props.dispatch(addParticipant(user));
      this.setState({participants: this.props.getState().room.participants});
    });
    socket.on('user disconnected', (user) => {
      console.log('a user has disconnected', user);
      this.props.dispatch(removeParticipant(user));
      this.setState({participants: this.props.getState().room.participants});
    });

    socket.on('user ready', (user) => {
      console.log('a user is ready', user);
      this.props.dispatch(readyParticipant(user));
      this.setState({participants: this.props.getState().room.participants});
    });

    if (this.state.view === 'lecture') {
      this.state.readyStatusDisplay = 'inline-block';
    }
    // var participants = this.props.getState().room.participants;
    // this.setState({
    //   participants: participants
    // })

    // socket.on('new user joined room', (user) => {
    //   this.setState({
    //     participants: this.state.participants.concat([user])
    //   });
    // });
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
