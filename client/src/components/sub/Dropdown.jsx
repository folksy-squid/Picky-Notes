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
    let allClasses = [<MenuItem key={0} eventKey={5.001}>All</MenuItem>];
    for (let i = 0; i < this.props.entry.classList.length; i++) {
      let key = Number(`5.${i + 1}`);
      if (i + 2 < 10) {
        key = Number(`5.00${i + 1}`);
      }
      allClasses.push(
        <MenuItem key={i + 1} eventKey={key}>{this.props.entry.classList[i]}</MenuItem>
      );
    }
    return allClasses;
  }

  select(e) {
    this.props.dispatch(filterClassList(e));
  }

  render() {
    return (
      <NavDropdown onSelect={this.select.bind(this)} title="Filter Class" id="basic-nav-dropdown" eventKey={5}>
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
