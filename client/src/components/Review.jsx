import React from 'react';
import { Link } from 'react-router';
import NoteList from './sub/NoteList.jsx';
import LectureTitle from './sub/LectureTitle.jsx';
import Connection from '../Connection.js';
import {setRoomInfo} from '../actions/roomActions';

class Review extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loaded: false
    };
  }
  componentWillMount() {
    if (this.props.getState().room.roomInfo) {
      this.setState({loaded: true});
    } else {
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
        <div> AUDIO Component </div>
        <button className="btn btn-lg btn-primary" onClick={this.goToCompiledView.bind(this)}>
          Add / Edit Notes
        </button>
      </div>
    ) : (<div></div>)
    );
  }
}

export default Connection(Review);
