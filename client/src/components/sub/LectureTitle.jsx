import React from 'react';
import Connection from '../../Connection';
const LectureTitle = (props) => {
  var roomInfo = props.getState().room.roomInfo;
  console.log('State::', props);

  var lecturer = roomInfo.lecturer;
  var topic = roomInfo.topic;
  var createdAt = moment(roomInfo.createdAt);

  return (
    <h3 className="lectureTitle">{topic} by {lecturer}</h3>
  );
};

export default Connection(LectureTitle);
