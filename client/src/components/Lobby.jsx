import React from 'react';
import { Link } from 'react-router';
import LectureTitle from './sub/LectureTitle.jsx';
import ParticipantList from './sub/ParticipantList.jsx';

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);
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
            <div className="clipboard">
              <input ref="shareLink" className="shareLink" value="https://github.com/zenorocha/clipboard.js.git" readOnly/>
              <div className="buttonCell">
                <button ref="copyButton" className="copyButton" data-clipboard-target=".shareLink">
                  <i className="ion ion-clipboard"></i>
                </button>
              </div>
            </div>
            <ParticipantList />
          </div>
        </div>
      </div>
    );
  }
}
