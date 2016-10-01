import React from 'react';
import { Link } from 'react-router';
import Connection from '../Connection.js';
import LectureTitle from './sub/LectureTitle.jsx';
import LectureBox from './sub/LectureBox.jsx';
import ParticipantList from './sub/ParticipantList.jsx';

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

    var socket = this.props.getState().room.socket;
    socket.on('lecture ended', () => {
      this.setState({readyButtonDisplay: 'inline-block'});
    });
    socket.on('all ready', () => {
      // loading
      console.log('user is ready');
    });

    socket.on('all notes saved', () => {
      // redirect to compile view
      this.context.router.push(`/compile/${this.props.getState().room.roomInfo.pathUrl}`);
    });
    socket.on('user disconnected', this.checkHost.bind(this));
  }

  checkHost() {
    let host = this.props.getState().room.participants[0];
    let user = this.props.getState().user.information[0];
    host.id === user.id && this.setState({isHost: true});
  }

  sendReady() {
    this.props.getState().room.socket.emit('user ready');
    this.setState({readyButtonDisplay: 'none'});
  }

  endLecture() {
    this.setState({endLectureDisplay: 'none'});
    this.props.getState().room.socket.emit('lecture end');
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

export default Connection(Lecture);
