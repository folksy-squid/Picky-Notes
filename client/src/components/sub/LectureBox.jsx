import React from 'react';
import {connect} from 'react-redux';
import NoteList from './NoteList.jsx';
import InputBox from './InputBox.jsx';
import {getCurrentView} from '../../helpers.js';


class LectureBox extends React.Component {
  constructor (props) {
    super(props);
    var pathname = props.routing.locationBeforeTransitions.pathname;
    var currentView = getCurrentView(pathname);
    this.state = {
      view: currentView,
      tab: 'Notes'
    };
  }

  toggleView(type) {
    if (type === 'Notes') {
      this.setState({tab: 'Notes'});
    } else if (type === 'Thoughts') {
      this.setState({tab: 'Thoughts'});
    }
  }

  render() {
    let view = (
      <div className="lecture-box lecture-view-heading">
        <h4>Notes & Thoughts</h4>
        <NoteList />
      </div>
    );

    if (this.state.view === 'compile') {
      view = (
        <div className="lecture-box">
          <ul className="nav nav-tabs">
            <li className={this.state.tab === 'Notes' ? 'active' : ''}>
              <a onClick={this.toggleView.bind(this, 'Notes')}>Notes</a>
            </li>
            <li className={this.state.tab === 'Thoughts' ? 'active' : ''}>
              <a onClick={this.toggleView.bind(this, 'Thoughts')}>Thoughts</a>
            </li>
          </ul>
          <div>
            <NoteList tab={this.state.tab}/>
          </div>
        </div>
      );
    }
    return view;
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(LectureBox);
