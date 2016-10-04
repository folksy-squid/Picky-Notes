import React, {Component} from 'react';
import Message from './Message.jsx'
import {} from '../../actions/chatActions'

export default class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
  }

  sendMessage (e) {
    console.log('the message that should be sent:', e.target.value)
    this.props.dispatch(sendMessage(this.props.socket, e.target.value));
    e.target.value = '';
  }

  render() {
    return (
    <div className="chatbox panel">
      <h4 className="panel-heading">
        Chattt here!!
      </h4>
      <div className="panel-body message-list">
        <ul className="media-list">
          Messages with {this.state.view} view
          {this.state.messages.map((message, i)=>(<Message key={i} message={message} />)
          )}
        </ul>
      </div>
      <div className="panel-footer">
        <div className="input-group">
          <input type="text" className="form-control" onSubmit={this.sendMessage.bind(this)} placeholder="Enter Message" />
          <span className="input-group-btn">
            <button className="btn btn-info" type="submit">SEND</button>
          </span>
        </div>
      </div>
    </div>
    );
  }
}
