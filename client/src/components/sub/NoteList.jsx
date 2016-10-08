import React from 'react';
import Note from './Note.jsx';
import {addNote, replaceNotes, removeTimer, setTimer} from '../../actions/noteActions.js';
import NoteReducer from '../../reducers/noteReducers';
import RoomReducer from '../../reducers/roomReducers';
import UserReducer from '../../reducers/userReducers';
import {connect} from 'react-redux';
import {getCurrentView} from '../../helpers.js';

class NoteList extends React.Component {

  constructor(props) {
    super(props);
    console.log('notelistprops', props);
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
      this.getAllNotes(userId, roomId);
    }

    if (this.state.view === 'review') {
      this.getReviewNotes(userId, roomId);
    }
  }

  getAllNotes(userId, roomId) {
    $.ajax({
      method: 'GET',
      url: `/api/notes/${userId}/${roomId}`,
      contentType: 'application/json',
      success: (res, status) => {
        // replace current Notes with response
        console.log('got notes.');
        this.props.dispatch(replaceNotes(res, () => {
          console.log('getting all notes');
          this.setState({
            loaded: true
          });
        }));
        this.props.dispatch(removeTimer());
        setTimeout(() => {
          console.log('setting a new timer');
          let timestamps = this.props.note.audioTimestampArray;
          let wavePos = this.props.waveform.pos;
          for (var i = 0; i < timestamps.length; i++) {
            if (timestamps[i] > wavePos) {
              console.log('this is the next timestamp', timestamps[i]);
              return this.props.dispatch(setTimer(i, wavePos));
            }
          }
        }, 10);
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
        this.props.dispatch(replaceNotes(res, () => {
          console.log('getting all notes');
          this.setState({
            loaded: true
          });
        }));
        // reassign with notes from server
      },
      error: (res, status) => {
        console.log(res);
      }
    });
  }


  // <Note key={i} noteInfo={note} {this.ishighlighted.bind(this, i) && highlighted="true"} view={this.state.view} />

  render() {
    let listClass = this.state.view === 'compile' ? 'note-list compiled' : 'note-list';
    return (
      this.state.loaded ? (
      <div className={listClass}>
        {this.props.note.notes.map((note, i)=>(
            <Note key={i} noteInfo={note} view={this.state.view} />
        ))}
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
