import React from 'react';
import Note from './Note.jsx';
import {mapStateToProps} from '../../Connection.js';
import {addNote, replaceNotes} from '../../actions/noteActions.js';
import {connect} from 'react-redux';
import {getCurrentView} from '../../helpers.js'

class NoteList extends React.Component {
  constructor(props) {
    super(props);
    var pathname = props.getState().routing.locationBeforeTransitions.pathname;
    var currentView = getCurrentView(pathname);
    this.state = {
      notes: props.getState().note,
      view: currentView
    }
  }

  componentWillMount() {
    this.props.getState().room.socket.on('add note success', (note) => {
      this.props.dispatch(addNote(note));
      this.setState({notes: this.props.getState().note});
    });

    if (this.state.view === 'compile') {
      // get userId roomId
      const userId = this.props.getState().user.information[0].id;
      const roomId = this.props.getState().room.roomInfo.id;
      $.ajax({
        method: 'GET',
        url: `/api/notes/${userId}/${roomId}`,
        contentType: 'application/json',
        success: (res, status) => {
          // clear out current Notes
          this.props.dispatch(replaceNotes(res));
          // reassign with notes from server
          this.setState({notes: this.props.getState().note});
        },
        error: function( res, status ) {
          console.log(res);
        }
      });

    }
  }

  // componentWillUnmount() {
  //   var view = getCurrentView(this.props.getState().routing.locationBeforeTransitions.pathname.slice(0, 6));
  //   this.setState({view});
  // }

/*<Note note={note} view={this.state.view} key={i} />*/
  render() {
    return (
      <div className="note-list">
        NoteList with {this.state.view} view
        {this.state.notes.map((note, i)=>(<Note key={i} note={note} view={this.state.view}/>)
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps)(NoteList);
