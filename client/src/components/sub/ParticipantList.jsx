import React from 'react';
import {mapStateToProps} from '../../Connection.js';
import {connect} from 'react-redux';

class ParticipantList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: [{name: this.props.getState().user.information[0].name}]
    };
  }

  componentWillMount() {
    console.log('this.props', this.props.getState())
    var socket = this.props.getState().room.socket;

    // run action that will trigger reducer to get other users in the room
    this.props.dispatch(getParticipants())


    socket.on('new user joined room', (username) => {
      this.setState({
        participants: this.state.participants.concat([{name: username}])
      });
    })
  };

  render() {
    return (
      <div className="participants">
        {this.state.participants.map(({name}, i)=>
        <div key={i}>
          <i className="ion ion-android-person" aria-hidden="true"></i>
          <span>{name}</span>
        </div>
      )}
      </div>
    );
  }
}

export default connect(mapStateToProps)(ParticipantList);
