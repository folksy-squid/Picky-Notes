import React from 'react';
import Connection from '../../Connection.js';
import {addNote, submitNote} from '../../actions/noteActions.js';

class InputBox extends React.Component {
  constructor (props) {
    super(props);
  }

  submitNoteHandler(e) {
    e.preventDefault();
    if (this.refs.inputNote.value.length === 0) { return; }
      this.props.dispatch(submitNote(this.props.getState().room.socket, this.refs.inputNote.value));
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
      view = <form onSubmit={this.submitNoteHandler.bind(this)}><input ref="inputNote" type="text"/></form>;
    }

    return view;
  }
}

export default Connection(InputBox);
