import React from 'react';
import { Link } from 'react-router';

const class Lecture extends React.Component {
  constructor (props) {
    super(props)
  }
  render(){
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-9">
            <LectureTitle />
          </div>
          <div className="col-md-3">
            END LECTURE BUTTON
          </div>
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
    )
  }
}

export default Lecture;