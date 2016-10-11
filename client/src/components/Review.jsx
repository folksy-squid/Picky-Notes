import React from 'react';
import { Link } from 'react-router';
import NoteList from './sub/NoteList.jsx';
import ThoughtList from './sub/ThoughtList.jsx';
import LectureTitle from './sub/LectureTitle.jsx';
import {connect} from 'react-redux';
import {setRoomInfo} from '../actions/roomActions';
import {showHideThoughts} from '../actions/noteActions';
import Audio from './sub/Audio.jsx';
import UserReducer from '../reducers/userReducers';
import RoomReducer from '../reducers/roomReducers';
import NoteReducer from '../reducers/noteReducers';

class Review extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loaded: false,
      thoughtButton: 'Show thoughts'
    };
  }
  componentWillMount() {
    var realm = this;
    var user = this.props.user.information[0];
    var pathUrl = this.props.params.roomId;
    this.props.dispatch(setRoomInfo(pathUrl, user, (err, success) => {
      if (err) {
        realm.context.router.push('/notebook');
      } else {
        realm.setState({loaded: true});
      }
    }));
    this.props.dispatch(showHideThoughts(true));
  }

  static get contextTypes() {
    return {
      router: React.PropTypes.object.isRequired,
    };
  }

  goToCompiledView() {
    this.context.router.push(`/compile/${this.props.room.roomInfo.pathUrl}`);
  }

  toggleThoughts() {
    if (this.state.thoughtButton === 'Show thoughts') {
      this.setState({
        thoughtButton: 'Hide thoughts'
      });
    } else {
      this.setState({
        thoughtButton: 'Show thoughts'
      });
    }
    this.props.dispatch(showHideThoughts());
  }

  render() {
    return (
      this.state.loaded ? (
      <div className="container">
        <div className="col-sm-9 panel panel-default">
          <LectureTitle />
          <NoteList />
        </div>
        <div className="col-sm-3">
          <button className="btn btn-md btn-primary" onClick={this.goToCompiledView.bind(this)}>
            Add / Edit
          </button>
          <button className="btn btn-md btn-info" onClick={this.toggleThoughts.bind(this)}>
            {this.state.thoughtButton}
          </button>
          <ThoughtList />
        </div>
      </div>
    ) : (<div></div>)
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    UserReducer,
    RoomReducer,
    NoteReducer
  };
};

export default connect(mapStateToProps)(Review);
