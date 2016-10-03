import React from 'react';
import Connection from '../../Connection.js';
import {selectNote} from '../../actions/noteActions.js';

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

  selectNoteHandler(e) {
    this.props.dispatch(selectNote(this.props.note.id));
    this.forceUpdate();
  }

  render() {
    var view;

    //props.page will be obtained from redux store.
    if (this.props.view === 'compile') {
      view = (
        <div className="note">
          <input type="checkbox" ref="checkbox" onChange={this.selectNoteHandler.bind(this)} checked={this.props.note.show}/>
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
          <i className="fa fa-play-circle" aria-hidden="true"></i>
          {this.props.note.content}
        </div>
      );
    }

    return view;
  }
}


export default Connection(Note);
