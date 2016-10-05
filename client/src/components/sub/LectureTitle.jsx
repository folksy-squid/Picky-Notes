import React from 'react';
import {connect} from 'react-redux';
import {getCurrentView} from '../../helpers.js';
import RoomReducer from '../../reducers/roomReducers';
class LectureTitle extends React.Component {
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
