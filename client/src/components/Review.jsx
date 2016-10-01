import React from 'react';
import { Link } from 'react-router';
import NoteList from './sub/NoteList.jsx';
import LectureTitle from './sub/LectureTitle.jsx';
import Connection from '../Connection.js';

class Review extends React.Component {
  constructor (props) {
    super(props);
  }

  goToCompiledView() {

  }

  render() {
    return (
      <div className="container">
        <LectureTitle />
        <NoteList />
        <div> AUDIO Component </div>
        <button className="btn btn-lg btn-primary">
          Add / Edit Notes
        </button>
      </div>
    );
  }
}

export default Connection(Review);
