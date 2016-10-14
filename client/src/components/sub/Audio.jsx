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
      waveformDisplay: 'hidden',
      loadingDisplay: 'block',
      loadVal: 0,
      clicked: false,
      currentTime: 0,
    };
    // set default audio length to approximate length saved in room.
    this.audioLength = this.formatTime(this.props.room.roomInfo.timeLength / 1000);

    // bind functions for effiency
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
  //  takes a state of the player, either 'playing' or 'paused', and generates highlighting of notes.
  sendStatus(actionState) {
    //  gets current time of waveform and the current timestamp array
    const timestamps = this.props.note.audioTimestampArray;
    let wavePos = this.props.note.waveform.getCurrentTime();
    //  gets next note timestamp after current wave position
    for (var i = 0; i < timestamps.length; i++) {
      if (timestamps[i] > wavePos) {
        //  clears old timeout if exists
        if (window.timer) {
          window.clearTimeout(window.timer);
        }
        let upcomingNoteIndex = i;
        //  self-calling settimeout which updates highlighting based on next note
        const updateNote = (idx) => {
          let audioTimestamps = this.props.note.audioTimestampArray;
          //  assigns highlighting to note 'idx'
          this.props.dispatch(setClass(idx));

          let diff = audioTimestamps[idx + 1] - wavePos;
          wavePos = wavePos + diff;
          idx++;
          //  calculates next timestamp and then reassigns timeout
          if (audioTimestamps[idx] > -1) {
            window.timer = window.setTimeout(updateNote.bind(this, idx), diff * 1000);
          }
        };
        //  if paused, just assign current highlight. else, trigger self-calling settimeout
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

  // change playing value in the redux store to true or false
  handleTogglePlay() {
    if (this.props.waveform.playing) {
      this.sendStatus('paused');
    } else {
      this.sendStatus('playing');
    }
    this.props.dispatch(togglePlay());
  }

  // Calls sendStatus when the waveform is clicked
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

  /*  
    once the waveform has loaded the audio file
      - change audioLength to the actual audio length
      - make the waveform visible and hide the placeholder message
      - set an interval to update the current time  
  */
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

  // set the loading value of the audio file
  handleLoading(e) {
    this.setState({loadVal: e.originalArgs[0]});
  }

  /* 
    stop updating currentTime when audio file is done playing
    set waveform position to 0 to replay audio on play button click
  */
  onFinish() {
    this.props.dispatch(removeTimer());
    this.props.dispatch({type: 'STOP_PLAY'});
    this.props.dispatch(setPos(0));
  }

  handleClick() {
    window.setTimeout(this.setState.bind(this, {clicked: true}), 10);
  }

  // format seconds with decimals to mm:ss or hh:mm:ss
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
      // if audio is still being proccessed 
      msg = 'Processing audio Please check back later';
    } else {
      // if audio url was received
      if (this.state.loadVal === 100) {
        // if audio was loaded but still rendering waveform
        msg = 'Drawing waveform';
      } else {
        // if audio file is still being loaded
        msg = 'Loading audio file ' + this.state.loadVal;
      }
    }

    /*
      This will exclusively display the loading message or the audio player itself.
      
      The loading message is described above.

      The audio player contains
        - play/pause button
        - current time of the audio
        - the waveform
        - the total time/length of the audio
        - the volume control
    */
    return (
      <span className="audioContainer">
        <div style={{ display: this.state.loadingDisplay, position: 'absolute' }}>
          {msg}
        </div>
        <span className="audioPlayer" style={{visibility: this.state.waveformDisplay}}>
          <i onClick={this.handleTogglePlay.bind(this)} className={`fa ${this.props.waveform.playing ? 'fa-pause-circle' : 'fa-play-circle'} fa-3x text-primary playButton`}></i>

          <span className="currentTimestamp">{this.formatTime(this.state.currentTime)}</span>

          <span className="waveform" ref="wavesurfContainer" onClick={this.handleClick} >
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
