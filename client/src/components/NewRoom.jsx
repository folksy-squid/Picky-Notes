import React from 'react';
import {mapStateToProps} from '../Connection.js';
import {connect} from 'react-redux';
import {createRoom} from '../actions/roomActions';
import {Router} from 'react-router';
class NewRoom extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      topic: undefined,
      className: undefined,
      lecturer: undefined
    };
  }
  static get contextTypes() {
    return {
      router: React.PropTypes.object.isRequired,
    };
  }

  handleInput(e) {
    if (e.target.id === 'topic') {
      this.setState({
        topic: e.target.value
      });
    }
    if (e.target.id === 'class') {
      this.setState({
        className: e.target.value
      });
    }
    if (e.target.id === 'lecturer') {
      this.setState({
        lecturer: e.target.value
      });
    }
  }

  formSubmit(el) {
    el.preventDefault();
    if (this.state.topic && this.state.className && this.state.lecturer) {
      var context = this;
      var createdRoom = function(success) {
        context.context.router.push(`/lobby/${success}`);
      };
      var data = {
        hostId: this.props.getState().user.information[0].id,
        topic: this.state.topic,
        className: this.state.className,
        lecturer: this.state.lecturer
      };
      var user = this.props.getState().user.information[0];

      this.props.dispatch(createRoom(data, user, createdRoom));
    } else {
      this.setState({error: true});
    }
  }

  render() {
    return (
      <div className="container new-room">
        <h2 className="new-room-title">New Room</h2>
        <form onSubmit={this.formSubmit.bind(this)} className="form-horizontal">
          <div className="form-group">
            <label className="control-label col-sm-2">Topic:</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="topic" placeholder="(i.e. The Battle of Waterloo)" onChange={this.handleInput.bind(this)}>
              </input>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2">Class:</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="class" placeholder="(i.e. World History)" onChange={this.handleInput.bind(this)}>
              </input>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2">Lecturer:</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="lecturer" placeholder="(optional)" onChange={this.handleInput.bind(this)}>
              </input>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-primary create-room">Create</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps)(NewRoom);
