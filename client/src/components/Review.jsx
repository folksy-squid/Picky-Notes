import React from 'react';
import { Link } from 'react-router';
import NoteList from './sub/NoteList.jsx';
import LectureTitle from './sub/LectureTitle.jsx';
import Connection from '../Connection.js';
import {setRoomInfo} from '../actions/roomActions';
import Audio from './sub/Audio.jsx';

class Review extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loaded: false
    };
  }
  componentWillMount() {
    var realm = this;
    var user = this.props.getState().user.information[0];
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
    this.context.router.push(`/compile/${this.props.getState().room.roomInfo.pathUrl}`);
  }

  render() {
    return (
      this.state.loaded ? (
      <div className="container">
        <LectureTitle />
        <NoteList />
        <button className="btn btn-md btn-primary" onClick={this.goToCompiledView.bind(this)}>
          Add / Edit Notes
        </button>
        <Audio />
      </div>
    ) : (<div></div>)
    );
  }
}

export default Connection(Review);
