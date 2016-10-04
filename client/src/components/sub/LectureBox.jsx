import React from 'react';
import {connect} from 'react-redux';
import NoteList from './NoteList.jsx';
import InputBox from './InputBox.jsx';

class LectureBox extends React.Component {
  constructor (props) {
    super(props);
  }

  toggleView(tab = 'notes') {
    if (tab === 'notes') {
      return true;
    }
    return false;
  }

  render() {
    return (
    <div className="lecture-box">
      <ul className="nav nav-tabs">
        <li className="active">
          <a href="#">Notes</a>
        </li>
        <li onClick={this.toggleView}>
          <a href="#">Thoughts</a>
        </li>
      </ul>
    { this.toggleView() ? (
      <div>
        <NoteList />
        <InputBox />
      </div>) : <div></div> }
    </div>
  );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
  }
};

export default connect(mapStateToProps)(LectureBox);
