import React from 'react';
import {connect} from 'react-redux';
import {toggleNote, editNote, deleteNote, editTimestamp} from '../../actions/noteActions.js';
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
    this.props.dispatch(deleteNote(this.props.noteInfo.id));
  }

  timestampClickHandler() {
    this.setState({ editTimestamp: true });
  }

  editTimestampHandler(e) {
    e.preventDefault();
    const newTimestamp = (+this.refs.editMin.value * 60 + +this.refs.editSec.value) * 1000;
    if (newTimestamp <= +this.props.room.roomInfo.timeLength) {
      this.props.dispatch(editTimestamp(this.props.noteInfo.id, newTimestamp));
    }
    this.setState({ editTimestamp: false });
  }

  render() {
    var view;
    //props.page will be obtained from redux store.

    if (this.props.view === 'compile') {

      if (!this.props.noteInfo.content) {
        if (this.props.noteInfo.highlight) {
          return (<div className='pointer'></div>);
        }
        return (<div></div>);
      }

      view = (
        <div>
          <div className='note'>
            <input type="checkbox" ref="checkbox" onChange={this.toggleNoteHandler.bind(this)} checked={this.props.noteInfo.show}/>
            {this.state.editContent ?
              <span className="content">
                <form onSubmit={this.editContentHandler.bind(this)}>
                  <input ref="noteInput" type="text" defaultValue={this.props.noteInfo.content} />
                </form>
              </span>
              :
              <span className="content" onClick={this.contentClickHandler.bind(this)}>{this.props.noteInfo.content}</span>
            }
            {this.state.editTimestamp ? 
              <span className="audioTimestamp">
                <form onSubmit={this.editTimestampHandler.bind(this)}>
                  <button className="btn btn-success btn-xs">Save</button>
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
          {this.props.noteInfo.highlight && (
          <div className='pointer' />)
          }
        </div>
      );

    } else if (this.props.view === 'lecture') {
      if (!this.props.noteInfo.content) {
        return (<div></div>);
      }
      view = (
        <div className="note">
          <span className="content">{this.props.noteInfo.content}</span>
          <span className="audioTimestamp">{this.formatTime(this.props.noteInfo.audioTimestamp)}</span>
        </div>
      );

    } else if (this.props.view === 'review') {
      if (!this.props.noteInfo.content) {
        return (<div></div>);
      }
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
