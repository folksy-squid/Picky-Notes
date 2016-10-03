import React, {Component} from 'react';
export default class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  render() {
    return (
    <div className="chatbox">
      <h4>
      Chattt here!!
      </h4>
      <div className="message-list">
        Messages with {this.state.view} view
        {this.state.messages.map((message, i)=>(<Message key={i} message={message} view={this.state.view}/>)
        )}
      </div>
    </div>
    );
  }
}
