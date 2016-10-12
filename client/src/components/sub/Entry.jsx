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
      <div className="col-xs-6 col-sm-4 col-md-3 notebook-entry" onClick={this.clickHandler.bind(this)}>
        <div className={`w3-card-4 notebook${this.props.classColor}`}>
          <div className="w3-container">
            <br />
            <div className='notebook-topic'>{`${this.props.entry.topic}`}</div>
            <div className='notebook-lecturer'>{`by ${this.props.entry.lecturer}`}</div>
            <div className='notebook-class'>{`${this.props.entry.class}`}</div>
            <br />
          </div>
        </div>
      </div>
    )

    // return (
    //   <div className="col-sm-6 col-md-4 notebook-entry" onClick={this.clickHandler.bind(this)}>
    //     <i className={`fa fa-sticky-note-o fa-5x notebook${this.props.classColor} notebook-icon`} aria-hidden="true"></i>
    //     <div className='notebook-topic'>{`${this.props.entry.topic}`}</div>
    //     <div className='notebook-lecturer'>{`by ${this.props.entry.lecturer}`}</div>
    //     <div className='notebook-class'>{`${this.props.entry.class}`}</div>
    //   </div>
    // );
  }
}
