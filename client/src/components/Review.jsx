import React from 'react';
import { Link } from 'react-router';
import NoteList from './sub/NoteList.jsx';
import LectureTitle from './sub/LectureTitle.jsx';
import {connect} from 'react-redux';
import {setRoomInfo} from '../actions/roomActions';
import Audio from './sub/Audio.jsx';
import UserReducer from '../reducers/userReducers';
import RoomReducer from '../reducers/roomReducers';
class Review extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loaded: false
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
  }

  static get contextTypes() {
    return {
      router: React.PropTypes.object.isRequired,
    };
  }

  goToCompiledView() {
    this.context.router.push(`/compile/${this.props.room.roomInfo.pathUrl}`);
  }

  render() {
    return (
      this.state.loaded ? (
      <div className="container">
        <LectureTitle />
        <div className="row">
        {this.props.room.roomInfo.audioUrl === 'audio url' ? (<div>Audio does not exist</div>) : <Audio />}
        </div>
        <NoteList />
        <button className="btn btn-md btn-primary" onClick={this.goToCompiledView.bind(this)}>
          Add / Edit Notes
        </button>
      </div>
    ) : (<div></div>)
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    UserReducer,
    RoomReducer
  };
};

export default connect(mapStateToProps)(Review);
