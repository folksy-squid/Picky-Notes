import React from 'react';
import {connect} from 'react-redux';
import {addNote, submitNote, setArrow, removeArrow, getWavePos} from '../../actions/noteActions.js';
import NoteReducer from '../../reducers/noteReducers';
import RoomReducer from '../../reducers/roomReducers';
import {getCurrentView} from '../../helpers.js';

class InputBox extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      insertPos: 0,
      showInsertPos: false,
    };
  }

  keyUpHandler(e) {
    if (e.target.value.trim() !== '' && !this.state.showInsertPos) {
      if (this.props.note.waveform) {
        let insertPos = this.props.note.waveform.getCurrentTime() || 0;
        let timestamps = this.props.note.audioTimestampArray;
        this.setState({ showInsertPos: true, insertPos });

        for (var i = 0; i < timestamps.length; i++) {
          if (timestamps[i] > insertPos) {
            return this.props.dispatch(setArrow(i - 1));
          }
        }

        return this.props.dispatch(setArrow(this.props.note.audioTimestampArray.length - 1));
      }
    } else if (e.target.value.trim() === '' && this.state.showInsertPos) {
      this.props.dispatch(removeArrow());
      this.setState({ showInsertPos: false });
    }
    if (e.keyCode === 13) {
      this.submitNoteHandler(e, e.shiftKey);
    }
  }

  submitNoteHandler(e, thought) {
    if (this.refs.inputNote.value.trim() === '') { return; }

    if (getCurrentView(this.props.routing.locationBeforeTransitions.pathname) === 'compile') {
      let note = {
        content: this.refs.inputNote.value,
        originalUserId: this.props.user.information[0].id,
        roomId: this.props.room.roomInfo.id,
        audioTimestamp: ~~(this.state.insertPos * 1000),
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
          this.props.dispatch(removeArrow());
          this.refs.inputNote.value = '';
          this.setState({ showInsertPos: false });
        },
        error: console.log.bind(this)
      });
      return;
    }

    this.props.dispatch(submitNote(this.props.room.socket, this.refs.inputNote.value, thought));
    this.refs.inputNote.value = '';
  }

  formatTime(decimalSeconds) {
    let seconds = ~~decimalSeconds;
    let minutes = ~~(seconds / 60);
    let hours = ~~(minutes / 60);
    seconds = seconds % 60;
    minutes = minutes % 60;

    let time = hours ? hours + ':' : '';
    time += minutes < 10 ? '0' + minutes + ':' : minutes + ':';
    time += seconds < 10 ? '0' + seconds : seconds;

    return time;
  }

  // view will alter depending on the page it's on.
  render() {
    if (getCurrentView(this.props.routing.locationBeforeTransitions.pathname) === 'compile') {
      return (
        <span className="compileForm" >
          <i className='ion ion-arrow-right-c fa-2x inputArrow' style={{ color: '#872100' }}></i>
          <input ref="inputNote" className="compileInput" type="text" onKeyUp={this.keyUpHandler.bind(this)} autoFocus/>
          {this.state.showInsertPos && <span className="insertTimestamp">{this.formatTime(this.state.insertPos)}</span>}
        </span>
      );
    }

    return (
      <span className="lectureForm" >
        <input ref="inputNote" className="lectureInput" type="text" onKeyUp={this.keyUpHandler.bind(this)} autoFocus/>
      </span>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    NoteReducer,
    RoomReducer,
  };
};

export default connect(mapStateToProps)(InputBox);
