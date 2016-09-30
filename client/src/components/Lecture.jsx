import React from 'react';
import { Link } from 'react-router';
import Connection from '../Connection.js';
import LectureTitle from './sub/LectureTitle.jsx';
import LectureBox from './sub/LectureBox.jsx';
import ParticipantList from './sub/ParticipantList.jsx';

class Lecture extends React.Component {
  constructor (props) {
    super(props);
  }
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-9">
            <LectureTitle />
          </div>
          <Link className="btn btn-lg btn-danger" to="/compile">
            End Lecture
          </Link>
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
