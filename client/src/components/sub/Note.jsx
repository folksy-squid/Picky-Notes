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

  selectNote(e) {
    console.log(this.refs.checkbox.checked);
  }

  render() {
    var view;

    //props.page will be obtained from redux store.
    if (this.props.view === 'compile') {
      view = (
        <div className="note">
          <input type="checkbox" ref="checkbox" onChange={this.selectNote.bind(this)}/>
          <span className="content">{this.props.note.content}</span>
          <span className="audioTimestamp">{this.props.note.audioTimestamp}</span>
        </div>
      );
    } else if (this.props.view === 'lecture') {
      view = (
        <div className="note">
          <span className="content">{this.props.note.content}</span>
          <span className="audioTimestamp">{this.props.note.audioTimestamp}</span>
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
