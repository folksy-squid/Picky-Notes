import React from 'react';
import {connect} from 'react-redux';
import {toggleNote} from '../../actions/noteActions.js';
import NoteReducer from '../../reducers/noteReducers';
import WaveformReducer from '../../reducers/waveformReducers';
import {togglePlay, setPos, play} from '../../actions/waveformActions';

class Note extends React.Component {
  constructor(props) {
    super(props);
  }

  saveNote(note) {
    // this can be invoked when in the compiled view
    // send it to the redis cache
  }

  playNote(e) {
    // this can be invoked when in the review view
    console.log(this.props.noteInfo.audioTimestamp);
    this.props.dispatch(setPos(50));
    this.props.dispatch(play());
    console.log(this.props.noteInfo.content);
  }

  toggleNoteHandler(e) {
    this.props.dispatch(toggleNote(this.props.noteInfo.id));
  }

  formatTime(milliseconds) {
    let totalSeconds = ~~(milliseconds / 1000);
    let minutes = ~~(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    return (minutes) ? `${minutes}m ${seconds}s` : `${seconds}s`;
  }

  render() {
    var view;
    //props.page will be obtained from redux store.
    if (this.props.view === 'compile') {
      view = (
        <div className="note">
          <input type="checkbox" ref="checkbox" onChange={this.toggleNoteHandler.bind(this)} checked={this.props.noteInfo.show}/>
          <span className="content">{this.props.noteInfo.content}</span>
          <span className="audioTimestamp">{this.formatTime(this.props.noteInfo.audioTimestamp)}</span>
        </div>
      );
    } else if (this.props.view === 'lecture') {
      view = (
        <div className="note">
          <span className="content">{this.props.noteInfo.content}</span>
          <span className="audioTimestamp">{this.formatTime(this.props.noteInfo.audioTimestamp)}</span>
        </div>);
    } else if (this.props.view === 'review') {
      view = (
        <div className="note">
          <i className="fa fa-play-circle" aria-hidden="true" onClick={this.playNote.bind(this)}></i>
          {this.props.noteInfo.content}
        </div>
      );
    }

    return view;
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    NoteReducer,
    WaveformReducer
  };
};

export default connect(mapStateToProps)(Note);
