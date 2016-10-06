import React from 'react';
import { Link } from 'react-router';
import {connect} from 'react-redux';
import LectureTitle from './sub/LectureTitle.jsx';
import LectureBox from './sub/LectureBox.jsx';
import ParticipantList from './sub/ParticipantList.jsx';
import RoomReducer from '../reducers/roomReducers';
import {stopRecording, setRoomInfo, joinSocketRoom} from '../actions/roomActions';
import UserReducer from '../reducers/userReducers';
import {replaceNotes} from '../actions/noteActions';
import NoteReducer from '../reducers/noteReducers';

class Lecture extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      readyButtonDisplay: 'none',
      endLectureDisplay: 'inline-block',
      isHost: false,
      loaded: true,
      error: ''
    };
  }

  static get contextTypes() {
    return {
      router: React.PropTypes.object.isRequired,
    };
  }

  componentWillMount() {
    const user = this.props.user.information[0];
    const pathUrl = this.props.params.roomId;
    this.props.dispatch(replaceNotes([]));

    if (!this.props.room.roomInfo) {
      this.setState({loaded: false});
      this.props.dispatch(setRoomInfo(pathUrl, user, (err, success) => {
        if (err) {
          this.context.router.push('/notebook');
        } else {
          // join socket room
          this.props.dispatch(joinSocketRoom(pathUrl, user, (error) => {
            if (error) {
              return this.setState({error});
            }
            this.setState({loaded: true});
            this.checkHost();
            this.applyListeners();
            this.props.room.socket.on('old notes', (notes) => {
              this.props.dispatch(replaceNotes(notes));
            });
            this.props.room.socket.emit('user reconnect');
          }));
        }
      }));
    } else {
      this.checkHost();
      this.applyListeners();
    }
  }

  applyListeners() {
    var socket = this.props.room.socket;
    socket.on('lecture ended', () => {
      this.setState({readyButtonDisplay: 'inline-block'});
    });
    
    socket.on('all ready', () => {
      // loading page
    });

    socket.on('all notes saved', () => {
      // redirect to compile view
      this.context.router.push(`/compile/${this.props.room.roomInfo.pathUrl}`);
    });
  }

  componentDidMount() {
    this.props.room.socket && this.applyListeners();
  }

  checkHost() {
    let host = this.props.room.participants[0];
    let user = this.props.user.information[0];
    host.id === user.id && this.setState({isHost: true});
  }

  sendReady() {
    this.props.room.socket.emit('user ready');
    this.setState({readyButtonDisplay: 'none'});
  }

  endLecture() {
    this.props.room.socket.emit('lecture end');
    this.setState({endLectureDisplay: 'none'});
    this.props.dispatch(stopRecording());
  }

  render() {
    return (
      this.state.loaded ? (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-9">
            <LectureTitle />
          </div>
          {this.state.isHost && (<button className="btn btn-lg btn-danger" style={{display: this.state.endLectureDisplay}} onClick={this.endLecture.bind(this)}>
            End Lecture
          </button>)}
          <button className="btn btn-lg btn-success" style={{display: this.state.readyButtonDisplay}} onClick={this.sendReady.bind(this)}>
            Ready
          </button>
        </div>
        <div className="row">
          <div className="col-md-9">
            <LectureBox />
          </div>
          <div className="col-md-3">
            <ParticipantList checkHost={this.checkHost.bind(this)}/>
          </div>
        </div>
      </div>) : (<h2>{this.state.error}</h2>)
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

export default connect(mapStateToProps)(Lecture);
