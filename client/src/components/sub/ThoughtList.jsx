import React from 'react';
import NoteReducer from '../../reducers/noteReducers';
import RoomReducer from '../../reducers/roomReducers';
import {connect} from 'react-redux';
import ReactMarkdown from 'react-markdown';
import Infinite from 'react-infinite';
const ThoughtList = (props) => {
  let thoughtView = props.note.justThoughts.map((thought, i)=>(
    <div key={i} className="review thought">
      <ReactMarkdown source={thought.content} />
    </div>
  ));

  return props.note.showThoughts ? (
    <div className="thought-list">
      <Infinite containerHeight={window.innerHeight - 300} elementHeight={(window.innerHeight - 300) / (props.note.justThoughts.length-1)}>
        {thoughtView}
      </Infinite>
    </div>
  ) : (<div></div>);
};

const mapStateToProps = (state) => {
  return {
    ...state,
    NoteReducer,
    RoomReducer
  };
};

export default connect(mapStateToProps)(ThoughtList);
