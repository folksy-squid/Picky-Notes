import React, {Component} from 'react';

export default ({message, timestamp, sender, pictureUrl})=>(
  <li className="media">
    <div className="media-body">
      <div className="media">
        <a className="pull-left" href="#">
          <img className="message-picture media-object" src={pictureUrl} />
        </a>
        <div className="media-body">
          <span className="message-sender">
            {sender}:
          </span>
          <span className="message-body">
            {message}
          </span>
          <small className="text-muted">
            {timestamp}
          </small>
        </div>
      </div>
    </div>
  </li>
)