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
import {Panel} from 'react-bootstrap';
export class Review extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loaded: false,
      thoughtButton: 'Show thoughts',
      open: false
    };
  }
  componentWillMount() {
    if (this.props.params.roomId && this.props.user.information) {
      const realm = this;
      const user = this.props.user.information[0];
      const pathUrl = this.props.params.roomId;
      this.props.dispatch(setRoomInfo(pathUrl, user, (err, success) => {
        if (err) {
          realm.context.router.push('/notebook');
        } else {
          realm.setState({loaded: true});
        }
      }));
      this.props.dispatch(showHideThoughts(true));
    } else {
      realm.context.router.push('/');
    }
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
    this.setState({ open: !this.state.open });
  }

  render() {
    return (
      this.state.loaded ? (
      <div className="page-content">
        <div className="container">
          <div className="col-sm-9 panel panel-default">
            <LectureTitle />
            <NoteList />
          </div>
          <div className="col-sm-3">
            <div className="fixed-div">
              <button className="btn btn-md btn-primary" onClick={this.goToCompiledView.bind(this)}>
                Add / Edit
              </button>
            </div>
            <Panel className="thought-panel-bottom" collapsible expanded={this.state.open} header={this.state.thoughtButton} onClick={this.toggleThoughts.bind(this)}>
              <ThoughtList />
            </Panel>
          </div>
        </div>
        <div className="footer reviewFooter slideUp">
          <div className="container">
            <Audio />
          </div>
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
