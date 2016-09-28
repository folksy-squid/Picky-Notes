import React from 'react';
import Connection from '../Connection.js'
import EntryList from './sub/EntryList.jsx'
import SearchBar from './sub/SearchBar.jsx'
import { Link } from 'react-router';

class Notebook extends React.Component {
  constructor (props) {
    super(props);
    console.log('state:', this.state);
    console.log('props:', props);
  }

  render(){
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-5">
            <h3>My Notebook</h3>
          </div>
          <div className="col-xs-7">
            <SearchBar />
          </div>
        </div>
        <div className="row">
          <EntryList />
        </div>
      </div>
    )
  }
}

export default Connection(Notebook);