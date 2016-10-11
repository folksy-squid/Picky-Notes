import React from 'react';
import {connect} from 'react-redux';
import {addNote, submitNote} from '../../actions/noteActions.js';
import NoteReducer from '../../reducers/noteReducers';
import RoomReducer from '../../reducers/roomReducers';
import {getCurrentView} from '../../helpers.js';

class InputBox extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      timestamp: 0,
      stopTimestamp: false,
    };
  }

  keyUpHandler(e) {
    if (e.target.value.trim() !== '' && !this.state.stopTimestamp) {
      this.setState({ stopTimestamp: true, timestamp: this.props.waveform.pos });
    } else if (e.target.value.trim() === '' && this.state.stopTimestamp) {
      this.setState({ stopTimestamp: false });
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
        audioTimestamp: ~~(this.state.timestamp * 1000),
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
          this.setState({ stopTimestamp: false });
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
      return <span className="lectureForm" >
        <input ref="inputNote" className="lectureInput" type="text" onKeyUp={this.keyUpHandler.bind(this)} autoFocus/>
        <span>{this.formatTime(this.state.stopTimestamp ? this.state.timestamp : this.props.waveform.pos)}</span>
      </span>;
    } 
      
    return <span className="lectureForm" >
      <input ref="inputNote" className="lectureInput" type="text" onKeyUp={this.keyUpHandler.bind(this)} autoFocus/>
    </span>;
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
