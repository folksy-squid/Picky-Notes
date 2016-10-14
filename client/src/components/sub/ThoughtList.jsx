import React from 'react';
import NoteReducer from '../../reducers/noteReducers';
import RoomReducer from '../../reducers/roomReducers';
import UserReducer from '../../reducers/userReducers';

import {deleteNote} from '../../actions/noteActions';
import {connect} from 'react-redux';
import ReactMarkdown from 'react-markdown';
import Infinite from 'react-infinite';

const ThoughtList = (props) => {

  let formatTime = (milliseconds) => {
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

  let deleteThought = (thought) => {
    props.dispatch(deleteNote(thought.id, true));
    let userId = props.user.information[0].id;
    let roomId = props.room.roomInfo.id;
    let noteId = thought.id;
    $.ajax({
      method: 'DELETE',
      url: `/api/notes/${userId}/${roomId}/${noteId}`
    });
  };

  let thoughtView = props.note.justThoughts.map((thought, i)=>(
    <div key={i} className="review thought">
      <div className="row">
        <div className="col-xs-10">
          <ReactMarkdown source={thought.content} />
        </div>
        <div className="col-xs-2">
          <i className="ion ion-close-round deleteNoteIcon2" onClick={deleteThought.bind(this, thought, i)}/>
        </div>
      </div>
      <div className="audioDiv">
        <span className="audioTimestamp thought-timestamp">- {formatTime(thought.audioTimestamp)}</span>
      </div>
    </div>
  ));

  return props.note.showThoughts ? (
    <div className="thought-list">
      <Infinite containerHeight={window.innerHeight - 300} elementHeight={(window.innerHeight - 300) / (props.note.justThoughts.length > 1 ? props.note.justThoughts.length : 1)}>
        {thoughtView}
      </Infinite>
    </div>
  ) : (<div></div>);
};

const mapStateToProps = (state) => {
  return {
    ...state,
    NoteReducer,
    UserReducer,
    RoomReducer
  };
};

export default connect(mapStateToProps)(ThoughtList);
