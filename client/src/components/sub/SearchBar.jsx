import React from 'react';
import Connection from '../Connection.js'
import { Link } from 'react-router';

const SearchBar = (props) => (
  <form class="navbar-form" role="search">
    <div class="form-group">
      <input type="text" class="form-control" placeholder="Search">
    </div>
    <button type="submit" class="btn btn-default">Go</button>
  </form>
)

export default Connection(SearchBar);