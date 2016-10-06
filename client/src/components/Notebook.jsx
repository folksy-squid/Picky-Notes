import React from 'react';
import Connection from '../Connection.js';
import EntryList from './sub/EntryList.jsx';
import SearchBar from './sub/SearchBar.jsx';
import { Link } from 'react-router';

class Notebook extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loaded: false
    };
    // console.log('state:', this.state);
    // console.log('props:', props);
  }

  componentWillMount() {
    const user = this.props.getState().user.information[0];
    const context = this;
    console.log('user', user);
    $.ajax({
      method: 'GET',
      url: `/api/users/rooms/${user.id}`,
      success: (entries) => {
        let lectures = entries.filter((entry) => entry.startTimestamp !== null);
        lectures.sort((a, b) => b.startTimestamp - a.startTimestamp);
        context.setState({loaded: true, entries: lectures});
      }
    });
  }

  render() {
    return (
      this.state.loaded ? (
      <div className="container">
        <div className="row">
          <div className="col-sm-8">
            <h3>My Lectures</h3>
          </div>
          <div className="col-sm-4">
            <SearchBar />
          </div>
        </div>
        <div className="row">
          <EntryList entries={this.state.entries}/>
        </div>
      </div>
    ) : (<div></div>)
    );
  }
}

export default Connection(Notebook);
