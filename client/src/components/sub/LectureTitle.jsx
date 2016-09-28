import React from 'react';
import Connection from '../../Connection.js';

const LectureTitle = (props) => (
  <h3 className="lectureTitle">Lecture Title by Professor Name</h3>
);

export default Connection(LectureTitle);
