import React from 'react';
import Connection from '../../Connection.js';
import { Link } from 'react-router';
import Dropdown from './Dropdown.jsx';

class SearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      allClasses: []
    };
  }

  componentWillMount() {
    this.getClassList();
  }

  getUserInput (e) {
    this.props.filterTopic(e.target.value);
  }

  getClassList () {
    var classList = {};
    var result = [];
    for (var i = 0; i < this.props.entries.length; i++) {
      var className = this.props.entries[i].class;
      classList[className] = className;
    }
    for (var key in classList) {
      this.state.allClasses.push(classList[key]);
    }
  }

  render() {
    return (
      <form className="navbar-form" role="search">
      <Dropdown list={this.state.allClasses} filterClass={this.props.filterClass} />
        <div className="form-group">
          <input type="text" className="form-control" placeholder="Filter..." onChange={this.getUserInput.bind(this)} />
        </div>
      </form>
    );
  }
}

export default Connection(SearchBar);
