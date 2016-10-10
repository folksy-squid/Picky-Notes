import React from 'react';
import Connection from '../../Connection.js';
import { Link } from 'react-router';

export default class Entry extends React.Component {
  constructor (props) {
    super(props);
  }

  static get contextTypes() {
    return {
      router: React.PropTypes.object.isRequired,
    };
  }

  clickHandler() {
    const pathUrl = this.props.entry.pathUrl;
    $.ajax({
      method: 'POST',
      url: '/api/room/status',
      contentType: 'application/json',
      data: JSON.stringify({pathUrl}),
      success: (res) => {
        if (res.active) {
          this.context.router.push(`/lecture/${this.props.entry.pathUrl}`);
        } else {
          this.context.router.push(`/review/${this.props.entry.pathUrl}`);
        }
      }
    });
  }

  render() {
    // Render an Entry component for each entry
    // (use map)
    return (
      <div className="col-sm-6 col-md-4 notebook-entry" onClick={this.clickHandler.bind(this)}>
        <div>{`${this.props.entry.topic} by ${this.props.entry.lecturer}`}</div>
        <img style={{maxHeight: '200px', maxWidth: '200px'}} src='https://image.freepik.com/free-icon/file-interface-symbol-of-a-white-page-with-one-folded-corner_318-41811.jpg' />
        <div>{`${this.props.entry.class}`}</div>
      </div>
    );
  }
}
