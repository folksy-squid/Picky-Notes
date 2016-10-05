import React from 'react';
import {connect} from 'react-redux';
import {getCurrentView} from '../../helpers.js';
import RoomReducer from '../../reducers/roomReducers';
const LectureTitle = (props) => {
  var roomInfo = props.room.roomInfo;
  var lecturer = roomInfo.lecturer;
  var topic = roomInfo.topic;
  var createdAt = moment(roomInfo.createdAt).format('MM/DD/YYYY');

  var view = (
    <h3 className="lectureTitle">{topic} by {lecturer}</h3>
  );

  var pathname = props.routing.locationBeforeTransitions.pathname;

  if (getCurrentView(pathname) === 'review') {
    view = (
    <div className="review-header">
      <h4 className="lectureTitle">
        {topic} by {lecturer}
      </h4>
      <h4 className="review-date">
        {createdAt}
      </h4>
    </div>
    );
  }
  return view;
};

const mapStateToProps = (state) => {
  return {
    ...state,
    RoomReducer
  };
};

export default connect(mapStateToProps)(LectureTitle);
