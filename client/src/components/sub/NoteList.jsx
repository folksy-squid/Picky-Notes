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
    this.state = {
      notes: props.getState().note,
      view: getCurrentView(pathname)
    };
  }

  componentWillMount() {
    this.props.getState().room.socket.on('add note success', (note) => {
      console.log('success!');
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
          console.log('the response: ', res);
          this.props.dispatch(replaceNotes(res));
          this.setState({notes: this.props.getState().note});
          // clear out current Notes
          // reassign with notes from server
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

<<<<<<< d8b03c0e401440dbca6b9a1b314a273576bb5f11
/*<Note note={note} view={this.state.view} key={i} />*/
  render() {
=======
  render(){
>>>>>>> Reverted back to old stuff
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
