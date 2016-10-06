import React from 'react';
import Note from './Note.jsx';
import {addNote, replaceNotes} from '../../actions/noteActions.js';
import NoteReducer from '../../reducers/noteReducers';
import RoomReducer from '../../reducers/roomReducers';
import UserReducer from '../../reducers/userReducers';
import {connect} from 'react-redux';
import {getCurrentView} from '../../helpers.js';

class NoteList extends React.Component {

  constructor(props) {
    super(props);
    var pathname = props.routing.locationBeforeTransitions.pathname;
    var currentView = getCurrentView(pathname);
    this.state = {
      view: currentView,
      noteTimestampArray: null,
      loaded: false,
      currentNoteSelected: 0
    };
  }

  componentWillMount() {
    const userId = this.props.user.information[0].id;
    const roomId = this.props.room.roomInfo.id;
    if (this.props.room.socket) {
      this.props.room.socket.on('add note success', (note) => {
        this.props.dispatch(addNote(note));
      });
    }

    if (this.state.view === 'compile') {
      var context = this;
      this.getAllNotes(userId, roomId, () => {
        context.setState({
          noteTimestampArray: context.props.note.map((note) => {
            return note.audioTimestamp;
          }),
          loaded: true
        });
      });
    }

    if (this.state.view === 'review') {
      this.setState({
        loaded: true
      });
      this.getReviewNotes(userId, roomId);
    }
  }

  getAllNotes(userId, roomId, cb) {
    $.ajax({
      method: 'GET',
      url: `/api/notes/${userId}/${roomId}`,
      contentType: 'application/json',
      success: (res, status) => {
        // replace current Notes with response
        this.props.dispatch(replaceNotes(res, cb));
        // reassign with notes from server
      },
      error: ( res, status ) => {
        console.log(res);
      }
    });
  }

  getReviewNotes(userId, roomId) {
    // var context = this;
    $.ajax({
      method: 'GET',
      url: `/api/notes/${userId}/${roomId}?filter=show`,
      success: (res, status) => {
        // replace current Notes with response
        this.props.dispatch(replaceNotes(res));
        // reassign with notes from server
      },
      error: (res, status) => {
        console.log(res);
      }
    });
  }

  checkPos() {
    let nextPos = this.state.noteTimestampArray[this.state.currentNoteSelected];
    let currentPos = this.props.waveform.pos;
    if (nextPos <= currentPos) {
      return true;
    }
  }

  isHighlighted(key) {
    if (key !== this.state.currentNoteSelected) {
      return false;
    }
    if (!this.checkPos()) {
      return true;
    }
    this.setState({currentNoteSelected: this.state.currentNoteSelected + 1});
    return false;
  }

  // NEXT WE NEED TO IMPLEMENT EVENT CLICK:
  // iterate through this.state.timestamparray
  // and find a value where the waveform position is less than this.state.timestamparray[i+1] but greater than this.state.timestamparray[i]

  render() {
    return (
      this.state.loaded ? (
      <div className="note-list">
        {this.props.note.map((note, i)=>(
          <Note key={i} noteInfo={note} highlighted={this.isHighlighted.bind(this, i)} view={this.state.view} />
          )
        )}
      </div> ) : (<div></div>)
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    NoteReducer,
    RoomReducer,
    UserReducer
  };
};


export default connect(mapStateToProps)(NoteList);
