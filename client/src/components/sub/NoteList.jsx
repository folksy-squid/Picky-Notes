import React from 'react';
import Note from './Note.jsx'
import {mapStateToProps} from '../../Connection.js';
import {addNote} from '../../actions/noteActions.js';
import {connect} from 'react-redux';
import {getCurrentView} from '../../helper.js'

class NoteList extends React.Component {
  constructor(props){
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
      console.log('success!');
      this.props.dispatch(addNote(note));
      this.setState({notes: this.props.getState().note});
    });
  }

  // componentWillUnmount() {
  //   var view = getCurrentView(this.props.getState().routing.locationBeforeTransitions.pathname.slice(0, 6));
  //   this.setState({view});
  // }

  render(){
    return (
      <div className="note-list">
        NoteList with {this.state.view} view
        {this.state.notes.map((note, i)=>(<Note key={i} note={note} view={this.state.view}/>)
        )}
      </div>
    )
  }
}

export default connect(mapStateToProps)(NoteList);