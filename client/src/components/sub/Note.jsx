import React from 'react';
import {connect} from 'react-redux';
import {toggleNote, editNote, deleteNote, editTimestamp, setClass} from '../../actions/noteActions.js';
import NoteReducer from '../../reducers/noteReducers';
import WaveformReducer from '../../reducers/waveformReducers';
import {setPos, play} from '../../actions/waveformActions';

class Note extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editContent: false,
      editTimestamp: false,
    };
  }

  saveNote(note) {
    // this can be invoked when in the compiled view
    // send it to the redis cache
  }

  playNote(e) {
    // this can be invoked when in the review view
    this.props.dispatch(setPos(Number(this.props.noteInfo.audioTimestamp) / 1000));
    this.props.dispatch(play());
  }

  toggleNoteHandler(e) {
    this.props.dispatch(toggleNote(this.props.noteInfo.id));
  }

  formatTime(milliseconds) {
    let seconds = ~~(milliseconds / 1000);
    let minutes = ~~(seconds / 60);
    let hours = ~~(minutes / 60);
    seconds = seconds % 60;
    minutes = minutes % 60;

    let time = hours ? hours + ':' : '';
    time += minutes < 10 ? '0' + minutes + ':' : minutes + ':';
    time += seconds < 10 ? '0' + seconds : seconds;

    return time;
  }

  contentClickHandler() {
    this.setState({editContent: true});
  }

  editContentHandler(e) {
    e.preventDefault();
    const newText = this.refs.noteInput.value;
    if (newText.trim() !== '' && newText.value !== this.props.noteInfo.content) {
      this.props.dispatch(editNote(this.props.noteInfo.id, newText));
    }
    this.setState({ editContent: false });
  }

  deleteHandler() {
    this.props.dispatch(deleteNote(this.props.noteInfo.id, this.props.noteInfo.thought));
    setTimeout(() => {
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
    }, 10);
  }

  timestampClickHandler() {
    this.setState({ editTimestamp: true });
  }

  editTimestampHandler(e) {
    e.preventDefault();
    let newTimestamp = (+this.refs.editMin.value * 60 + +this.refs.editSec.value) * 1000;
    if (this.refs.editHour) {
      newTimestamp += this.refs.editHour.value * 3600;
    }
    if (newTimestamp <= +this.props.room.roomInfo.timeLength) {
      this.props.dispatch(editTimestamp(this.props.noteInfo.id, newTimestamp));
    }
    this.setState({ editTimestamp: false });
  }

  render() {

    const noteClass = () => {
      let retVal = this.props.view + ' note';
      if (this.props.noteInfo.thought) {
        retVal += ' justThought';
      } else {
        retVal += this.props.noteInfo.highlight ? ' justNote highlighted' : ' justNote';
      }
      return retVal;
    };

    if (!this.props.noteInfo.content) {
      return (<div></div>);
    }

    var view;

    if (this.props.view === 'compile') {
      const classColor = (i) => 'participant' + i;
      view = (
          <div className={noteClass()}>
            <input type="checkbox" ref="checkbox" onChange={this.toggleNoteHandler.bind(this)} checked={this.props.noteInfo.show}/>
            {this.state.editContent ?
              <span className="content">
                <form onSubmit={this.editContentHandler.bind(this)}>
                  <input ref="noteInput" type="text" defaultValue={this.props.noteInfo.content} />
                </form>
              </span>
              :
              <span className={`content ${classColor(`${this.props.classColor}`)}`} onClick={this.contentClickHandler.bind(this)}>{this.props.noteInfo.content}</span>
            }
            {this.state.editTimestamp ?
              <span className="audioTimestamp">
                <form onSubmit={this.editTimestampHandler.bind(this)}>
                  <button className="btn btn-success btn-xs">Save</button>
                  {this.props.room.roomInfo.timeLength >= 3600000 && <input ref="editHour" type="number" min={0} defaultValue={ ~~(this.props.noteInfo.audioTimestamp / 3600000) } />}
                  {this.props.room.roomInfo.timeLength >= 3600000 && ':'}
                  <input ref="editMin" type="number" min={0} max={59} defaultValue={~~(this.props.noteInfo.audioTimestamp / 60000) % 60} />:
                  <input ref="editSec" type="number" min={0} max={59} defaultValue={~~(this.props.noteInfo.audioTimestamp / 1000) % 60} />
                </form>
              </span>
            :
              <span className="audioTimestamp" onClick={this.timestampClickHandler.bind(this)}>
                {this.formatTime(this.props.noteInfo.audioTimestamp)}
              </span>
            }
          <span className="deleteNoteButton" onClick={this.deleteHandler.bind(this)}><i className="ion ion-close-round deleteNoteIcon"></i></span>
        </div>
      );
    }

    else if (this.props.view === 'lecture') {
      view = (
        <div className={noteClass()}>
          <span className="content">{this.props.noteInfo.content}</span>
          <span className="audioTimestamp">{this.formatTime(this.props.noteInfo.audioTimestamp)}</span>
        </div>
      );

    }

    else if (this.props.view === 'review') {
      if (this.props.noteInfo.thought) {
      //if the note is a thought,
        if (this.props.note.showThoughts) {
          view = (
            <div className={noteClass()}>
              {this.props.noteInfo.content}
            </div>
          )
        } else {
          view = (<div></div>)
        }
      } else {
      // if the note is a note
        view = (
          <div className={noteClass()}>
            <i className="fa fa-play-circle" aria-hidden="true" onClick={this.playNote.bind(this)}></i>
            {this.props.noteInfo.content}
          </div>
        );
      }
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
