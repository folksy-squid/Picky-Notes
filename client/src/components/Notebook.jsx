import React from 'react';
import Connection from '../Connection.js'
import { Link } from 'react-router';

class Notebook extends React.Component {
  constructor (props) {
    super(props);
    console.log('state:', this.state);
    console.log('props:', props);
  }

  render(){
    return (
      <div class="container">
        <div class="row">
          <div class="col-xs-5">
            <h3>My Notebook</h3>
          </div>
          <div class="col-xs-7">
            <Searchbar />
          </div>
        </div>
        <div class="row">
          <EntryList />
        </div>
      </div>
    )
  }
}

export default Connection(Notebook);