import React from 'react';
import { Link } from 'react-router';
import {connect} from 'react-redux';
import InputBox from './sub/InputBox.jsx';
import ParticipantList from './sub/ParticipantList.jsx';
import LectureBox from './sub/LectureBox.jsx';
import {setRoomInfo} from '../actions/roomActions';
import {clearDeletedNotes} from '../actions/noteActions';
import RoomReducer from '../reducers/roomReducers';
import UserReducer from '../reducers/userReducers';
import NoteReducer from '../reducers/noteReducers';
import Audio from './sub/Audio.jsx';
import LectureTitle from './sub/LectureTitle.jsx';

export class Compile extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loaded: false
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
      this.props.dispatch(setRoomInfo(pathUrl, user, (err, success) => {
        if (err) {
          realm.context.router.push('/notebook');
        } else {
          realm.setState({loaded: true});
        }
      }));
    } else {
      this.setState({loaded: true});
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

  formatTime(decimalSeconds) {
    const seconds = ~~decimalSeconds;
    const minutes = ~~(seconds / 60);
    const hours = ~~(minutes % 60);

    let time = hours > 0 ? hours + ':' : '';
    time += minutes < 10 ? '0' + minutes + ':' : minutes + ':';
    time += seconds < 10 ? '0' + seconds : seconds;

    return time;
  }

  alignInputbox() {
    if (!this.state.loaded) { return; }
    const $arrow = $('.inputArrow');
    const $column = $('.col-xs-9');
    const $container = $('.container');
    const $input = $('.compileInput');
    const $footer = $('.footer');

    console.log(+$container.css('marginLeft').slice(0, -2), +$container.css('paddingLeft').slice(0, -2), $arrow.width(), +$column.css('marginLeft').slice(0, -2), 24)
    
    $input.width( $column.width() - 6 );
    $footer.css({ paddingLeft: +$container.css('marginLeft').slice(0, -2) + +$container.css('paddingLeft').slice(0, -2) - $arrow.width() - +$column.css('marginLeft').slice(0, -2) - 24 });
  }

  componentDidMount() {
    this.alignInputbox();

    $( window ).resize(this.alignInputbox.bind(this)); 
  }

  componentDidUpdate() {
    this.alignInputbox();
  }

// IF this.props.roomInfo.audioUrl === 'audioUrl', render the audio loading component
  render() {
    return (
      this.state.loaded ? (
    <div>
      <div className="container">
        <LectureTitle />
        <div className="row">
          <div className="col-xs-9">
            <LectureBox />
          </div>
          <div className="col-xs-3">
            <div className="fixed-div">
              <button className="btn btn-md btn-success" onClick={this.reviewNotesHandler.bind(this)}>Save & Review</button>
              <ParticipantList />
            </div>
          </div>
        </div>
      </div>
      <div className="footer slideUp">
          <InputBox />
          <Audio />
      </div>
    </div>
    ) : (<div></div>)
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
