import React from 'react';
import NoteReducer from '../../reducers/noteReducers';
import RoomReducer from '../../reducers/roomReducers';
import {connect} from 'react-redux';

const ThoughtList = (props) => {
  let thoughtView = props.note.justThoughts.map((thought, i)=>(
    <div key={i} className="review thought">
      {thought.content}
    </div>
  ))

  return props.note.showThoughts ? (
    <div className="thought-list">
      {thoughtView}
    </div>
  ) : (<div></div>)
}

const mapStateToProps = (state) => {
  return {
    ...state,
    NoteReducer,
    RoomReducer
  };
};

export default connect(mapStateToProps)(ThoughtList);