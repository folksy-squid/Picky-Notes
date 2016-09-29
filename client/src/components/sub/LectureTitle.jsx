import React from 'react';

const LectureTitle = (props) => {
  var roomInfo = props.getState().room.roomInfo;
  var lecturer = roomInfo.lecturer;
  var topic = roomInfo.topic;
  var createdAt = moment(roomInfo.createdAt)

  return (
    <h3 className="lectureTitle">{topic} by {lecturer}</h3>
  )
};

export default LectureTitle;
