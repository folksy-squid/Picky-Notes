import React from 'react';
import EntryList from './sub/EntryList.jsx';
import SearchBar from './sub/SearchBar.jsx';
import { Link } from 'react-router';
import {connect} from 'react-redux';

import NoteReducer from '../reducers/noteReducers';
import RoomReducer from '../reducers/roomReducers';
import UserReducer from '../reducers/userReducers';
import EntryReducer from '../reducers/entryReducers';

import {loadEntries, removeEntry} from '../actions/entryActions'

export class Notebook extends React.Component {
  constructor (props) {
    super(props);
  }

  removeEntry(i) {
    this.props.dispatch(removeEntry(i));
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <EntryList entries={this.props.entry.entries} removeEntry={this.removeEntry.bind(this)}/>
        </div>
      </div>
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

export default connect(mapStateToProps)(Notebook);
