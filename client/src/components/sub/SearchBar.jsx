import React from 'react';
import {Navbar as Navigation, FormGroup, FormControl} from 'react-bootstrap';
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

  componentDidMount() {
    var data = {
      title: 'test',
      text: '<h2 style="margin-bottom: 10px; line-height: 1.6">Now you can open tooltips independently!</h2>And even style them one by one!',
      selector: '#step1 a',
      position: 'bottom',
      event: 'hover',
      style: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 0,
        color: '#fff',
        mainColor: '#ff67b4',
        textAlign: 'center',
        width: '29rem'
      }
    }
    // this.props.addToolTip(data)
  }

  getUserInput (e) {
    this.props.dispatch(filterKeyword(e.target.value));
  }

  render() {
    return (
      <li id="step1" role="presentation">
        <Navigation.Form>
          <FormGroup>
            <FormControl type="text" placeholder="Search" onChange={this.getUserInput.bind(this)}/>
          </FormGroup>
        </Navigation.Form>
      </li>
    )
  }

}

const mapStateToProps = (state, ownProps) => {
  return {
    ...state,
    ...ownProps,
    RoomReducer,
    UserReducer,
    NoteReducer,
    EntryReducer
  };
};

export default connect(mapStateToProps)(SearchBar);
