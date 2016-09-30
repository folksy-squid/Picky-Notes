import React from 'react';
import Note from './Note.jsx'
import {mapStateToProps} from '../../Connection.js';
import {connect} from 'react-redux';

var getCurrentView = function(pathname){
  if (pathname === "/revie") {
    return 'review';
  } else if (pathname === "/lectu") {
    return 'lecture';
  } else if (pathname === "/compi") {
    return 'compile';
  }
};

class NoteList extends React.Component {
  constructor(props){
    super(props);
    var pathname = props.getState().routing.locationBeforeTransitions.pathname.slice(0, 6);
    this.state = {
      // notes: props.getState().note.notes,
      view: getCurrentView(pathname)
    }
  }

  render(){

    return (
      <div className="note-list">
        'this is the notelist..'
        {this.state.notes.map((note, i)=>
          <Note {/*{note={note}*/} {/*view={this.state.view}*/} {/*key={i}*/} />
        )}
      </div>
    )
  }
}

export default connect(mapStateToProps)(NoteList);