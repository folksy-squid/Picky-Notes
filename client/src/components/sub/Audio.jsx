import React, {Component} from 'react';
import {connect} from 'react-redux';
require('wavesurfer.js');
import Wavesurfer from 'react-wavesurfer';
import WaveformReducer from '../../reducers/waveformReducers';
import RoomReducer from '../../reducers/roomReducers';
import {getRoomAudio, setRoomInfo} from '../../actions/roomActions';
import {highlightNote, setClass, removeTimer} from '../../actions/noteActions';
import {togglePlay, setPos, setVolume, play, setAudioRateChange, checkWavePos} from '../../actions/waveformActions';

class Audio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: 'false',
      waveformDisplay: 'hidden',
      loadingDisplay: 'block',
      loadVal: 0,
      clicked: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getRoomAudio(this.props.room.roomInfo.pathUrl, (err, success) => {
      if (err) {
        this.setState({loaded: false});
      } else {
        this.setState({loaded: true});
      }
    }));
  }

  handleAudioRateChange(e) {
    this.props.dispatch(setAudioRateChange(+e.target.value));
    // this.setState({
    //   audioRate: +e.target.value
    // });
  }

  sendStatus(actionState) {
    const wavePos = this.props.waveform.pos;
    const timestamps = this.props.note.audioTimestampArray;
    for (var i = 0; i < timestamps.length; i++) {
      if (timestamps[i] > wavePos) {
        return this.props.dispatch(setClass(i, wavePos, actionState));
      }
    }
  }

  handleTogglePlay() {
    if (this.props.waveform.playing) {
      this.sendStatus('paused');
    } else {
      this.sendStatus('playing');
    }
    this.props.dispatch(togglePlay());
  }

  handlePosChange(e) {
    this.props.dispatch(setPos(e.originalArgs ? e.originalArgs[0] : +e.target.value));
    if (this.state.clicked === true) {
      this.setState({clicked: false});
      if (this.props.waveform.playing) {
        this.sendStatus('playing');
      } else {
        this.sendStatus('paused');
      }
    }
  }

  handleReady() {
    this.setState({waveformDisplay: 'visible', loadingDisplay: 'none'});
  }

  handleVolumeChange(e) {
    this.props.dispatch(setVolume(+e.target.value));
  }

  handleLoading(e) {
    this.setState({loadVal: e.originalArgs[0]});
  }

  onFinish() {
    this.props.dispatch(removeTimer());
    this.props.dispatch(togglePlay());
  }

  handleClick() {
    window.setTimeout(this.setState.bind(this, {clicked: true}), 10);
  }

  render() {
    const waveOptions = {
      fillParent: true,
      height: 50,
      progressColor: 'rgba(48,125,125,1)',
      waveColor: 'rgba(131, 187, 187, 0.6)',
      autoCenter: false,
      barWidth: 3,
      audioRate: this.props.waveform.audioRate,
      cursorWidth: 2,
      cursorColor: 'rgba(100, 50, 50, 1)',
      normalize: true
    };
    return (
      <div className="row">
        <div style={{display: this.state.loadingDisplay}}>
            LOADING AUDIO FILE {this.state.loadVal}
        </div>
        <div className="col-md-1">
          <i onClick={this.handleTogglePlay.bind(this)} className={`fa ${this.props.waveform.playing ? 'fa-pause-circle' : 'fa-play-circle'} fa-3x text-primary playButton`}></i>
        </div>
        <div className="col-md-10" ref="wavesurfContainer" onClick={this.handleClick.bind(this)} style={{visibility: this.state.waveformDisplay}}>
          <Wavesurfer
            volume={this.props.waveform.volume}
            pos={this.props.waveform.pos}
            options={waveOptions}
            onPosChange={this.handlePosChange.bind(this)}
            audioFile={this.props.room.roomInfo.audioUrl}
            playing={this.props.waveform.playing}
            onReady={this.handleReady.bind(this)}
            onLoading={this.handleLoading.bind(this)}
            onFinish={this.onFinish.bind(this)}
          />
        </div>
        <div className="col-md-1">
        <input
          name="simple-volume"
          type="range"
          min={0}
          max={1}
          step="0.01"
          value={this.props.waveform.volume}
          onChange={this.handleVolumeChange.bind(this)}
          className="form-control"
          orient="vertical"
        />
        </div>
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
