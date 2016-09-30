import React from 'react';
import Connection from '../../Connection.js';

class InputBox extends React.Component {
  constructor (props) {
    super(props);
  }

  // view will alter depending on the page it's on.
  render(){
    var view;
    if (this.props.page === 'Compile') {
      view = (
        <input>
          'this is the input box for Compile'
        </input>)
    } else {
      view = (
        <input></input>)
    }

    return view;
  }
}

export default Connection(InputBox);