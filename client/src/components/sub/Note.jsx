import React from 'react';
import {connect} from 'react-redux';
import {toggleNote, editNote, deleteNote} from '../../actions/noteActions.js';
import NoteReducer from '../../reducers/noteReducers';
import WaveformReducer from '../../reducers/waveformReducers';
import {setPos, play} from '../../actions/waveformActions';

class Note extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false
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
    let totalSeconds = ~~(milliseconds / 1000);
    let minutes = ~~(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    return (minutes) ? `${minutes}m ${seconds}s` : `${seconds}s`;
  }

  compileClickHandler() {
    this.setState({edit: true});
  }

  editHandler(e) {
    e.preventDefault();
    let newText = this.refs.noteInput.value;
    if (this.refs.noteInput.value.trim() !== '') {
      this.props.dispatch(editNote(this.props.noteInfo.id, this.refs.noteInput.value));
    }
    this.setState({edit: false});
  }

  deleteHandler(e) {
    console.log('click!', this.props.noteInfo.id);
    this.props.dispatch(deleteNote(this.props.noteInfo.id));
  }

  render() {
    var view;
    //props.page will be obtained from redux store.
    if (this.props.view === 'compile') {
      if (!this.props.noteInfo.content) {
        if (this.props.noteInfo.highlight) {
          return (<div className='pointer'></div>);
        } else {
          return (<div></div>);
        }
      }

      view = (
        <div>
          <div className='note'>
            <input type="checkbox" ref="checkbox" onChange={this.toggleNoteHandler.bind(this)} checked={this.props.noteInfo.show}/>
            {this.state.edit ?
              <span className="content">
                <form onSubmit={this.editHandler.bind(this)}>
                  <input ref="noteInput" type="text" defaultValue={this.props.noteInfo.content} />
                </form>
              </span>
              :
              <span className="content" onClick={this.compileClickHandler.bind(this)}>{this.props.noteInfo.content}</span>
            }
            <span className="audioTimestamp">{this.formatTime(this.props.noteInfo.audioTimestamp)}</span>
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
        </div>);
    } else
    if (this.props.view === 'review') {
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
