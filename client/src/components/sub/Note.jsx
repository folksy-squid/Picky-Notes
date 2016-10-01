import React from 'react';
import Connection from '../../Connection.js';

class Note extends React.Component {
  constructor(props) {
    super(props);
  }

  saveNote(note) {
    // this can be invoked when in the compiled view
    // send it to the redis cache
  }

  playNote(note) {
    // this can be invoked when in the review view
  }

  render() {
    var view;

    //props.page will be obtained from redux store.
    if (this.props.view === 'compile') {
      view = (
        <div className="note">
          {this.props.note.content + ' ' + this.props.note.audioTimestamp + ' ' + this.props.view}
        </div>
      );
    } else if (this.props.view === 'lecture') {
      view = (
        <div className="note">
          {this.props.note.content + ' ' + this.props.note.audioTimestamp + ' ' + this.props.view}
        </div>);
    } else if (this.props.view === 'review') {
      view = (
        <div className="note">
          'this is a note in review'{/*this.props.note*/}
        </div>
      );
    }

    return view;
  }
}


export default Connection(Note);
