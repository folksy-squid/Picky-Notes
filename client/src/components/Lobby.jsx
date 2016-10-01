import React from 'react';
import { Link } from 'react-router';
import LectureTitle from './sub/LectureTitle.jsx';
import ParticipantList from './sub/ParticipantList.jsx';
import ChatBox from './sub/ChatBox.jsx';
import {mapStateToProps} from '../Connection.js';
import {connect} from 'react-redux';
import {joinSocketRoom} from '../actions/roomActions';
import {Router} from 'react-router';


class Lobby extends React.Component {
  constructor(props) {
    super(props);
    // console.log(props);
    var context = this;

    (!props.getState().user) && context.context.router.push('/');
    var pathUrl = props.getState().room.roomInfo ? props.getState().room.roomInfo.pathUrl : props.params.roomId;
    this.state = {
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
    if (!this.props.getState().room.roomInfo) {
      console.log('you have no room info');
      this.setState({completed: false});
      this.props.dispatch(joinSocketRoom(this.state.pathUrl, this.props.getState().user.information[0], () => { this.setState({completed: true }); }));
    }
  }

  componentDidMount() {
    new Clipboard(this.refs.copyButton, {
      text: (trigger) => {
        return this.refs.shareLink.innerText;
      }
    });
  }

  startLecture() {
    this.props.getState().room.socket.emit('lecture start');
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
          <div className="col-sm-3">
            {/*<button className="btn btn-lg btn-success" onClick={this.startLecture.bind(this)}>
              Start Lecture
            </button>*/}
            <Link className="btn btn-lg btn-success" to="/lecture">
              Start Lecture
            </Link>
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
    ) : <div></div>
    );
  }
}

export default connect(mapStateToProps)(Lobby);
