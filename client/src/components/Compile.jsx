import React from 'react';
import { Link } from 'react-router';
import Connection from '../Connection.js';
import ParticipantList from './sub/ParticipantList.jsx';
import LectureBox from './sub/LectureBox.jsx';
import {setRoomInfo} from '../actions/roomActions';


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
    const user = this.props.getState().user.information[0];
    const pathUrl = this.props.params.roomId;
    const realm = this;
    if (!this.props.getState().room.roomInfo) {
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
    let state = this.props.getState();
    let changedNotes = state.note.filter(note => note.changed);
    changedNotes = JSON.parse(JSON.stringify(changedNotes));
    changedNotes = changedNotes.map(note => {
      delete note.changed;
      return note;
    });

    $.ajax({
      method: 'PUT',
      url: `/api/notes/${state.user.information[0].id}/${state.room.roomInfo.id}`,
      contentType: 'application/json',
      data: JSON.stringify(changedNotes),
      success: (res) => {
        this.context.router.push(`/review/${this.props.getState().room.roomInfo.pathUrl}`);
      },
      error: (error) => console.log('Error updating changed notes', error),
    });
  }

  render() {
    return (
      this.state.loaded ? (
    <div className="container-fluid">
      <div className="row">
        <h3>Edit Notes</h3>
        <div> 'AUDIO COMPONENT GOES HERE '</div>
      </div>
      <div className="row">
        <div className="col-md-9">
          <LectureBox />
        </div>
        <div className="col-md-3">
          <button className="btn btn-lg btn-success" onClick={this.reviewNotesHandler.bind(this)}>Review</button>
          {
            this.props.getState().room.participants ? (
              <ParticipantList />
            ) : (<div></div>)
          }
        </div>
      </div>
    </div>) : (<div></div>)
    );
  }
}

export default Connection(Compile);
