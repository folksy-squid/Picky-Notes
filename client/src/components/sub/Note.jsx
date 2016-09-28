import React from 'react';
import Connection from '../../Connection.js'

class Note extends React.Component {
  constructor(props){
    super(props);
  }

  saveNote(note){
    // this can be invoked when in the compiled view
    // send it to the redis cache
  }

  playNote(note){
    // this can be invoked when in the review view
  }

  render(){
    var view;

    //props.page will be obtained from redux store.
    if (props.page === 'Compiled') {
      view = (
        <div className="note">
          'this is a note in compiled'{note}
        </div>
      )
    } else if (props.page === 'Lecture'){
      view = (
        <div className="note">
          'this is a note in lecture'{note}
        </div>)
    } else if (props.page === 'Review') {
      view = (
        <div className="note">
          'this is a note in review'{note}
        </div>
      )
    }

    return view
  }
}


export default Connection(Note)