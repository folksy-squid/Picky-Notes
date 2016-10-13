import React from 'react';
import {Navbar as Navigation, FormGroup, FormControl} from 'react-bootstrap'
import {connect} from 'react-redux';

import NoteReducer from '../../reducers/noteReducers';
import RoomReducer from '../../reducers/roomReducers';
import UserReducer from '../../reducers/userReducers';
import EntryReducer from '../../reducers/entryReducers';

import {filterKeyword} from '../../actions/entryActions';

export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
  }

  getUserInput (e) {
    this.props.dispatch(filterKeyword(e.target.value));
  }

  render() {
    return (
      <li role="presentation">
        <Navigation.Form>
          <FormGroup>
            <FormControl type="text" placeholder="Search" onChange={this.getUserInput.bind(this)}/>
          </FormGroup>
        </Navigation.Form>
      </li>
    )
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

export default connect(mapStateToProps)(SearchBar);
