import React, {Component} from 'react';
import {connect} from 'react-redux';
require('wavesurfer.js');
import Wavesurfer from 'react-wavesurfer';
import WaveformReducer from '../../reducers/waveformReducers';
import RoomReducer from '../../reducers/roomReducers';
import {getRoomAudio, setRoomInfo} from '../../actions/roomActions';
import {highlightNote, setClass, removeTimer, setWaveform} from '../../actions/noteActions';
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
      currentTime: 0
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

  componentWillUnmount() {
    window.clearInterval(this.state.interval);
  }

  sendStatus(actionState) {
    const timestamps = this.props.note.audioTimestampArray;
    const wavePos = this.props.note.waveform.getCurrentTime();
    for (var i = 0; i < timestamps.length; i++) {
      if (timestamps[i] > wavePos) {
        if (window.timer) {
          window.clearTimeout(window.timer);
        }

        let upcomingNoteIndex = i;
        let wavePos = this.props.note.waveform.getCurrentTime();

        const updateNote = (idx) => {
          let audioTimestamps = this.props.note.audioTimestampArray;
          this.props.dispatch(setClass(idx));

          let diff = audioTimestamps[idx + 1] - wavePos;
          wavePos = wavePos + diff;
          idx++;
          if (audioTimestamps[idx] > -1) {
            window.timer = window.setTimeout(updateNote.bind(this, idx), diff * 1000);
          }
        };
        let idx = upcomingNoteIndex - 1 < 0 ? 0 : upcomingNoteIndex - 1;
        if (actionState === 'paused') {
          this.props.dispatch(setClass(idx));
        } else {
          updateNote(idx);
        }
        return;
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
    // this.props.dispatch(setPos(e.originalArgs ? e.originalArgs[0] : +e.target.value));
    if (this.state.clicked === true) {
      this.setState({clicked: false});
      if (this.props.waveform.playing) {
        this.sendStatus('playing');
      } else {
        this.sendStatus('paused');
      }
    }
  }

  handleReady(arg1) {
    this.audioLength = this.formatTime( arg1.wavesurfer.getDuration() );
    this.props.dispatch(setWaveform(arg1.wavesurfer));
    this.setState({waveformDisplay: 'visible', loadingDisplay: 'none'});
    this.setState ({interval: setInterval(() => {
      this.setState({currentTime: this.props.note.waveform.getCurrentTime()});
    }, 100)});
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
    const url = this.props.room.roomInfo.audioUrl;
    let msg = '';

    if (url === 'audio url') {
      msg = 'Uploading audio. Please check back later.';
    } else {
      if (this.state.loadVal === 100) {
        msg = 'Drawing waveform';
      } else {
        msg = 'Loading audio file ' + this.state.loadVal;
      }
    }

    return (
      <span className="audioContainer">
        <div style={{ display: this.state.loadingDisplay, position: 'absolute' }}>
          {msg}
        </div>
        <span className="audioPlayer" style={{visibility: this.state.waveformDisplay}}>
          <i onClick={this.handleTogglePlay.bind(this)} className={`fa ${this.props.waveform.playing ? 'fa-pause-circle' : 'fa-play-circle'} fa-3x text-primary playButton`}></i>

          <span>{this.formatTime(this.state.currentTime)}</span>

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
