import React from 'react';
import { Link } from 'react-router';
import {connect} from 'react-redux';
import ParticipantList from './sub/ParticipantList.jsx';
import LectureBox from './sub/LectureBox.jsx';
import {setRoomInfo} from '../actions/roomActions';
import {clearDeletedNotes} from '../actions/noteActions';
import RoomReducer from '../reducers/roomReducers';
import UserReducer from '../reducers/userReducers';
import NoteReducer from '../reducers/noteReducers';
import Audio from './sub/Audio.jsx';
import LectureTitle from './sub/LectureTitle.jsx';

class Compile extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loaded: true
    };
  }

  static get contextTypes() {
    return {
      router: React.PropTypes.object.isRequired,
    };
  }

  componentWillMount() {
    this.props.dispatch({type: 'LEAVE_SOCKET_ROOM'});
    const user = this.props.user.information[0];
    const pathUrl = this.props.params.roomId;
    const realm = this;
    if (!this.props.room.roomInfo) {
      this.setState({loaded: false});
      this.props.dispatch(setRoomInfo(pathUrl, user, (err, success) => {
        if (err) {
          realm.context.router.push('/notebook');
        } else {
          realm.setState({loaded: true});

        }
      }));
    }
  }

  reviewNotesHandler() {
    let changedNotes = this.props.note.notes.filter(note => note.changed);
    let deletedNotes = this.props.note.deleted;
    let ajaxRequests = [];
    if (changedNotes.length) {
      // remove change property
      changedNotes = JSON.parse(JSON.stringify(changedNotes));
      changedNotes = changedNotes.map(note => {
        delete note.changed;
        return note;
      });
      // queue ajax request to update notes
      ajaxRequests.push(
        $.ajax({
          method: 'PUT',
          url: `/api/notes/${this.props.user.information[0].id}/${this.props.room.roomInfo.id}`,
          contentType: 'application/json',
          data: JSON.stringify(changedNotes),
        })
      );
    } else if (deletedNotes.length) {
      // remove deleted property
      let noteIds = deletedNotes.map(note => note.id);
      // queue ajax request to delete notes
      ajaxRequests.push(
        $.ajax({
          method: 'DELETE',
          url: `/api/notes/${this.props.user.information[0].id}/${this.props.room.roomInfo.id}`,
          contentType: 'application/json',
          data: JSON.stringify(noteIds),
        })
      );
    } else {
      return this.context.router.push(`/review/${this.props.room.roomInfo.pathUrl}`);
    }

    $.when(...ajaxRequests)
    .done((res) => {
      this.props.dispatch(clearDeletedNotes());
      this.context.router.push(`/review/${this.props.room.roomInfo.pathUrl}`);
    })
    .fail((error) => console.log('Error updating changed notes', error));
  }

// IF this.props.roomInfo.audioUrl === 'audioUrl', render the audio loading component
  render() {
    return (
      this.state.loaded ? (
    <div className="container-fluid">
      <LectureTitle />
      <div className="row">
          <Audio />
      </div>
      <div className="row">
        <div className="col-md-9">
          <LectureBox />
        </div>
        <div className="col-md-3">
          <button className="btn btn-lg btn-success" onClick={this.reviewNotesHandler.bind(this)}>Save & Review</button>
          {
            this.props.room.participants ? (
              <ParticipantList />
            ) : (<div></div>)
          }
        </div>
      </div>
    </div>) : (<div></div>)
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state,
    RoomReducer,
    UserReducer,
    NoteReducer
  };
};

export default connect(mapStateToProps)(Compile);
