import React from 'react';
import {connect} from 'react-redux';
import {addNote, submitNote} from '../../actions/noteActions.js';
import NoteReducer from '../../reducers/noteReducers';
import RoomReducer from '../../reducers/roomReducers';
import {getCurrentView} from '../../helpers.js';

class InputBox extends React.Component {
  constructor (props) {
    super(props);
  }

  keyDownHandler(e) {
    if (e.shiftKey && e.keyCode === 13) {
      this.submitNoteHandler(e, true);
    } else if (e.keyCode === 13) {
      this.submitNoteHandler(e, false);
    }
  }

  submitNoteHandler(e, thought) {
    e.preventDefault();
    if (this.refs.inputNote.value.trim() === '') { return; }

    if (getCurrentView(this.props.routing.locationBeforeTransitions.pathname) === 'compile') {
      let note = {
        content: this.refs.inputNote.value,
        originalUserId: this.props.user.information[0].id,
        roomId: this.props.room.roomInfo.id,
        audioTimestamp: ~~(this.props.waveform.pos * 1000),
        thought: thought
      };
      $.ajax({
        method: 'POST',
        url: '/api/notes/create',
        contentType: 'application/json',
        data: JSON.stringify(note),
        success: (savedNote) => {
          console.log(savedNote);
          this.props.dispatch(addNote(savedNote));
          this.refs.inputNote.value = '';
        },
        error: console.log.bind(this)
      });
      return;
    }

    this.props.dispatch(submitNote(this.props.room.socket, this.refs.inputNote.value, thought));
    this.refs.inputNote.value = '';
  }

  // view will alter depending on the page it's on.
  render() {
    var view;
    if (this.props.page === 'compile') {
      view = (
        <input>
          'this is the input box for Compile'
        </input>
      );
    } else {
      view = <form id="lectureForm" ><input ref="inputNote" id="lectureInput" type="text" onKeyDown={this.keyDownHandler.bind(this)} /></form>;
    }

    return view;
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    NoteReducer,
    RoomReducer
  }
};

export default connect(mapStateToProps)(InputBox);
