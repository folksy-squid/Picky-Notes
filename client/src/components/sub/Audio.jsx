import React, {Component} from 'react';
import {connect} from 'react-redux';
require('wavesurfer.js');
import Wavesurfer from 'react-wavesurfer';
import WaveformReducer from '../../reducers/waveformReducers';
import RoomReducer from '../../reducers/roomReducers';
import {getRoomAudio, setRoomInfo} from '../../actions/roomActions';
import {highlightNote, setClass, removeTimer} from '../../actions/noteActions';
import {togglePlay, setPos, setVolume, play, setAudioRateChange, checkWavePos} from '../../actions/waveformActions';

export class Audio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: 'false',
      waveformDisplay: 'hidden',
      loadingDisplay: 'block',
      loadVal: 0,
      clicked: false,
    };
    this.audioLength = this.formatTime(this.props.room.roomInfo.timeLength / 1000);
    this.handleClick = this.handleClick.bind(this);
    this.handlePosChange = this.handlePosChange.bind(this);
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

  throttle(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) { options = {}; }
    var later = function() {
      previous = options.leading === false ? 0 : Date.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) { context = args = null; }
    };
    return function() {
      var now = Date.now();
      if (!previous && options.leading === false) { previous = now; }
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) { context = args = null; }
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  }

  handleReady(arg1) {
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
    this.props.dispatch({type: 'STOP_PLAY'});
    this.props.dispatch(setPos(0));
  }

  handleClick() {
    window.setTimeout(this.setState.bind(this, {clicked: true}), 10);
  }

  formatTime(decimalSeconds) {
    let seconds = ~~decimalSeconds;
    let minutes = ~~(seconds / 60);
    let hours = ~~(minutes / 60);
    seconds = seconds % 60;
    minutes = minutes % 60;

    let time = hours ? hours + ':' : '';
    time += minutes < 10 ? '0' + minutes + ':' : minutes + ':';
    time += seconds < 10 ? '0' + seconds : seconds;

    return time;
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
      <span className="audioContainer">
        <div style={{ display: this.state.loadingDisplay, position: 'absolute' }}>
          LOADING AUDIO FILE {this.state.loadVal}
        </div>
        <span className="audioPlayer" style={{visibility: this.state.waveformDisplay}}>
          <i onClick={this.handleTogglePlay.bind(this)} className={`fa ${this.props.waveform.playing ? 'fa-pause-circle' : 'fa-play-circle'} fa-3x text-primary playButton`}></i>

          <span>{this.formatTime(this.props.waveform.pos)}</span>

          <span className="waveform" ref="wavesurfContainer" onClick={this.handleClick.bind(this)} >
            <Wavesurfer
              volume={this.props.waveform.volume}
              pos={this.props.waveform.pos}
              options={waveOptions}
              onPosChange={this.handlePosChange}
              audioFile={this.props.room.roomInfo.audioUrl}
              playing={this.props.waveform.playing}
              onReady={this.handleReady.bind(this)}
              onLoading={this.handleLoading.bind(this)}
              onFinish={this.onFinish.bind(this)}
              isLoaded={this.state.shouldBeLoaded}
            />
          </span>

          <span>{this.audioLength}</span>

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
        </span>
      </span>
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
