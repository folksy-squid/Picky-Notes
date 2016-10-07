import React, {Component} from 'react';
import {connect} from 'react-redux';
require('wavesurfer.js');
import Wavesurfer from 'react-wavesurfer';
import WaveformReducer from '../../reducers/waveformReducers';
import RoomReducer from '../../reducers/roomReducers';
import {getRoomAudio, setRoomInfo} from '../../actions/roomActions';
import {highlightNote, setTimer, removeTimer} from '../../actions/noteActions';
import {togglePlay, setPos, setVolume, play, setAudioRateChange, checkWavePos} from '../../actions/waveformActions';

class Audio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: 'false',
      waveformDisplay: 'hidden',
      loadingDisplay: 'block',
      loadVal: 0
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

  handleTogglePlay() {
    this.props.dispatch(removeTimer());
    if (this.props.waveform.playing === false) {
      this.props.dispatch(togglePlay());
      setTimeout(() => {
        let timestamps = this.props.note.audioTimestampArray;
        console.log(timestamps);
        let wavePos = this.props.waveform.pos;
        for (var i = 0; i < timestamps.length; i++) {
          console.log('checking timestamps', timestamps[i]);
          if (timestamps[i] > wavePos) {
            console.log('this is the next timestamp', timestamps[i]);
            return this.props.dispatch(setTimer(i, wavePos));
          }
        }
      }, 10);
    } else {
      this.props.dispatch(togglePlay());
    }
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
    this.setState({waveformDisplay: 'visible', loadingDisplay: 'none'});
    this.props.dispatch(play());
    this.props.dispatch(setTimer(0, .001));

  }

  handleVolumeChange(e) {
    this.props.dispatch(setVolume(+e.target.value));
    // this.setState({
    //   volume: +e.target.value
    // });
  }

  handleLoading(e) {
    this.setState({loadVal: e.originalArgs[0]});
  }

  handleClick() {
    setTimeout(() => {
      let timestamps = this.props.note.audioTimestampArray;
      let wavePos = this.props.waveform.pos;
      for (var i = 0; i < timestamps.length; i++) {
        if (timestamps[i] > wavePos) {
          console.log('this is the next timestamp', timestamps[i]);
          return this.props.dispatch(setTimer(i, wavePos));
        }
      }
    }, 10);
    this.forceUpdate();
  }

  render() {
    const waveOptions = {
      scrollParent: true,
      height: 140,
      progressColor: 'rgba(48,125,125,1)',
      waveColor: 'rgba(131, 187, 187, 0.6)',
      autoCenter: true,
      barWidth: 4,
      audioRate: this.props.waveform.audioRate,
      cursorWidth: 3,
      cursorColor: 'rgba(100, 50, 50, 1)'
    };
    return (
      <div className="example col-xs-12">
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
              onChange={this.handleVolumeChange.bind(this)}
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
            <button onClick={this.handleTogglePlay.bind(this)} className="btn btn-primary btn-block">
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
        </div>
        <div style={{display: this.state.loadingDisplay}}>
          LOADING AUDIO FILE {this.state.loadVal}
        </div>
        <div ref="wavesurfContainer" onClick = {this.handleClick} style={{visibility: this.state.waveformDisplay}}>
          <Wavesurfer
            volume={this.props.waveform.volume}
            pos={this.props.waveform.pos}
            options={waveOptions}
            onPosChange={this.handlePosChange.bind(this)}
            audioFile={this.props.room.roomInfo.audioUrl}
            playing={this.props.waveform.playing}
            onReady={this.handleReady.bind(this)}
            onLoading={this.handleLoading.bind(this)}
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
