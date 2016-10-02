import React from 'react';
import { Link } from 'react-router';
import NoteList from './sub/NoteList.jsx';
import LectureTitle from './sub/LectureTitle.jsx';
import Connection from '../Connection.js';

class Review extends React.Component {
  constructor (props) {
    super(props);
  }
  render() {
    return (
      <div className="container">
        <LectureTitle />
        <NoteList />
        <div> AUDIO Component </div>
      </div>
    );
  }
}

export default Connection(Review);
