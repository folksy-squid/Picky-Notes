import React from 'react';
import { Link } from 'react-router';
import {connect} from 'react-redux';
import LectureTitle from './sub/LectureTitle.jsx';
import LectureBox from './sub/LectureBox.jsx';
import ParticipantList from './sub/ParticipantList.jsx';
import RoomReducer from '../reducers/roomReducers';
import {stopRecording} from '../actions/roomActions';
import UserReducer from '../reducers/userReducers';

class Lecture extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      readyButtonDisplay: 'none',
      endLectureDisplay: 'inline-block',
      isHost: false,
    };
  }

  static get contextTypes() {
    return {
      router: React.PropTypes.object.isRequired,
    };
  }

  componentDidMount() {
    this.checkHost();

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
    socket.on('user disconnected', this.checkHost.bind(this));
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
            <ParticipantList />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    RoomReducer,
    UserReducer
  };
};

export default connect(mapStateToProps)(Lecture);
