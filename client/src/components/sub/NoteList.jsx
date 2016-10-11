import React from 'react';
import Note from './Note.jsx';
import {addNote, replaceNotes, removeTimer, setClass} from '../../actions/noteActions.js';
import NoteReducer from '../../reducers/noteReducers';
import RoomReducer from '../../reducers/roomReducers';
import UserReducer from '../../reducers/userReducers';
import WaveformReducer from '../../reducers/waveformReducers';

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
    if (this.state.view === 'lecture') {
      this.setState({ loaded: true });
    } else if (this.state.view === 'compile') {
      this.getAllNotes(userId, roomId);
    } else if (this.state.view === 'review') {
      this.getReviewNotes(userId, roomId);
    }
  }

  sendStatus() {
    const wavePos = this.props.waveform.pos;
    const timestamps = this.props.note.audioTimestampArray;
    var actionState;
    if (this.props.waveform.playing) {
      actionState = 'playing';
    } else {
      actionState = 'paused';
    }
    for (var i = 0; i < timestamps.length; i++) {
      if (timestamps[i] > wavePos) {
        return this.props.dispatch(setClass(i, wavePos, actionState));
      }
    }
  }

  getAllNotes(userId, roomId) {
    $.ajax({
      method: 'GET',
      url: `/api/notes/${userId}/${roomId}`,
      contentType: 'application/json',
      success: (res, status) => {
        // console.log('got notes.');
        this.props.dispatch(replaceNotes(res, () => {
          this.setState({
            loaded: true
          });
        }));
        this.props.dispatch(removeTimer());
        this.sendStatus();
      },
      error: ( res, status ) => {
        console.log(res);
      }
    });
  }

  getReviewNotes(userId, roomId) {
    $.ajax({
      method: 'GET',
      url: `/api/notes/${userId}/${roomId}?filter=show`,
      success: (res, status) => {
        this.props.dispatch(replaceNotes(res, () => {
          this.setState({
            loaded: true
          });
        }));
      },
      error: (res, status) => {
        console.log(res);
      }
    });
  }

  render() {
    var roomParticipants = {};
    this.props.room.participants.forEach((participant, i) => roomParticipants[participant.id] = i);

    const showNotes = () => {
      if (this.state.view === 'compile') {
        if (this.props.tab === 'Notes') {
          return this.props.note.justNotes.map((note, i)=>{
            return (<div key={i}>
              <Note key={i} noteInfo={note} tab={this.props.tab} view={this.state.view} classColor={roomParticipants[note.originalUserId]} />
              {note.arrow ? (<div className='row'><i className={'fa ion-arrow-right-c fa-2x col-xs-1 ion-arrow-right-c'} style={{color: '#872100'}}></i></div>)
            : ('')
          }</div>); });
        } else if (this.props.tab === 'Thoughts') {
          return this.props.note.justThoughts.map((note, i)=>(
            <Note key={i} noteInfo={note} tab={this.props.tab} view={this.state.view} />
          ));
        }
      } else if (this.state.view === 'review') {
        return this.props.note.justNotes.map((note, i)=>(
          <Note key={i} noteInfo={note} view={this.state.view} />
        ))
      } else {
        return this.props.note.notes.map((note, i)=>(
          <Note key={i} noteInfo={note} view={this.state.view} />
        ));
      }
    };

    let listClass = this.state.view === 'compile' ? 'note-list compiled' : 'note-list';
    return (
      this.state.loaded ? (
      <div className={listClass}>
        {showNotes()}
      </div> ) : (<div></div>)
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    NoteReducer,
    RoomReducer,
    UserReducer,
    WaveformReducer
  };
};


export default connect(mapStateToProps)(NoteList);
