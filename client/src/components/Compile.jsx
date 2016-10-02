import React from 'react';
import { Link } from 'react-router';
import Connection from '../Connection.js';
import ParticipantList from './sub/ParticipantList.jsx';
import LectureBox from './sub/LectureBox.jsx';

class Compile extends React.Component {
  constructor (props) {
    super(props);
  }

  static get contextTypes() {
    return {
      router: React.PropTypes.object.isRequired,
    };
  }

  reviewNotesHandler() {
    let changedNotes = this.props.getState().note.filter(note => note.changed);
    changedNotes = JSON.parse(JSON.stringify(changedNotes));
    changedNotes = changedNotes.map(note => {
      delete note.changed;
      return note;
    });

    $.ajax({
      method: 'PUT',
      url: '/api/notes/:userId/:roomId',
      contentType: 'application/json',
      data: JSON.stringify(changedNotes),
      success: (res) => {
        console.log(res);
        this.context.router.push('/review');
      },
      error: (error) => console.log('Error updating changed notes', error),
    });
  }

  render() {
    return (
    <div className="container-fluid">
      <div className="row">
        <h3>Edit Notes</h3>
        <div> 'AUDIO COMPONENT GOES HERE '</div>
      </div>
      <div className="row">
        <div className="col-md-9">
          <LectureBox />
        </div>
        <div className="col-md-3">
          <button className="btn btn-lg btn-success" onClick={this.reviewNotesHandler.bind(this)}>Review</button>
          <ParticipantList />
        </div>
      </div>
    </div>
    );
  }
}

export default Connection(Compile);
