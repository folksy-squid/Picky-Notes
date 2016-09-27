import React from 'react';
import Connection from '../../Connection.js';
import Entry from './Entry.jsx';

// See below example for rendering with map.

/*
<div class="container-fluid">
  {props.entries.map(entry, i)=>(
  <Entry url={entry.url}/>
  )}
</div>
*/

const EntryList = (props) => (
  <div className="container-fluid">
    <Entry />
  </div>
);


export default Connection(EntryList);
