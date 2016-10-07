import React from 'react';
import { Link, Router } from 'react-router';
import LectureTitle from './sub/LectureTitle.jsx';
import ParticipantList from './sub/ParticipantList.jsx';
import ChatBox from './sub/ChatBox.jsx';
import {connect} from 'react-redux';
import roomReducer from '../reducers/roomReducers';
import {joinSocketRoom, createAudioStream, startRecording, setRoomInfo} from '../actions/roomActions';
import ShareLink from './sub/ShareLink.jsx';

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    (!props.user) && this.context.router.push('/');
    var pathUrl = props.room.roomInfo ? props.room.roomInfo.pathUrl : props.params.roomId;
    this.state = {
      isHost: false,
      pathUrl: pathUrl,
      completed: true,
      error: '',
    };
  }
  static get contextTypes() {
    return {
      router: React.PropTypes.object.isRequired,
    };
  }

  componentWillMount() {
    // join the socket if there is no room info
    const user = this.props.user.information[0];
    const pathUrl = this.props.params.roomId;
    if (!this.props.room.roomInfo) {
      this.setState({completed: false});
      this.props.dispatch(setRoomInfo(pathUrl, user, (err, success) => {
        if (err) {
          return this.context.router.push('/notebook');
        } 
        this.props.dispatch(joinSocketRoom(pathUrl, user, (error, ...args) => {
          if (error) {
            return this.setState({error});
          }
          if (args[3] === 'lecture') {
            return this.context.router.push(`/lecture/${pathUrl}`);
          }
          this.setState({completed: true});
          this.checkHost();
          this.applyListeners();
          this.props.room.socket.on('old notes', (notes) => {
            this.props.dispatch(replaceNotes(notes));
          });
          this.props.room.socket.emit('user reconnect');
        }));
      }));
    } else {
      this.checkHost();
      this.applyListeners();
    }

  }

  checkHost() {
    let host = this.props.room.participants[0];
    let user = this.props.user.information[0];
    if (host.id === user.id) {
      // switch host status to user
      this.setState({isHost: true});
      // and switch audio stream to host
      this.props.dispatch(createAudioStream());
    }
  }

  applyListeners() {
    const socket = this.props.room.socket;
    socket.on('lecture started', this.goToLecture.bind(this));
  }

  startLecture() {
    this.props.room.socket.emit('lecture start');
    // start streaming recorded audio
    this.props.dispatch(startRecording());
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
            <ChatBox />
          </div>
          <div className="col-sm-3 panel">
          { this.state.isHost && (
            <button className="btn btn-lg btn-success" onClick={this.startLecture.bind(this)}>
              Start Lecture
            </button>)}
            <div className="panel-item">
              <ShareLink pathUrl={this.state.pathUrl}/>
            </div>
            <div className="panel-item">
              <ParticipantList checkHostLobby={this.checkHost.bind(this)}/>
            </div>
          </div>
        </div>
      </div>
    ) : (<h2>{this.state.error}</h2>)
  );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    roomReducer
  };
};

export default connect(mapStateToProps)(Lobby);
