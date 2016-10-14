import React from 'react';
import {NavDropdown, MenuItem} from 'react-bootstrap';
import {connect} from 'react-redux';

import NoteReducer from '../../reducers/noteReducers';
import RoomReducer from '../../reducers/roomReducers';
import UserReducer from '../../reducers/userReducers';
import EntryReducer from '../../reducers/entryReducers';

import {loadClassList, filterClassList} from '../../actions/entryActions';

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
  }

  renderListItems () {
    let allClasses = [<MenuItem key={-1} eventKey={-1}>All</MenuItem>];
    for (let i = 0; i < this.props.entry.classList.length; i++) {
      let key = i + 1;
      allClasses.push(
        <MenuItem key={key} eventKey={key}>{this.props.entry.classList[i]}</MenuItem>
      );
    }
    return allClasses;
  }

  select(e) {
    this.props.dispatch(filterClassList(e));
  }

  render() {
    return (
      <NavDropdown onSelect={this.select.bind(this)} title="Filter Class" id="basic-nav-dropdown">
        {this.renderListItems()}
      </NavDropdown>
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

export default connect(mapStateToProps)(Dropdown);
