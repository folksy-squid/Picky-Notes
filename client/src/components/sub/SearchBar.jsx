import React from 'react';
import Connection from '../../Connection.js';
import { Link } from 'react-router';

const SearchBar = (props) => (
  <form className="navbar-form" role="search">
    <div className="form-group">
      <input type="text" className="form-control" placeholder="Search" />
    </div>
    <button type="submit" className="btn btn-default">Go</button>
  </form>
);

export default Connection(SearchBar);
