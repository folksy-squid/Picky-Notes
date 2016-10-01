import React from 'react';
import Note from './Note.jsx';
import {mapStateToProps} from '../../Connection.js';
import {addNote, replaceNotes} from '../../actions/noteActions.js';
import {connect} from 'react-redux';
import {getCurrentView} from '../../helpers.js';

class NoteList extends React.Component {
  constructor(props) {
    super(props);
    var pathname = props.getState().routing.locationBeforeTransitions.pathname;
    var currentView = getCurrentView(pathname);
    this.state = {
      notes: props.getState().note,
      view: currentView
    };
  }

  componentWillMount() {
    const userId = this.props.getState().user.information[0].id;
    const roomId = this.props.getState().room.roomInfo.id;

    this.props.getState().room.socket.on('add note success', (note) => {
      this.props.dispatch(addNote(note));
      this.setState({notes: this.props.getState().note});
    });

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
        this.props.dispatch(replaceNotes(res));

        // reassign with notes from server
        this.setState({notes: this.props.getState().note});
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
        this.setState({notes: this.props.getState().note});
      },
      error: (res, status) => {
        console.log(res);
      }
    });
  }

/*<Note note={note} view={this.state.view} key={i} />*/
  render() {
    return (
      <div className="note-list">
        {this.state.notes.map((note, i)=>(<Note key={i} note={note} view={this.state.view}/>)
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps)(NoteList);
