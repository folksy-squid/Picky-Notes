import React from 'react';
import Entry from './Entry.jsx';
var Masonry = require('react-masonry-component');
// See below example for rendering with map.

/*
<div class="container-fluid">
  {props.entries.map(entry, i)=>(
  <Entry url={entry.url}/>
  )}
</div>
*/

const masonryOptions = {
  columnWidth: 280
}


const EntryList = (props) => (
  <div className="grid">
    <Masonry
      options= {masonryOptions}
      disableImagesLoaded={false} // default false
      updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
      >
      {props.entries.map((entry, i) => <Entry key={i} index={i} entryInfo={entry} classColor={entry.id % 5} removeEntry={props.removeEntry}/>)}
    </Masonry>
  </div>
);

export default EntryList;
