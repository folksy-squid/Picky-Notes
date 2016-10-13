import React from 'react';
import {connect} from 'react-redux';
import {getCurrentView} from '../../helpers.js';
import RoomReducer from '../../reducers/roomReducers';
export class LectureTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createdAt: moment(props.room.roomInfo.createdAt).format('MM/DD/YYYY')
    };
  }

  render() {
    var view = (
      <h3 className="lectureTitle">{this.props.room.roomInfo.topic} by {this.props.room.roomInfo.lecturer}</h3>
    );

    var pathname = this.props.routing.locationBeforeTransitions.pathname;

    if (getCurrentView(pathname) === 'review') {
      view = (
        <div className="review-header">
        <h4 className="lectureTitle">
          {this.props.room.roomInfo.topic} by {this.props.room.roomInfo.lecturer}
        </h4>
        <h4 className="review-date">
        {this.state.createdAt}
        </h4>
        </div>
      );
    }
    else if (getCurrentView(pathname) === 'lecture') {
      view = (
      <div>
        <h4 className="lectureTitle lecture-view-heading">
          {this.props.room.roomInfo.topic}
        </h4>
        <h5>
          by {this.props.room.roomInfo.lecturer}
        </h5>
      </div>
      );
    }

    return view;
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    RoomReducer
  };
};

export default connect(mapStateToProps)(LectureTitle);
