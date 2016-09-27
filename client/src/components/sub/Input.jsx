import Connection from '../../Connection.js'

class Input extends React.Component {
  constructor (props) {
    super(props)
  }

  // view will alter depending on the page it's on.
  render(){
    var view;
    if (props.page === 'Compile') {
      view = (
        <input>
          'this is the input box for Compile'
        </input>)
    } else {
      view = (
        <input>
          'this is the input box for Lecture'
        </input>)
      )
    }

    return view;
  }
}

export default Connection(Input)