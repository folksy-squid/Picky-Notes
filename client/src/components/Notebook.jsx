import React from 'react';
import {connect} from 'react-redux';
import EntryList from './sub/EntryList.jsx';
import SearchBar from './sub/SearchBar.jsx';
import { Link } from 'react-router';

export class Notebook extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedClass: 'All',
      loaded: false
    };
  }

  componentWillMount() {
    const user = this.props.user.information[0];
    const context = this;
    $.ajax({
      method: 'GET',
      url: `/api/rooms?userId=${user.id}`,
      success: (entries) => {
        let lectures = entries.filter((entry) => entry.startTimestamp !== null);
        lectures.sort((a, b) => b.startTimestamp - a.startTimestamp);
        context.setState({loaded: true, original: lectures, entries: lectures});
      }
    });
  }

  filterKeyword(search) {
    let filtered = [];
    this.state.original.forEach((notebook) => {
      if (notebook.topic.toLowerCase().indexOf(search.toLowerCase()) === -1 && notebook.lecturer.toLowerCase().indexOf(search.toLowerCase()) === -1) { return; }
      if (notebook.class === this.state.selectedClass || this.state.selectedClass === 'All') {
        filtered.push(notebook);
      }
    });
    this.setState({ entries: filtered });
  }

  filterClass(selectedClass) {
    let filteredEntries = (selectedClass === 'All') ?
      this.state.original : this.state.original.filter((entry) => entry.class.toLowerCase() === selectedClass.toLowerCase());
    this.setState({ entries: filteredEntries, selectedClass: selectedClass});
  }

  removeEntry(i) {
    let newEntries = this.state.entries.slice();
    newEntries.splice(i, 1);
    this.setState({ entries: newEntries });
  }

  render() {
    return (
      this.state.loaded ? (
      <div className="container">
        <div className="row notebook-header">
          <div className="col-sm-6">
          </div>
          <div className="col-sm-6">
            <SearchBar entries={this.state.entries} filterClass={this.filterClass.bind(this)} filterKeyword={this.filterKeyword.bind(this)} />
          </div>
        </div>
        <div className="row">
          <EntryList entries={this.state.entries} removeEntry={this.removeEntry.bind(this)}/>
        </div>
      </div>
    ) : (<div></div>)
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state
  };
};

export default connect(mapStateToProps)(Notebook);
