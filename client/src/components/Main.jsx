import React from 'react';
import { Link } from 'react-router';

class Main extends React.Component {
  constructor (props) {
    super(props)
    console.log('mains props:', props)
  }
  render(){
    return (
      <div>
        'THIS IS THE MAIN PAGE'
        {this.props.children}
      </div>
    )
  }
}

export default Main;