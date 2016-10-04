import React from 'react';
import { Link, Router } from 'react-router';
import LectureTitle from './sub/LectureTitle.jsx';
import ParticipantList from './sub/ParticipantList.jsx';
import ChatBox from './sub/ChatBox.jsx';
import {mapStateToProps} from '../Connection.js';
import {connect} from 'react-redux';
import {joinSocketRoom} from '../actions/roomActions';

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    (!props.getState().user) && this.context.router.push('/');
    var pathUrl = props.getState().room.roomInfo ? props.getState().room.roomInfo.pathUrl : props.params.roomId;
    this.state = {
      isHost: false,
      pathUrl: pathUrl,
      completed: true
    };
  }
  static get contextTypes() {
    return {
      router: React.PropTypes.object.isRequired,
    };
  }

  componentWillMount() {

    // join the socket if there is no room info
    if (!this.props.getState().room.roomInfo) {
      console.log('you have no room info');
      this.setState({completed: false});
      this.props.dispatch(joinSocketRoom(this.state.pathUrl, this.props.getState().user.information[0], () => { this.setState({completed: true }); }));
    }

  }

  checkHost() {
    let host = this.props.getState().room.participants[0];
    let user = this.props.getState().user.information[0];
    host.id === user.id && this.setState({isHost: true});
  }

  componentDidMount() {
    new Clipboard(this.refs.copyButton, {
      text: (trigger) => {
        return this.refs.shareLink.innerText;
      }
    });
    this.checkHost();
    var socket = this.props.getState().room.socket;
    socket.on('lecture started', this.goToLecture.bind(this));
    socket.on('user disconnected', this.checkHost.bind(this));
  }

  startLecture() {
    this.props.getState().room.socket.emit('lecture start');
  }

  goToLecture() {
    this.context.router.push(`/lecture/${this.state.pathUrl}`);
  }

  noSuchLobby() {
    // redirect to '404' page.
  }

  render() {
    return (
        this.state.completed ? (
      <div className="container lobby">
        <LectureTitle />
        <div className="row">
          <div className="col-sm-9">
            <ChatBox socket={this.props.getState().room.socket}/>
          </div>
          <div className="col-sm-3">
          { this.state.isHost && (
            <button className="btn btn-lg btn-success" onClick={this.startLecture.bind(this)}>
              Start Lecture
            </button>)}
            <div className="panel-item">
              <div className="clipboard">
                <input ref="shareLink" className="shareLink" value={this.state.pathUrl} readOnly/>
                <div className="buttonCell">
                  <button ref="copyButton" className="copyButton" data-clipboard-target=".shareLink">
                    <i className="ion ion-clipboard"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="panel-item">
              <ParticipantList />
            </div>
          </div>
        </div>
      </div>
    ) : (<div></div>)
  );
  }
}

export default connect(mapStateToProps)(Lobby);
