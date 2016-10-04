import React from 'react';
import {connect} from 'react-redux';
import {getCurrentView} from '../../helpers.js';
import RoomReducer from '../../reducers/roomReducers';
const LectureTitle = (props) => {
  /*----------  NPM RUN DEV  ----------*/
  var roomInfo = props.room.roomInfo;
  var lecturer = roomInfo.lecturer;
  var topic = roomInfo.topic;
  var createdAt = moment(roomInfo.createdAt).format('MM/DD/YYYY');
  /*----------  //NPM RUN DEV  ----------*/

  /*----------  NPM RUN CLIENT  ----------*/
  // var lecturer = 'Mr Potatohead'
  // var topic = 'World History';
  // var createdAt = ... ;
  /*----------  // NPM RUN CLIENT  ----------*/

  var view = (
    <h3 className="lectureTitle">{topic} by {lecturer}</h3>
  );

  console.log('props...', props);
  var pathname = props.routing.locationBeforeTransitions.pathname;

  if (getCurrentView(pathname) === 'review') {
    console.log('lecturer', lecturer, 'topic', topic, 'createdAt', createdAt);

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
  console.log('view,', view);
  return view;
};

const mapStateToProps = (state) => {
  return {
    ...state,
    RoomReducer    
  }
}

export default connect(mapStateToProps)(LectureTitle);
