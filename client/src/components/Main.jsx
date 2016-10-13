import React from 'react';
import Connection from '../Connection.js';
import Navbar from './Navbar.jsx';
import { Link } from 'react-router';
import {connect} from 'react-redux';

import NoteReducer from '../reducers/noteReducers';
import RoomReducer from '../reducers/roomReducers';
import UserReducer from '../reducers/userReducers';
import EntryReducer from '../reducers/entryReducers';

import {loadEntries, loadClassList} from '../actions/entryActions';

export class Main extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loaded: false
    }
  }

  componentWillMount() {
    const user = this.props.user.information[0];
    const context = this;
    $.ajax({
      method: 'GET',
      url: `/api/rooms?userId=${user.id}`
    })
    .then(entries => {
      let lectures = entries.filter((entry) => entry.startTimestamp !== null);
      lectures = lectures.sort((a, b) => b.startTimestamp - a.startTimestamp);
      context.props.dispatch(loadEntries(lectures))
      context.props.dispatch(loadClassList());
      context.setState({loaded: true})
    });
  }

  render() {
    return (
      this.state.loaded ? (
        <div className="main">
          <Navbar checkFilter={this.props.route.checkFilter}/>
          {this.props.children}
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
    NoteReducer,
    EntryReducer
  };
};

export default connect(mapStateToProps)(Main);
