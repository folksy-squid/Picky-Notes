import React from 'react';
import { Link } from 'react-router';
import Connection from '../Connection.js'
import ParticipantList from './ParticipantList.jsx'
import LectureBox from './sub/LectureBox.jsx'

class Compile extends React.Component {
  constructor (props) {
    super(props)
  }
  render(){
    return (
    <div class="container-fluid">
      <div class="row">
        <h3>Select your notes</h3>
        <div> 'AUDIO COMPONENT GOES HERE '</div>
      </div>
      <div class="row">
        <div class="col-md-9">
          <LectureBox />
        </div>
        <div class="col-md-3">
          <div>SAVE BUTTON</div>
          <ParticipantList />
        </div>
      </div>
    </div>
    )
  }
}

export default Connection(Compile);