import React from 'react';
import {mapStateToProps} from '../../Connection.js';
import {connect} from 'react-redux';

class ParticipantList extends React.Component {
  constructor(props) {
    super(props);
    var getCurrentView = function(){
      var pathname = props.getState().routing.locationBeforeTransitions.pathname.slice(0, 6);
      if (pathname === "/lobby") {
        return 'lobby';
      } else if (pathname === "/lectu") {
        return 'lecture';
      } else if (pathname === "/compi") {
        return 'compile';
      }
    };

    this.state = {
      participants: props.getState().room.participants || [props.getState().user.information[0]],
      view: getCurrentView()
    };
  }

  componentWillMount() {
    console.log('this.props', this.props);
    console.log('this.props state', this.props.getState());
    var socket = this.props.getState().room.socket;
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
    var classColor = (i) => 'participant'+i;
    return (
      <div className="participants">
        <h4>
          Participants ({participantLength}/10)
        </h4>
        {this.state.participants.map(({name}, i)=>
        <div key={i}>
          <i className="ion ion-android-person {classColor(i)}" aria-hidden="true"></i>
          <span>{name}</span>
        </div>
      )}
      </div>
    );
  }
}

export default connect(mapStateToProps)(ParticipantList);
