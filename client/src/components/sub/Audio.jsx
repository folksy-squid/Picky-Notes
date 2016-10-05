import React, {Component} from 'react';
import {connect} from 'react-redux';
require('wavesurfer.js');
import Wavesurfer from 'react-wavesurfer';
import WaveformReducer from '../../reducers/waveformReducers';
import RoomReducer from '../../reducers/roomReducers';
import {getRoomAudio, setRoomInfo} from '../../actions/roomActions';
import {togglePlay, setPos, setVolume, setAudioRateChange} from '../../actions/waveformActions';

class Audio extends React.Component {
  constructor(props) {
    super(props);

    this.handleAudioRateChange = this.handleAudioRateChange.bind(this);
    this.handleTogglePlay = this.handleTogglePlay.bind(this);
    this.handlePosChange = this.handlePosChange.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.handleReady = this.handleReady.bind(this);
  }
  componentWillMount() {
    this.props.dispatch(getRoomAudio(this.props.room.roomInfo.pathUrl));
  }
  handleAudioRateChange(e) {
    this.props.dispatch(setAudioRateChange(+e.target.value));
    // this.setState({
    //   audioRate: +e.target.value
    // });
  }

  handleTogglePlay() {
    this.props.dispatch(togglePlay());
    // this.setState({
    //   playing: !this.state.playing
    // });
  }

  handlePosChange(e) {
    this.props.dispatch(setPos(e.originalArgs ? e.originalArgs[0] : +e.target.value));
    // this.setState({
    //   pos: e.originalArgs ? e.originalArgs[0] : +e.target.value
    // });
  }

  handleReady() {
    this.props.dispatch(setPos(5));
    // this.setState({
    //   pos: 5
    // });
  }

  handleVolumeChange(e) {
    this.props.dispatch(setVolume(+e.target.value));
    // this.setState({
    //   volume: +e.target.value
    // });
  }

  render() {
    const waveOptions = {
      scrollParent: true,
      height: 140,
      progressColor: 'rgba(48,125,125,1)',
      waveColor: 'rgba(131, 187, 187, 0.6)',
      normalize: true,
      autoCenter: true,
      barWidth: 4,
      audioRate: this.props.waveform.audioRate,
      cursorWidth: 5,
      cursorColor: 'rgba(100, 50, 50, 1)'
    };
    return (
      <div className="example col-xs-12">
        <h3>State & UI</h3>
        <div className="row">
          <div className="form-group col-xs-4">
            <label htmlFor="simple-volume">Volume:</label>
            <input
              name="simple-volume"
              type="range"
              min={0}
              max={1}
              step="0.01"
              value={this.props.waveform.volume}
              onChange={this.handleVolumeChange}
              className="form-control"
            />
            <input
              className="form-control prop-value"
              type="text"
              placeholder={String(this.props.waveform.volume)}
              readOnly
            />
          </div>

          <div className="form-group col-xs-4">
            <label htmlFor="simple-playing">Playing:</label>
            <button onClick={this.handleTogglePlay} className="btn btn-primary btn-block">
              toggle play
            </button>
            <input
              name="simple-playing"
              className="form-control prop-value"
              type="text"
              placeholder={String(this.props.waveform.playing)}
              readOnly
            />
          </div>
          <div className="form-group col-xs-4">
            <label htmlFor="simple-pos">Position:</label>
            <input
              name="simple-pos"
              type="number"
              step="0.01"
              value={this.props.waveform.pos}
              onChange={this.handlePosChange}
              className="form-control"
            />
            <p>Should set to 5 seconds on load.</p>
          </div>
          <div className="form-group col-xs-4">
            <label htmlFor="simple-audiorate">Audio rate:</label>
            <input
              name="simple-audiorate"
              type="range"
              min="0"
              max="10"
              step="0.001"
              value={this.props.waveform.audioRate}
              onChange={this.handleAudioRateChange}
              className="form-control"
            />
            <p>Should set to 5 seconds on load.</p>
          </div>
          <div className="form-group col-xs-4">
            <label htmlFor="update-simple-pos">Set Position:</label>
            <input
              name="update-simple-pos"
              type="number"
              step="0.01"
              onChange={this.handlePosChange}
              className="form-control"
            />
            <p>Should set to 5 seconds on load.</p>
          </div>
        </div>
        <Wavesurfer
          volume={this.props.waveform.volume}
          pos={this.props.waveform.pos}
          options={waveOptions}
          onPosChange={this.handlePosChange}
          audioFile={this.props.room.roomInfo.audioUrl}
          onReady={this.handleReady}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    WaveformReducer,
    RoomReducer
  };
};

export default connect(mapStateToProps)(Audio);
