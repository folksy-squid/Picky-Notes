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
    };
  }

  componentWillMount() {
    const user = this.props.user.information[0];
    const context = this;
    $.ajax({
      method: 'GET',
      url: `/api/users/${user.id}`
    })
    .then(entries => {
      let lectures = entries.filter((entry) => entry.startTimestamp !== null);
      lectures = lectures.sort((a, b) => b.startTimestamp - a.startTimestamp);
      context.props.dispatch(loadEntries(lectures));
      context.props.dispatch(loadClassList());
      context.setState({loaded: true});
    });
  }

  render() {

    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
        onClickSwitch: this.props.onClickSwitch,
        addSteps: this.props.addSteps,
        addToolTip: this.props.addToolTip,
        joyrideType: this.props.joyrideType,
        joyrideOverlay: this.props.joyrideOverlay
      })
    );

    return (
      this.state.loaded ? (
        <div className="main">
          <Navbar
            onClickSwitch={this.props.onClickSwitch}
            addSteps={this.props.addSteps}
            addToolTip={this.props.addToolTip}
            joyrideType={this.props.joyrideType}
            joyrideOverlay={this.props.joyrideOverlay}
            checkFilter={this.props.route.checkFilter} />
          {childrenWithProps}
        </div>
      ) : (<div></div>)
    );
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

export default connect(mapStateToProps)(Main);
