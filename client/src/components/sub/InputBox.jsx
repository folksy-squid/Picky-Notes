import React from 'react';
import {connect} from 'react-redux';
import {addNote, submitNote} from '../../actions/noteActions.js';
import NoteReducer from '../../reducers/noteReducers';
import RoomReducer from '../../reducers/roomReducers';

class InputBox extends React.Component {
  constructor (props) {
    super(props);
  }

  submitNoteHandler(e) {
    e.preventDefault();
    console.log('i am trying to get something to work');
    if (this.refs.inputNote.value.trim().length === 0) { return; }
    this.props.dispatch(submitNote(this.props.room.socket, this.refs.inputNote.value));
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

const mapStateToProps = (state) => {
  return {
    ...state,
    NoteReducer,
    RoomReducer
  }
};

export default connect(mapStateToProps)(InputBox);
