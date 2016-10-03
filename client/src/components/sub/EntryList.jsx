import React from 'react';
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
    {props.entries.map((entry, i) => {
      console.log('entry', entry);
      return <Entry key = {i} entry={entry}/>;
    })}
  </div>
);


export default EntryList;
