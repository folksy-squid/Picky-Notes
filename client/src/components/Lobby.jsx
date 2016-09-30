import React from 'react';
import { Link } from 'react-router';
import LectureTitle from './sub/LectureTitle.jsx';
import ParticipantList from './sub/ParticipantList.jsx';
import ChatBox from './sub/ChatBox.jsx'
import Connection from '../Connection.js'

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      pathUrl: props.getState().room.roomInfo.pathUrl
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
    new Clipboard(this.refs.copyButton, {
      text: (trigger) => {
        return this.refs.shareLink.innerText;
      }
    });
  }

  // componentWillUnmount() {
  //   this.socket.disconnect();
  // }

  render() {
    return (
      <div className="container lobby">
        <LectureTitle />
        <div className="row">
          <div className="col-sm-9">
            <ChatBox />
          </div>
          <div className="col-sm-3">
            <button className="btn btn-lg btn-success">
              Start Lecture
            </button>
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
    );
  }
}

export default Connection(Lobby);
