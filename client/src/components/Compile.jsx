import React from 'react';
import { Link } from 'react-router';
import Connection from '../Connection.js';
import ParticipantList from './sub/ParticipantList.jsx';
import LectureBox from './sub/LectureBox.jsx';

class Compile extends React.Component {
  constructor (props) {
    super(props);
  }
  render() {
    return (
    <div className="container-fluid">
      <div className="row">
        <h3>Select your notes</h3>
        <div> 'AUDIO COMPONENT GOES HERE '</div>
      </div>
      <div className="row">
        <div className="col-md-9">
          <LectureBox />
        </div>
        <div className="col-md-3">
          <div>SAVE BUTTON</div>
          <ParticipantList />
        </div>
      </div>
    </div>
    );
  }
}

export default Connection(Compile);
