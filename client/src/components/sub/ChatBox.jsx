import React, {Component} from 'react';
import {connect} from 'react-redux';
import Message from './Message.jsx'

class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: this.props.room.socket,
      messages: []
    };
  }

  componentDidMount() {
    this.state.socket.on('message received', this.messageReceived.bind(this));
  }

  messageReceived(user, message) {
    let timestamp = moment().format('LTS');

    // we have to use an array instead of an object here because we can't pass down objects in props
    var messageItem = [message, timestamp, user.name, user.pictureUrl];
    this.setState({
      messages: this.state.messages.concat([messageItem])
    })

    let messagelist = document.getElementById('message-list');
    messagelist.scrollTop = messagelist.scrollHeight;
  }

  sendMessage (e) {
    e.preventDefault();

    let input = this.refs.chatInput.value;
    let socket = this.state.socket;
    let user = this.props.user.information[0];

    if (input.trim().length === 0) { return; }
    socket.emit('sending message', user, input);
    this.refs.chatInput.value = '';
  }

  render() {
    return (
    <div className="chatbox panel panel-default">
      <div className="panel-heading">
        <h4>
          Chat here:
        </h4>
      </div>
      <div className="panel-body" id="message-list">
        <ul className="media-list">
          {this.state.messages.length > 0 && this.state.messages.map((message, i)=>(<Message key={i} message={message[0]} timestamp={message[1]} sender={message[2]} pictureUrl={message[3]} />)
          )}
        </ul>
      </div>
      <div className="panel-footer">
        <form className="input-group" onSubmit={this.sendMessage.bind(this)}>
          <input type="text" ref="chatInput" className="form-control" placeholder="Enter Message" />
          <span className="input-group-btn">
            <button className="btn btn-info" type="submit">SEND</button>
          </span>
        </form>
      </div>
    </div>
    );
  }
}

const mapStateToProps = (state) => ({...state});

export default connect(mapStateToProps)(ChatBox)